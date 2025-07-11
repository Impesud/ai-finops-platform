# app/services/cost_service.py

import logging
import os
from datetime import date
from typing import Dict, List, Optional

import pandas as pd
from fastapi import HTTPException

from app.services.etl import load_and_transform

# ─── point DATA_DIR at app/data ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_DIR = os.path.join(APP_DIR, "data")

if not os.path.isdir(DATA_DIR):
    raise RuntimeError(f"Data folder not found: {DATA_DIR!r}")


def _apply_filters(
    df: pd.DataFrame,
    service: Optional[str],
    start_date: Optional[date],
    end_date: Optional[date],
) -> pd.DataFrame:
    if service:
        df = df[df["service"] == service]
    if start_date:
        df = df[pd.to_datetime(df["date"]) >= pd.to_datetime(start_date)]
    if end_date:
        df = df[pd.to_datetime(df["date"]) <= pd.to_datetime(end_date)]
    return df


def get_aws_cost_data(
    service: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> List[Dict]:
    csv_path = os.path.join(DATA_DIR, "aws_2025.csv")
    if not os.path.isfile(csv_path):
        raise HTTPException(500, f"AWS CSV not found at {csv_path!r}")
    df_raw = load_and_transform(csv_path)
    df_filt = _apply_filters(df_raw, service, start_date, end_date)
    df = df_filt.assign(provider="AWS")
    return df.to_dict(orient="records")


def get_azure_cost_data(
    service: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> List[Dict]:
    csv_path = os.path.join(DATA_DIR, "azure_2025.csv")
    if not os.path.isfile(csv_path):
        raise HTTPException(500, f"Azure CSV not found at {csv_path!r}")
    df_raw = load_and_transform(csv_path)
    df_filt = _apply_filters(df_raw, service, start_date, end_date)
    df = df_filt.assign(provider="Azure")
    return df.to_dict(orient="records")


def get_gcp_cost_data(
    service: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> List[Dict]:
    csv_path = os.path.join(DATA_DIR, "gcp_2025.csv")
    if not os.path.isfile(csv_path):
        raise HTTPException(500, f"GCP CSV not found at {csv_path!r}")
    df_raw = load_and_transform(csv_path)
    df_filt = _apply_filters(df_raw, service, start_date, end_date)
    df = df_filt.assign(provider="GCP")
    return df.to_dict(orient="records")


def get_cost_data(
    service: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> List[Dict]:
    """
    Unified fetch across AWS, Azure, and GCP CSVs.
    """
    merged: List[Dict] = []
    for fn in (get_aws_cost_data, get_azure_cost_data, get_gcp_cost_data):
        try:
            merged.extend(fn(service, start_date, end_date))
        except HTTPException:
            # skip missing provider
            continue

    if not merged:
        raise HTTPException(404, "No cost data found for the specified filters")

    # sort by date
    try:
        merged.sort(key=lambda r: date.fromisoformat(r["date"]))
    except Exception:
        logging.exception("Exception occurred in Cost Service")

    return merged
