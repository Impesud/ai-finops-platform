# 🏗️ System Architecture

## Overview

The AI FinOps Platform follows a modular, microservices-
 inspired architecture to ensure scalability, maintainability,
 and a clear separation of concerns:

- **Backend API (FastAPI)**: Exposes RESTful endpoints for cost
  ingestion, querying, forecasting, and anomaly detection.
- **Data Ingestion Services**: Provider-specific modules (AWS,
  Azure, GCP) that fetch raw cost data, normalize it into a unified
  schema, and persist to CSV or a database.
- **Machine Learning Pipelines**: ETL, forecasting (e.g., XGBoost,
  Prophet), and anomaly detection (Isolation Forest) orchestrated
  via MLflow and Airflow.
- **Frontend UI (Next.js + React + TailwindCSS)**: A single-page
  application for interactive dashboards and cost explorers.
- **Infrastructure as Code (Terraform, Helm)**: Automated
  provisioning on AWS, GCP, and Azure; container orchestration via
  Kubernetes; monitoring with Prometheus & Grafana.

---

## Components

### 1. FastAPI Backend

- **API Gateway**: `/api/v1/ingestion`, `/api/v1/costs`,
  `/api/v1/forecast`, `/api/v1/anomalies`
- **Routing & Docs**: Auto-generated OpenAPI, Swagger UI
  (`/docs`), and ReDoc (`/redoc`).
- **Data Services**:
  - `cost_service.py`: Unified and per-provider cost queries,
    including a `provider` field in each record.
  - Ingestion routers trigger ingestion scripts via **POST**
    `/api/v1/ingestion`.

### 2. Data Ingestion Services

Located in `app/services/ingestion`:

```bash
services/ingestion/
├── base.py            # Abstract interface
├── aws_ingest.py      # AWS Cost Explorer ingestion
├── azure_ingest.py    # Azure Cost Management API ingestion
├── gcp_ingest.py      # BigQuery billing export ingestion
├── normalizer.py      # Converts raw source data to common schema
└── loader.py          # Persists unified CSVs
```

- Each provider class implements `.fetch(start, end)`.
- `normalize()` merges lists and tags records with `provider.`
- `save()` writes CSV files under `app/data/`.

### 3. Machine Learning Pipelines

- **ETL**: `etl.py` transforms CSVs into feature-ready dataframes.
- **Forecasting**: Notebooks using MLflow for model training and
  serving.
- **Anomaly Detection**: Isolation Forest on historical cost
  time series.

### 4. Frontend Dashboard

- **Next.js (App Router)** under `src/app/`:
  - `/costs` unified explorer
  - `/costs/aws`, `/costs/azure`, `/costs/gcp` pages
- **Components**: Navbar, cost tables, and charts (Recharts).
- **API Proxy**: `next.config.ts` rewrites API and docs paths to
  the FastAPI backend.

### 5. Infrastructure

- **Terraform**: Defines cloud resources (VPC, EKS/GKE/AKS clusters,
  IAM roles, BigQuery datasets).
- **Docker & Kubernetes**: Backend and frontend containers; Helm
  charts for deployment.
- **Monitoring**: Prometheus scrapes FastAPI metrics; Grafana
  dashboards visualize performance.

---

## Change Log

Last updated: July 2025
