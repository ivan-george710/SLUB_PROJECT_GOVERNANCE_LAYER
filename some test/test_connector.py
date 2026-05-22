from app.integrations.connector_factory import get_connector


connector = get_connector("finance_db")
connector.connect()

available_tables = connector.get_tables()
print("Available tables:")
print(available_tables)

loan_columns = connector.get_columns("loans")
print("Columns in loans table:")
print(loan_columns)

query_results = connector.execute_query(
    "SELECT customer_name FROM loans LIMIT 2"
)
print("Query results:")
print(query_results)
