BANKING_TERMS = {
    "high risk": "risk_score > 80",
    "default": "loan_status = 'default'",
    "delinquent": "payment_delay > 30"
}


def map_banking_terms(
    query: str
):

    mapped = []

    lower_query = query.lower()

    for term, condition in BANKING_TERMS.items():

        if term in lower_query:

            mapped.append(
                condition
            )

    return mapped