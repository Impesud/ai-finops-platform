from datetime import date, timedelta
from typing import Dict, List, Optional

import boto3
from botocore.config import Config

from .base import BaseIngest


class AwsIngest(BaseIngest):
    def __init__(
        self, profile_name: Optional[str] = None, region_name: str = "us-east-1"
    ):
        session = (
            boto3.Session(profile_name=profile_name)
            if profile_name
            else boto3.Session()
        )
        self.client = session.client(
            "ce",
            region_name=region_name,
            config=Config(retries={"max_attempts": 3, "mode": "standard"}),
        )

    def fetch(self, start: date, end: date) -> List[Dict]:
        if start is None or end is None:
            raise ValueError("start and end dates must be provided")

        tp = {
            "Start": start.isoformat(),
            "End": (end + timedelta(days=1)).isoformat(),
        }  # exclusive

        results: List[Dict] = []
        token = None

        while True:
            params = {
                "TimePeriod": tp,
                "Granularity": "DAILY",
                "Metrics": ["UnblendedCost"],
                "GroupBy": [{"Type": "DIMENSION", "Key": "SERVICE"}],
            }
            if token:
                params["NextPageToken"] = token

            resp = self.client.get_cost_and_usage(**params)
            for day in resp.get("ResultsByTime", []):
                date_str = day["TimePeriod"]["Start"]
                for grp in day["Groups"]:
                    svc = grp["Keys"][0]
                    amount = float(grp["Metrics"]["UnblendedCost"]["Amount"])
                    results.append(
                        {
                            "date": date_str,
                            "service": svc,
                            "cost_usd": amount,
                        }
                    )

            token = resp.get("NextPageToken")
            if not token:
                break

        return results
