from datetime import date
from typing import Dict, List

from google.cloud import bigquery

from .base import BaseIngest


class GcpIngest(BaseIngest):
    """
    Ingest GCP billing export data from BigQuery.
    Assumes billing export into a single partitioned table.
    Uses query parameters to avoid SQL-injection vectors.
    """

    def __init__(self, project_id: str, dataset: str, table: str):
        self.client = bigquery.Client(project=project_id)
        # table should be a trusted identifier
        self.table = f"{project_id}.{dataset}.{table}"

    def fetch(self, start: date, end: date) -> List[Dict]:
        sql = f"""
        SELECT
          DATE(usage_start_time) AS date, 
          service.description    AS service, 
          SUM(cost)              AS cost_usd
        FROM `{self.table}`"""  # nosec B608
        """WHERE DATE(_PARTITIONTIME) BETWEEN @start AND @end
        GROUP BY date, service
        ORDER BY date
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("start", "DATE", start),
                bigquery.ScalarQueryParameter("end", "DATE", end),
            ]
        )

        query_job = self.client.query(sql, job_config=job_config)
        rows = query_job.result()

        results: List[Dict] = []
        for row in rows:
            results.append(
                {
                    "date": row.date.isoformat(),
                    "service": row.service,
                    "cost_usd": float(row.cost_usd),
                }
            )
        return results
