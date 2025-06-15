"""
ETL module for loading and transforming AWS cost data.
"""

import pandas as pd

def load_and_transform(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M").astype(str)
    df["day"] = df["date"].dt.day
    df["weekday"] = df["date"].dt.day_name()
    df["year"] = df["date"].dt.year
    df["service"] = df["service"].astype("category")
    df["region"] = df["region"].astype("category")
    return df

