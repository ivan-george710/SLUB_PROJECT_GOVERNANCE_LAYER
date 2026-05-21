import pandas as pd

from tools.anomaly_detector import (
    detect_anomalies
)

from tools.rca_engine import (
    root_cause_analysis
)

from tools.recommendation_engine import (
    apply_recommendations
)


def run_risk_agent(data_path):

    df = pd.read_csv(data_path)

    print(
        "Running anomaly detection..."
    )

    df = detect_anomalies(df)

    print(
        "Running root cause analysis..."
    )

    rca = root_cause_analysis(df)

    print(
        "Generating recommendations..."
    )

    df = apply_recommendations(df)

    return df, rca