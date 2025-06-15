# 🏗️ System Architecture

## Overview
The AI FinOps Platform is designed using a microservices-inspired architecture with clear separation between:

- Backend API (FastAPI)
- Machine Learning models and pipelines (Jupyter notebooks, MLflow)
- Frontend UI (React + TailwindCSS)
- Infrastructure as Code (Terraform, Helm)

## Components

### 1. FastAPI Backend
Handles:
- REST API endpoints (`/costs`, `/forecasts`, `/alerts`)
- Auth with OAuth2/JWT
- Data access via PostgreSQL and InfluxDB

### 2. AI/ML Pipeline
- ETL pipeline using Python
- Forecasting models (XGBoost, statsmodels)
- Anomaly detection (Isolation Forest)
- Deployed via MLflow

### 3. Frontend Dashboard
- Built with React
- Communicates with API for visualizations
- Uses Chart.js or Recharts for cost graphs

### 4. Infrastructure
- Provisioned with Terraform for AWS/GCP/Azure
- Deployed with Docker and Kubernetes (via Helm)
- Monitored with Prometheus + Grafana
