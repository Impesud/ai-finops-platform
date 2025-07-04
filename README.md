# AI FinOps Platform

## 🚀 Tech Stack Badges

![CI/CD](https://github.com/Impesud/ai-finops-platform/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-AF002A?logo=xgboost&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikit-learn&logoColor=white)
![statsmodels](https://img.shields.io/badge/statsmodels-1.0-blueviolet)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-black?logo=uvicorn)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-Red?logo=alembic)
![AWS](https://img.shields.io/badge/AWS-FF9900?logo=amazonaws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?logo=terraform&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![MLflow](https://img.shields.io/badge/MLflow-0194E2?logo=mlflow&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?logo=prometheus&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?logo=jupyter&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-secure-000000?logo=jsonwebtokens&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-parse-8A2BE2)

---

## 📖 Overview

**AI FinOps Platform** is an AI-powered platform for cloud cost optimization and forecasting. Built with FastAPI, Python, and modern MLOps tools, it allows teams to track multi-cloud usage (AWS, Azure, GPC), detect anomalies, and predict future expenses using real-time data and machine learning.

Key features:

- Unified ingestion pipelines for each provider
- Powerful REST API with FastAPI & OpenAPI docs
- Interactive React dashboard (Next.js + TailwindCSS)
- ML-driven forecasting & anomaly detection
- Full IaC deployment via Terraform & Helm

### Recent UI Updates
![FinOps frontend 01](docs/img/ai-finops-01.png)
![FinOps frontend 02](docs/img/ai-finops-02.png)
![FinOps frontend 03](docs/img/ai-finops-03.png)

---

## 🧱 Tech Stack

### Infrastructure & DevOps
- Terraform (infrastructure provisioning)
- Kubernetes + Helm (orchestration)
- Docker (containerization)
- GitHub Actions (CI/CD)
- Prometheus + Grafana (monitoring)
- Cloud Billing APIs (AWS, Azure, GCP)

### Backend
- Python (FastAPI)
- PostgreSQL (relational DB)
- InfluxDB (time series data)

### AI/ML
- Forecasting: XGBoost, statsmodels
- Clustering: KMeans
- Anomaly Detection: Isolation Forest, Autoencoders
- Recommendation: Reinforcement Learning models

### Frontend
- React + TailwindCSS (Next.js)
- Data visualization with Recharts / Chart.js

---

## 🎯 Objectives
- Optimize cloud resource usage and cost efficiency
- Predict monthly spending using machine learning
- Detect anomalous cost spikes and resource misusage
- Provide actionable AI-based cost-saving recommendations
- Offer a user-friendly dashboard for Finance & Tech teams

---

## 🆕 Changelog

### July 2025 Updates

- **Enhanced API docs** with detailed parameter descriptions & examples
- **Ingestion**: Added per-provider scripts, unified CSV loader and header-only fallback
- **Makefile**: New targets for `ingest-api`, `fetch-aws`, `fetch-azure`, `fetch-gcp`
- **Infrastructure**: Updated Terraform modules partially.
- **Security**: Enforced CORS policies and OAuth2/JWT authentication on backend
- **User Manual**: Expanded with Docker Compose, Jupyter, and CLI workflows

### June 2025 Updates

- Added `provider` field to all cost endpoints and UI filters
- Switched to stacked bar & multi-series line charts for richer insights
- Introduced infinite scroll and deduplication in cost tables
- Proxying `/docs` & `/redoc` through Next.js for consolidated UX
- Updated complete Helm modules for deployment in AWS.

---

## 🚀 Quick Start

```bash
# 1. Clone repo
git clone https://github.com/Impesud/ai-finops-platform.git
cd ai-finops-platform

# 2. Setup venv & install
make init

# 3. Ingest sample data
make fetch-aws
make fetch-azure
make fetch-gcp
# or via API
make ingest-api

# 4. Run app
make dev

# 5. Explore
- Dashboard: http://localhost:3000
- Swagger:   http://localhost:3000/docs
- ReDoc:     http://localhost:3000/redoc

# 6. Deploy Pipeline on AWS (Helm + EKS)
make full-setup #To provision the full environment (EKS cluster, IAM, ALB controller, Helm setup, etc.)
make deploy #To deploy or update the platform on an existing cluster (after building & pushing images)
```

---

## 📂 Repository Structure

```
app/           # FastAPI backend
frontend/      # Next.js dashboard
services/      # ETL & ingestion modules
scripts/       # Ingestion & deployment scripts
notebooks/     # ML notebooks
infra/         # Terraform & Helm
app/data/      # Generated CSVs
docs/          # Documentation & images
tests/         # Pytest suites
Makefile       # Task automation
README.md      # Project overview
```

---

**Maintainer:** Erick Jara — CTO & AI/Data Engineer\
📧 [erick.jara@hotmail.it](mailto\:erick.jara@hotmail.it) | 🌐 GitHub: [Impesud](https://github.com/Impesud)