# 🏗️ System Architecture

## Overview

The AI FinOps Platform follows a modular, microservices-inspired architecture to ensure scalability, maintainability, and clear separation of concerns:

- **Backend API (FastAPI)**: Exposes RESTful endpoints for cost ingestion, querying, forecasting, and anomaly detection.
- **Data Ingestion Services**: Provider-specific modules (AWS, Azure, GCP) that fetch raw cost data, normalize into a unified schema, and persist to CSV or database.
- **Machine Learning Pipelines**: ETL, forecasting (e.g., XGBoost, Prophet), and anomaly detection (Isolation Forest) orchestrated via MLflow and Airflow.
- **Frontend UI (Next.js + React + TailwindCSS)**: Single-Page Application for interactive dashboards and cost explorers.
- **Infrastructure as Code (Terraform, Helm)**: Automated provisioning on AWS, GCP, Azure; container orchestration via Kubernetes; monitoring with Prometheus & Grafana.

---

## Components

### 1. FastAPI Backend

- **API Gateway**: `/api/v1/ingestion`, `/api/v1/costs`, `/api/v1/forecast`, `/api/v1/anomalies`
- **Routing & Documentation**: Auto-generated OpenAPI, Swagger UI (`/docs`), ReDoc (`/redoc`)
- **Data Services**:
  - `cost_service.py`: Unified and per-provider cost queries, including `provider` field injection.
  - Ingestion routers trigger ingestion scripts via POST `/api/v1/ingestion`.

### 2. Data Ingestion Services

Located in `app/services/ingestion`:

```
services/ingestion/
├── base.py            # Abstract interface
├── aws_ingest.py      # AWS Cost Explorer ingestion
├── azure_ingest.py    # Azure Cost Management API ingestion
├── gcp_ingest.py      # BigQuery billing export ingestion
├── normalizer.py      # Converts raw source data to common schema
└── loader.py          # Persists unified CSV (aws_2025.csv, azure_2025.csv, gcp_2025.csv)
```

- Each provider class implements `.fetch(start, end)`
- `normalize()` merges lists and tags each record with `provider`
- `save()` writes CSVs under `app/data/`

### 3. Machine Learning Pipelines

- **ETL**: `etl.py` transforms CSVs into feature-ready DataFrames.
- **Forecasting**: Scripts and notebooks using MLflow for model training & serving.
- **Anomaly Detection**: Isolation Forest runs on historical cost time series.

### 4. Frontend Dashboard

- **Next.js (App Router)** under `src/app/`
  - `/costs` unified explorer
  - `/costs/aws`, `/costs/azure`, `/costs/gcp` provider-specific pages
- **Components**: Navbar, Cost tables, Charts (Recharts)
- **API Proxy**: `next.config.ts` rewrites API and docs paths to FastAPI backend

### 5. Infrastructure

- **Terraform**: Defines cloud resources (VPC, EKS/GKE/AKS clusters, IAM roles, BigQuery datasets)
- **Docker & Kubernetes**: Backend and frontend containers; Helm charts for deployment
- **Monitoring**: Prometheus scrapes FastAPI metrics; Grafana dashboards visualize performance

---

*Last updated: July 2025*