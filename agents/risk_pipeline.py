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


def run_risk_pipeline(df):

    result = detect_anomalies(df)

    rca = root_cause_analysis(result)

    result = apply_recommendations(
        result
    )

    return {
        "data": result,
        "rca": rca
    }