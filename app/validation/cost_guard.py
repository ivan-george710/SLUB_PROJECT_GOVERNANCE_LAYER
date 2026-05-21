import sqlglot
from sqlglot import expressions


def parse_query(query: str) -> expressions.Expression | None:
    """Parse SQL text into a sqlglot expression tree."""
    try:
        return sqlglot.parse_one(query)
    except sqlglot.errors.ParseError:
        return None


def has_limit(parsed_query: expressions.Expression) -> bool:
    """Check whether the query has a LIMIT clause."""
    return parsed_query.find(expressions.Limit) is not None


def count_joins(parsed_query: expressions.Expression) -> int:
    """Count how many JOIN clauses the query uses."""
    joins = list(parsed_query.find_all(expressions.Join))
    return len(joins)


def uses_select_star(parsed_query: expressions.Expression) -> bool:
    """Check whether the query uses SELECT *."""
    for star in parsed_query.find_all(expressions.Star):
        return True

    return False


def analyze_query_cost(query: str) -> tuple[bool, list[str]]:
    """Apply simple safety rules that limit expensive queries."""
    parsed_query = parse_query(query)

    if parsed_query is None:
        return False, ["Invalid SQL syntax"]

    issues: list[str] = []

    if not has_limit(parsed_query):
        issues.append("Query must include a LIMIT clause")

    if count_joins(parsed_query) > 3:
        issues.append("Query cannot use more than 3 JOINs")

    if uses_select_star(parsed_query):
        issues.append("SELECT * is not allowed")

    return len(issues) == 0, issues
