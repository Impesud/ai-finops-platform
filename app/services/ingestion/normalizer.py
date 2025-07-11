from datetime import date, datetime
from typing import Dict, List


def normalize(*args: List[Dict]) -> List[Dict]:
    """
    Flatten and unify raw ingestion records from multiple providers.
    Output records have common fields: date, provider, cost_usd.
    """
    unified = []
    for source in args:
        for rec in source:
            d = rec.get("date")
            # Convert date/datetime to ISO string, leave string as is
            if isinstance(d, (date, datetime)):
                d = d.isoformat()
            unified.append(
                {
                    "date": d,
                    "service": rec.get("service"),
                    "cost_usd": rec.get("cost_usd"),
                }
            )
    return unified
