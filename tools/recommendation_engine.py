def generate_recommendation(row):

    if (
        row["AMT_CREDIT"] > 1000000 and
        row["AMT_INCOME_TOTAL"] < 50000
    ):
        return (
            "High risk: reduce loan exposure"
        )

    return "Normal"

def apply_recommendations(df):

    df["recommendation"] = df.apply(
        generate_recommendation,
        axis=1
    )

    return df