from app.services.etl import load_and_transform
import os
import pandas as pd

def get_cost_data(service=None, account_id=None, start_date=None, end_date=None):
    
    # Absolute path resolution inside container
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, '..', '..', 'data', 'aws_cost_explorer_1000.csv')
    data_path = os.path.abspath(data_path)

    # Sanity check
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"❌ CSV Dataset not found at: {data_path}")

    print(f"✅ Dataset loaded from: {data_path}")

    df = load_and_transform(data_path)

    # Apply filters
    if service:
        df = df[df["service"] == service]
    if account_id:
        df = df[df["account_id"].astype(str) == str(account_id)]
    if start_date:
        df = df[pd.to_datetime(df["date"]) >= pd.to_datetime(start_date)]
    if end_date:
        df = df[pd.to_datetime(df["date"]) <= pd.to_datetime(end_date)]

    # Convert account_id to string for consistent JSON responses
    df["account_id"] = df["account_id"].astype(str)

    # Return filtered data as list of dictionaries
    return df.to_dict(orient="records")



