# 📘 AI FinOps Platform

## Local Setup & Development

**1. Create Python virtual environment**

```bash
make init
```

Creates `venv/` and installs dependencies from `requirements.txt`.

**2. Run FastAPI backend**

```bash
make backend
```

Starts the API at `http://127.0.0.1:8000` with auto-reload.

**3. Run full stack**

```bash
make dev
```

Launches React frontend (`http://localhost:3000`) and FastAPI backend concurrently.

**4. Access API docs**

- Swagger UI:  `http://localhost:8000/docs` or `http://localhost:3000/docs`
- ReDoc:        `http://localhost:8000/redoc` or `http://localhost:3000/redocs`

**5. Trigger ingestion**

- **All providers** (via API):
  ```bash
  make ingest-api
  ```
- **Per provider** (overwrite CSVs in `app/data/`):
  ```bash
  make fetch-aws
  make fetch-azure
  make fetch-gcp
  ```

**6. Run tests**

```bash
make test
```

Executes all backend pytest suites.

**7. Clean environment**

```bash
make clean
```

Removes Python caches and pytest cache.

## Jupyter Notebooks

Launch the notebook server:

```bash
make notebook
```

Then open:

- `notebooks/01_forecasting.ipynb`
- `notebooks/02_anomaly_detection.ipynb`
- `notebooks/03_clustering.ipynb`

## Docker Compose (Local Container)

**Build & start services**

```bash
make docker-build-local
make docker-up
```

**Stop**

```bash
make docker-down
```

## Production Deployment

1. **Install CLI tools** (kubectl, eksctl, helm, terraform):
   ```bash
   make install-tools
   ```
2. **Provision EKS/GKE/AKS**
   ```bash
   make setup-eks
   make setup-lb-controller
   ```
3. **Build & push images, deploy via Helm**
   ```bash
   make build-push
   make helm-deploy
   make get-url
   ```
4. **Full deploy script**
   ```bash
   make full-setup
   ```

## Project Structure

```
app/           # FastAPI backend
frontend/      # Next.js React dashboard
notebooks/     # ML notebooks
infra/         # Terraform & Helm charts
scripts/       # Ingestion & deploy scripts
tests/         # Pytest suites
app/data/      # Generated CSVs (aws_2025.csv, ...)
Makefile       # Task automation
requirements.txt
docker-compose.yml
```

## Core Technologies

- **Backend:** FastAPI, Pandas, Pydantic
- **Frontend:** Next.js, React, TailwindCSS, Recharts
- **ML:** XGBoost, Prophet, Isolation Forest, MLflow
- **Infra:** Terraform, Kubernetes (Helm), Prometheus, Grafana

*Last updated: July 2025*


