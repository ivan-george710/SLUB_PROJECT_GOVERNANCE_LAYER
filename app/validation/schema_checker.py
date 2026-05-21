import sqlglot
from sqlglot import expressions

from app.integrations.connector_factory import get_connector


def parse_query(query: str) -> expressions.Expression | None:
    """Parse SQL text into a sqlglot expression tree."""
    try:
        return sqlglot.parse_one(query)
    except sqlglot.errors.ParseError:
        return None


def extract_table_names(parsed_query: expressions.Expression) -> set[str]:
    """Find all table names used by the query."""
    table_names: set[str] = set()

    for table in parsed_query.find_all(expressions.Table):
        table_names.add(table.name)

    return table_names


def extract_table_aliases(parsed_query: expressions.Expression) -> dict[str, str]:
    """Build a lookup from table alias to real table name."""
    aliases: dict[str, str] = {}

    for table in parsed_query.find_all(expressions.Table):
        if table.alias:
            aliases[table.alias] = table.name

        aliases[table.name] = table.name

    return aliases


def extract_column_references(
    parsed_query: expressions.Expression,
) -> list[tuple[str | None, str]]:
    """Find all column references as (table_or_alias, column_name)."""
    columns: list[tuple[str | None, str]] = []

    for column in parsed_query.find_all(expressions.Column):
        table_name = column.table or None
        column_name = column.name
        columns.append((table_name, column_name))

    return columns


def fetch_table_columns(
    table_names: set[str],
    connection_name: str,
) -> dict[str, set[str]]:
    """Read column names for the requested tables using a connector."""
    if not table_names:
        return {}

    connector = get_connector(connection_name)
    available_tables = connector.get_tables()
    table_columns: dict[str, set[str]] = {table_name: set() for table_name in table_names}

    for table_name in table_names:
        if table_name not in available_tables:
            continue

        columns = connector.get_columns(table_name)
        table_columns[table_name] = set(columns)

    return table_columns


def find_schema_issues(
    table_columns: dict[str, set[str]],
    table_aliases: dict[str, str],
    column_references: list[tuple[str | None, str]],
) -> list[str]:
    """Compare parsed table/column references with database metadata."""
    issues: list[str] = []

    for table_name, columns in table_columns.items():
        if not columns:
            issues.append(f"Table {table_name} does not exist")

    existing_tables = {
        table_name for table_name, columns in table_columns.items() if columns
    }

    for table_or_alias, column_name in column_references:
        if table_or_alias:
            table_name = table_aliases.get(table_or_alias, table_or_alias)

            if table_name not in existing_tables:
                continue

            if column_name not in table_columns[table_name]:
                issues.append(
                    f"Column {column_name} does not exist in table {table_name}"
                )

            continue

        matching_tables = [
            table_name
            for table_name in existing_tables
            if column_name in table_columns[table_name]
        ]

        if not matching_tables:
            issues.append(f"Column {column_name} does not exist")

        if len(matching_tables) > 1:
            issues.append(f"Column {column_name} is ambiguous")

    return issues


def validate_schema(
    query: str,
    connection_name: str = "postgres",
) -> tuple[bool, list[str]]:
    """Validate that SQL query tables and columns exist in PostgreSQL."""
    parsed_query = parse_query(query)

    if parsed_query is None:
        return False, ["Invalid SQL syntax"]

    table_names = extract_table_names(parsed_query)
    table_aliases = extract_table_aliases(parsed_query)
    column_references = extract_column_references(parsed_query)

    try:
        table_columns = fetch_table_columns(table_names, connection_name)
    except Exception as error:
        return False, [f"Database error: {error}"]

    issues = find_schema_issues(table_columns, table_aliases, column_references)

    return len(issues) == 0, issues
