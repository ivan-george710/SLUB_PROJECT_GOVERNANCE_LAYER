import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies(df):

    features = df[
        [
            "AMT_INCOME_TOTAL",
            "AMT_CREDIT",
            "DAYS_EMPLOYED"
        ]
    ]

    features = features.fillna(
        features.median()
    )

    iso = IsolationForest(
        contamination=0.01,
        random_state=42
    )

    iso.fit(features)

    df["anomaly"] = iso.predict(features)

    return df
    