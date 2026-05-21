from langchain_ollama import ChatOllama

from langchain.agents import create_agent

from langchain.tools import tool

import pandas as pd

from tools.anomaly_detector import (
    detect_anomalies
)


# LLM
llm = ChatOllama(
    model="llama3.1"
)


# TOOL
@tool
def anomaly_detection_tool() -> str:
    """
    Detect anomalies in customer loan data.
    """

    df = pd.read_csv(
        "data/application_train.csv"
    )

    result = detect_anomalies(df)

    anomalies = result[
        result["anomaly"] == -1
    ]

    return (
        f"Detected {len(anomalies)} "
        f"anomalies in customer data."
    )


# TOOL LIST
tools = [
    anomaly_detection_tool
]


# CREATE AGENT
agent = create_agent(
    model=llm,
    tools=tools
)


# RUN AGENT
response = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": (
                    "Analyze risky customers"
                )
            }
        ]
    }
)


print(response)