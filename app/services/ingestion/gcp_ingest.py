from datetime import date
from typing import List, Dict
from google.cloud import bigquery
from .base import BaseIngest

class GcpIngest(BaseIngest):
    """
    Ingest GCP billing export data from BigQuery.
    Assumes billing export into a single partitioned table.
    """
    def __init__(
        self,
        project_id: str,
        dataset: str,
        table: str,
    ):
        self.client = bigquery.Client(project=project_id)
        self.table = f"{project_id}.{dataset}.{table}"

    def fetch(self, start: date, end: date) -> List[Dict]:
        sql = f"""
        SELECT
          DATE(usage_start_time) AS date,
          service.description    AS service,
          SUM(cost)              AS cost_usd
        FROM `{self.table}`
        WHERE DATE(_PARTITIONTIME) BETWEEN '{start}' AND '{end}'
        GROUP BY date, service
        ORDER BY date
        """
        job = self.client.query(sql)
        rows = job.result()

        results: List[Dict] = []
        for row in rows:
            results.append({
                'date': row.date,
                'service': row.service,
                'cost_usd': float(row.cost_usd),
            })
        return results