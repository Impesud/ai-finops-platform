from datetime import date
from typing import List, Dict
from azure.identity import DefaultAzureCredential
from azure.mgmt.costmanagement import CostManagementClient
from .base import BaseIngest

class AzureIngest(BaseIngest):
    """
    Ingest cost data from Azure Cost Management REST API.
    Requires a Service Principal configured via AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET,
    and the Cost Management Reader role on the subscription.
    """

    def __init__(self, subscription_id: str):
        credential = DefaultAzureCredential()
        self.client = CostManagementClient(credential)
        self.scope = f"/subscriptions/{subscription_id}"

    def fetch(self, start: date, end: date) -> List[Dict]:
        # Format dates with full ISO timestamp as Azure expects
        start_iso = start.strftime("%Y-%m-%dT00:00:00Z")
        end_iso = end.strftime("%Y-%m-%dT23:59:59Z")

        query = {
            "type": "Usage",
            "timeframe": "Custom",
            "timePeriod": {"from": start_iso, "to": end_iso},
            "dataset": {
                "granularity": "Daily",
                "aggregation": {"totalCost": {"name": "Cost", "function": "Sum"}},
            },
        }

        results: List[Dict] = []
        # Execute the query
        query_result = self.client.query.usage(self.scope, query)
        if not query_result or not query_result.rows:
            return results

        # Each row is a list of values matching the columns: date, service, cost
        for row in query_result.rows:
            # row[0]: date, row[1]: service, row[2]: cost
            results.append({
                "date": row[0],
                "service": row[1],
                "cost_usd": float(row[2]),
            })

        return results

