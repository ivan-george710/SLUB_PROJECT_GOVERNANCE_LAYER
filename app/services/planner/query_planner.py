def create_query_plan(
    query: str
):

    plan = {
        "aggregation": False,
        "grouping": False,
        "risk_analysis": False
    }

    query_lower = query.lower()

    if "total" in query_lower:
        plan["aggregation"] = True

    if "by" in query_lower:
        plan["grouping"] = True

    if "risk" in query_lower:
        plan["risk_analysis"] = True

    return plan