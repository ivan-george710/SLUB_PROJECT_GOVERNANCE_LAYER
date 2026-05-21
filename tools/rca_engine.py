import pandas as pd


def root_cause_analysis(df):

    normal = df[df["anomaly"] == 1]

    anomaly = df[df["anomaly"] == -1]

    comparison = pd.DataFrame({
        "Normal": normal.mean(numeric_only=True),
        "Anomaly": anomaly.mean(numeric_only=True)
    })

    comparison["Difference"] = (
        comparison["Anomaly"] -
        comparison["Normal"]
    )

    return comparison.sort_values(
        by="Difference",
        ascending=False
    )