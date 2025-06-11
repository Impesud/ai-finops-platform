# AI FinOps Platform

## 🚀 Tech Stack Badges

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

## 📘 Overview
**AI FinOps** is an advanced AI-driven FinOps platform. It enables real-time cloud cost monitoring, forecasting, and optimization across AWS, Azure, and GCP using machine learning, automation, and DevOps practices.

## 🎯 Objectives
- Optimize cloud resource usage and cost efficiency
- Predict monthly spending using machine learning
- Detect anomalous cost spikes and resource misusage
- Provide actionable AI-based cost-saving recommendations
- Offer a user-friendly dashboard for Finance & Tech teams

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
- React + TailwindCSS
- Data visualization with Recharts / Chart.js

## 📦 Key Features
- Multi-cloud cost tracking in real-time
- Forecasting & budgeting module (ML-powered)
- Anomaly detection and alert system
- Interactive dashboard with usage heatmaps and forecasts
- Cost optimization suggestions
- Slack/Teams/email integration for alerts

## 🔒 Security
- OAuth2 / JWT for authentication
- RBAC for user access control
- Audit logs for user and system actions

## 🧪 Data & AI Pipeline
- Simulated or real billing datasets (e.g. AWS Cost Explorer)
- ETL pipeline for cleaning and feature engineering
- ML model training and validation
- Model deployment and versioning via MLflow or custom pipeline

## 🧰 Setup & Usage (Steps Completed)

### ✅ Environment Setup
```bash
python -m venv venv
source venv/bin/activate     
pip install --upgrade pip
pip install -r requirements.txt
```

### ✅ Run FastAPI API
```bash
uvicorn app.main:app --reload
```
Visit: [http://127.0.0.1:8000](http://127.0.0.1:8000)
Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### ✅ Launch Jupyter Notebook
```bash
jupyter notebook
```
Then open: `notebooks/01_forecasting.ipynb`

### ✅ Generate Simulated AWS Dataset
```bash
# Using Python and Faker
- Generated 1000-row dataset with columns: date, service, account_id, usage_type, cost_usd, region
- Saved to: aifinops-platform/data/aws_cost_explorer_1000.csv
```

## 📂 Repository Structure
```
ai-finops-platform/
│
├── app/                          # 🧠 Backend API using FastAPI
│   ├── main.py                   # Application entry point
│   ├── api/                      # REST API routes (e.g., /costs, /forecasts)
│   ├── core/                     # Core config, auth, logging
│   ├── models/                   # Pydantic & ORM models
│   ├── services/                 # Business logic and external integrations
│   └── utils/                    # Utility functions
│
├── frontend/                     # 💻 Frontend dashboard (React + Tailwind)
│   ├── public/                   # Static files
│   ├── src/                      # React source code
│   │   ├── components/           # UI components
│   │   ├── pages/                # Page-level components
│   │   ├── services/             # API calls
│   │   └── App.tsx               # Main app component
│
├── notebooks/                    # 📊 Jupyter Notebooks for data science
│   ├── 01_forecasting.ipynb      # Cost forecasting (Prophet/XGBoost)
│   ├── 02_anomaly_detection.ipynb# Anomaly detection module
│   ├── 03_clustering.ipynb       # Clustering and cost recommendations
│
├── infra/                        # ☁️ Infrastructure as Code (Terraform, Helm)
│   ├── terraform/                # Terraform modules for AWS/GCP/Azure
│   └── helm/                     # Helm charts for Kubernetes deployment
│
├── tests/                        # 🧪 Unit and integration tests
│   ├── test_api.py               # FastAPI endpoint tests
│   ├── test_models.py            # Tests for models and logic
│
├── docs/                         # 📖 Documentation
│   ├── architecture.md           # System architecture and diagrams
│   └── user_manual.md            # User guide and usage instructions
│
├── data/                         # Real or simulated billing datasets
│   └── aws_cost_explorer_1000.csv
│
├── .gitignore                    # Git ignore rules
├── requirements.txt              # Python dependencies
├── environment.yml               # (Optional) Conda environment config
├── docker-compose.yml            # (Optional) Local dev container setup
├── README.md                     # Project description             # This file
├── .gitignore
```

## 🗓️ Roadmap
| Phase | Description | Duration |
|-------|-------------|----------|
| 1 | Setup infrastructure, billing API ingestion | 1 week |
| 2 | Build and validate ML models | 2 weeks |
| 3 | Backend API & Auth | 1 week |
| 4 | Frontend dashboard | 2 weeks |
| 5 | Testing and CI/CD | 1 week |

## 🧠 Future Modules
- Carbon footprint estimator
- Multi-cloud benchmark comparison
- Smart auto-scaler recommendations

## 📬 Contact
Created by Erick Jara – CTO & Senior AI/Data Engineer.
GitHub: [Impesud](https://github.com/Impesud) | Email: erick.jara@hotmail.it

