"""
ETL module for loading and transforming cloud cost CSVs (AWS, Azure, GCP).
"""

import pandas as pd


def load_and_transform(csv_path: str) -> pd.DataFrame:
    """
    Reads a CSV file containing cloud cost data and normalizes its schema.

    Expects at least the following columns:
      - date: date string in YYYY-MM-DD or parseable format
      - cost_usd: numeric cost in USD

    Optionally handles:
      - service
      - account_id
      - region
      - usage_type

    Adds derived columns:
      - month, day, weekday, year
    Casts categorical columns for efficiency.
    """

    # Load CSV
    df = pd.read_csv(csv_path)

    # Validate minimal required columns
    required = ["date", "cost_usd"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in CSV: {missing}")

    # Ensure optional columns exist
    if "service" not in df.columns:
        df["service"] = ""
    if "account_id" not in df.columns:
        df["account_id"] = ""

    # Parse date
    df["date"] = pd.to_datetime(df["date"])

    # Derive time dimensions
    df["month"] = df["date"].dt.to_period("M").astype(str)
    df["day"] = df["date"].dt.day
    df["weekday"] = df["date"].dt.day_name()
    df["year"] = df["date"].dt.year

    # Cast string columns
    df["service"] = df["service"].astype("category")
    df["account_id"] = df["account_id"].astype(str)

    # Cast optional categorical columns
    if "region" in df.columns:
        df["region"] = df["region"].astype("category")
    if "usage_type" in df.columns:
        df["usage_type"] = df["usage_type"].astype("category")

    # Ensure numeric cost
    df["cost_usd"] = pd.to_numeric(df["cost_usd"], errors="coerce").fillna(0.0)

    return df
