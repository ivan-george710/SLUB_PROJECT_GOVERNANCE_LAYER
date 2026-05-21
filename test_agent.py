from agents.risk_agent import (
    run_risk_agent
)

df, rca = run_risk_agent(
    "data/application_train.csv"
)

print(df.head())

print(rca.head())