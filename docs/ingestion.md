# Ingestion Module Documentation

This document provides an overview and usage details for the `app/services/ingestion`
directory in the AI FinOps Platform.

## Directory Structure

```plaintext
services/ingestion/
├── base.py            # Abstract interface for ingestion providers
├── aws_ingest.py      # AWS Cost Explorer ingestion implementation
├── azure_ingest.py    # Azure Cost Management ingestion implementation
├── gcp_ingest.py      # GCP BigQuery billing export ingestion implementation
├── normalizer.py      # Unifies raw records into a common schema
└── loader.py          # Persists unified records to CSV files
```

## Environment Variables

```bash
# AWS
AWS_PROFILE                    # AWS profile name
AWS_REGION                     # AWS region (default: us-east-1)

# Azure
AZURE_SUBSCRIPTION_ID          # Azure subscription ID
AZURE_TENANT_ID                # Azure tenant ID
AZURE_CLIENT_ID                # Azure client ID
AZURE_CLIENT_SECRET            # Azure client secret

# GCP
GOOGLE_APPLICATION_CREDENTIALS # Path to GCP JSON key
GCP_PROJECT_ID                 # GCP project ID
GCP_BQ_DATASET                 # BigQuery dataset name
GCP_BQ_TABLE                   # BigQuery table name
```

## base.py

**Path:** `services/ingestion/base.py`

Defines the abstract base class that all provider-specific ingestion classes
must implement.

```python
from datetime import date
from typing import List, Dict

class BaseIngest:
    """
    Abstract base class for cloud cost ingestion.
    """
    def fetch(self, start: date, end: date) -> List[Dict]:
        """
        Fetch raw cost records between start and end dates.
        Returns a list of dictionaries.
        """
        raise NotImplementedError
```

## aws\_ingest.py

**Path:** `services/ingestion/aws_ingest.py`

Implements `BaseIngest` to retrieve daily cost data from AWS Cost Explorer
using **boto3**.

```python
class AwsIngest(BaseIngest):
    def __init__(self,
                 profile_name: str = None,
                 region_name: str  = 'us-east-1'):
        ...

    def fetch(self, start: date, end: date) -> List[Dict]:
        # Uses get_cost_and_usage
        # Paginates with NextPageToken
        # Returns list of dicts with keys: service, date, cost_usd
```

**Usage:**

```bash
make fetch-aws
```

```python
from datetime import date
from app.services.ingestion.aws_ingest import AwsIngest

ingester = AwsIngest()
raw_aws  = ingester.fetch(date(2025, 1, 1), date(2025, 1, 31))
```

## azure\_ingest.py

**Path:** `services/ingestion/azure_ingest.py`

Implements `BaseIngest` to retrieve daily cost data from Azure Cost Management
via the **azure-mgmt-costmanagement** SDK.

```python
class AzureIngest(BaseIngest):
    def __init__(self, subscription_id: str):
        ...

    def fetch(self, start: date, end: date) -> List[Dict]:
        # Calls client.query.usage
        # Returns list of dicts with keys: service, date, cost_usd
```

**Environment:**

```bash
export AZURE_SUBSCRIPTION_ID=...
export AZURE_TENANT_ID=...
export AZURE_CLIENT_ID=...
export AZURE_CLIENT_SECRET=...
```

**Usage:**

```bash
make fetch-azure
```

```python
from datetime import date
from app.services.ingestion.azure_ingest import AzureIngest

ingester = AzureIngest(
    subscription_id=os.environ['AZURE_SUBSCRIPTION_ID']
)
raw_azure = ingester.fetch(date(2025, 1, 1), date(2025, 1, 31))
```

## gcp\_ingest.py

**Path:** `services/ingestion/gcp_ingest.py`

Implements `BaseIngest` to retrieve daily cost data from a BigQuery billing
export using **google-cloud-bigquery**.

```python
class GcpIngest(BaseIngest):
    def __init__(self,
                 project_id: str,
                 dataset:    str,
                 table:      str):
        ...

    def fetch(self, start: date, end: date) -> List[Dict]:
        # Uses parameterized queries to avoid SQL injection
        # Returns list of dicts with keys: service, date, cost_usd
```

**Environment:**

```bash
export GOOGLE_APPLICATION_CREDENTIALS='/path/to/key.json'
export GCP_PROJECT_ID='impesud-1336'
export GCP_BQ_DATASET='google_costs'
export GCP_BQ_TABLE='gcp_billing_export_v1'
```

**Usage:**

```bash
make fetch-gcp
```

```python
from datetime import date
from app.services.ingestion.gcp_ingest import GcpIngest

ingester = GcpIngest(
    project_id=os.environ['GCP_PROJECT_ID'],
    dataset=os.environ['GCP_BQ_DATASET'],
    table=os.environ['GCP_BQ_TABLE'],
)
raw_gcp = ingester.fetch(date(2025, 1, 1), date(2025, 1, 31))
```

## normalizer.py

**Path:** `services/ingestion/normalizer.py`

Unifies raw records from all providers into a common schema.

```python
def normalize(*sources: List[Dict]) -> List[Dict]:
    unified = []
    for source in sources:
        for rec in source:
            unified.append({
                'provider': rec['provider'],
                'service':  rec['service'],
                'date':     rec['date'],
                'cost_usd': rec['cost_usd'],
            })
    return unified
```

## loader.py

**Path:** `services/ingestion/loader.py`

Persists unified records to CSV files in `app/data`.

```python
from pathlib import Path
import csv
from typing import List, Dict

DATA_DIR = Path(__file__).resolve().parents[2] / 'data'
DATA_DIR.mkdir(parents=True, exist_ok=True)

def save(
    records:  List[Dict],
    filename: str = 'ingested_costs.csv'
) -> None:
    path = DATA_DIR / filename
    with open(path, 'w', newline='') as f:
        writer = csv.DictWriter(
            f,
            fieldnames=list(records[0].keys()) if records else []
        )
        if records:
            writer.writeheader()
            writer.writerows(records)
```

## Makefile Commands

```bash
make fetch-aws    # fetch & overwrite aws_2025.csv
make fetch-azure  # fetch & overwrite azure_2025.csv
make fetch-gcp    # fetch & overwrite gcp_2025.csv
make ingest-api   # POST /api/v1/ingestion to trigger all providers
```

---

## Change Log

Last updated: July 2025
