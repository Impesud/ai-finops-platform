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

## 📘 Overview
**AI FinOps** is an advanced AI-driven FinOps platform. It enables real-time cloud cost monitoring, forecasting, and optimization across AWS, Azure, and GCP using machine learning, automation, and DevOps practices.

---

## 🎯 Objectives
- Optimize cloud resource usage and cost efficiency
- Predict monthly spending using machine learning
- Detect anomalous cost spikes and resource misusage
- Provide actionable AI-based cost-saving recommendations
- Offer a user-friendly dashboard for Finance & Tech teams

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

## 📦 Key Features
- Multi-cloud cost tracking in real-time
- Forecasting & budgeting module (ML-powered)
- Anomaly detection and alert system
- Interactive dashboard with usage heatmaps and forecasts
- Cost optimization suggestions
- Slack/Teams/email integration for alerts

---

## 🔒 Security
- OAuth2 / JWT for authentication
- RBAC for user access control
- Audit logs for user and system actions

---

## 🧪 Data & AI Pipeline
- Simulated or real billing datasets (e.g. AWS Cost Explorer)
- ETL pipeline for cleaning and feature engineering (`notebooks/00_data_cleaning.ipynb`, `app/services/etl.py`)
- ML model training and validation
- Model deployment and versioning via MLflow or custom pipeline

---

## 🧰 Setup & Usage

### ✅ Environment Setup (Backend)
```bash
python -m venv venv
source venv/bin/activate      
pip install --upgrade pip
pip install -r requirements.txt
```

### ✅ Run FastAPI API (Backend)
```bash
uvicorn app.main:app --reload
```
- Visit: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### ✅ Launch Jupyter Notebook
```bash
jupyter notebook
```
- Open: `notebooks/00_data_cleaning.ipynb`, `notebooks/01_forecasting.ipynb`

### ✅ Generate Simulated AWS Dataset
- Using Python and Faker
- Generated 1000-row dataset with columns: date, service, account_id, usage_type, cost_usd, region
- Saved to: `data/aws_cost_explorer_1000.csv`

### ✅ Frontend Setup (React + Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Visit: [http://localhost:3000](http://localhost:3000)

### ✅ Unified Dev Mode (Backend + Frontend)
```bash
make dev
```
- Avvia sia il backend FastAPI che il frontend React in modalità sviluppo.

### ✅ Build & Run Docker
```bash
make docker-build
make docker-up
```
- Avvia l’intera piattaforma in container Docker.

### ✅ Publish to GitHub Container Registry
```bash
make publish
```

### ✅ Backend Test
```bash
make test
```

### ✅ Frontend Test
```bash
cd frontend
npm run lint
npm test
```

### ✅ Deploy Pipeline on AWS (Helm + EKS)
```bash
make full-setup #To provision the full environment (EKS cluster, IAM, ALB controller, Helm setup, etc.)
make deploy #To deploy or update the platform on an existing cluster (after building & pushing images)
```

---

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
│   │   └── etl.py                # ETL utilities for dataset processing
│   └── utils/                    # Utility functions
│
├── frontend/                     # 💻 Frontend dashboard (React + Tailwind + Next.js)
│   ├── public/                   # Static files
│   ├── src/                      # React source code
│   │   ├── components/           # UI components (e.g., Navbar)
│   │   ├── app/                  # Next.js app directory (pages, routes)
│   │   ├── services/             # API calls
│   │   └── App.tsx               # Main app component
│   ├── tests/                    # Frontend unit tests
│   ├── jest.config.ts            # Jest config for frontend
│   ├── tsconfig.json             # TypeScript config
│   └── package.json              # NPM scripts and dependencies
│
├── notebooks/                    # 📊 Jupyter Notebooks for data science
│   ├── 00_data_cleaning.ipynb    # Dataset cleaning and feature engineering
│   ├── 01_forecasting.ipynb      # Cost forecasting (Prophet/XGBoost)
│   ├── 02_anomaly_detection.ipynb# Anomaly detection module
│   ├── 03_clustering.ipynb       # Clustering and cost recommendations
│
├── infra/                        # ☁️ Infrastructure as Code (Terraform, Helm)
│   ├── terraform/                # Terraform modules for AWS/GCP/Azure
│   └── helm/                     # Helm charts for Kubernetes deployment
│
├── scripts                       # 🔧 Automation scripts for setup, deploy and cluster
├
├── tests/                        # 🧪 Backend unit and integration tests
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
├── .gitignore
├──  docker-compose.yml
├──  Dockerfile
├──  Makefile
├──  README.md
└──  requirements.txt
```

---

## 🗓️ Roadmap (Aggiornato)
| Phase | Description                                 | Duration | Status        |
|-------|---------------------------------------------|----------|--------------|
| 1     | Setup infrastructure, billing API ingestion | 1 week   | ✅ Completed  |
| 2     | Build and validate ML models                | 2 weeks  | ⏳ In Progress|
| 3     | Backend API & Auth                         | 1 week   | ⏳ In Progress|
| 4     | Frontend dashboard (React + Next.js)        | 2 weeks  | ⏳ In Progress|
| 5     | Testing and CI/CD (Jest, Pytest, GitHub Actions) | 1 week   | ⏳ In Progress    |
| 6     | Dockerization & DevOps integration          | 1 week   | ⏳ In Progress   |

## 📝 Progress Update (June 2025)
- Initial infrastructure setup and billing data ingestion completed
- Started development of ML models and backend APIs
- Created first data cleaning notebooks
- Established the basic structure for the frontend (React/Next.js)
- Added CI/CD workflow and GHCR publishing pipeline
- Implemented full deployment pipeline using the `scripts/` folder, Helm charts, and AWS EKS

---

## 🚧 Known Issues / TODO
- Authentication and backend APIs are still in progress
- Frontend currently uses mock data
- Automated tests and production-ready CI/CD pipeline not fully implemented
- Terraform infrastructure modules are being developed to replace parts of `scripts/`
- Production CI/CD integration and testing pending

---

## 🛠️ Makefile Commands
```bash
make init             # Setup Python virtual environment & install deps
make run              # Run FastAPI backend (dev mode)
make dev              # Run frontend + backend (dev mode)
make notebook         # Launch Jupyter Notebook
make test             # Run backend tests (pytest)
make docker-build     # Build Docker image
make docker-up        # Start all services with Docker Compose
make docker-stop      # Stop all Docker Compose services
make publish          # Build & push Docker images to GHCR
make frontend-install # Install frontend dependencies
make frontend-build   # Build frontend for production
make frontend-start   # Start frontend in production mode
make frontend-dev     # Start frontend in dev mode
make frontend-lint    # Lint frontend code
make frontend-test    # Run frontend tests
```
Note:
For detailed steps and custom commands, see the [`Makefile`](./Makefile) and scripts in the [`scripts/`](./scripts/) folder.

---

## 📬 Contact

Created by Erick Jara – CTO & Senior AI/Data Engineer  
- GitHub: [Impesud](https://github.com/Impesud)  
- Email: erick.jara@hotmail.it  
- For issues or feature requests, please use the [GitHub Issues](https://github.com/Impesud/ai-finops-platform/issues) page.



