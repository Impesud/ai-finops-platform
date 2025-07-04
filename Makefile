# AI FinOps Platform - FULL PRODUCTION PIPELINE + LOCAL DEVELOPMENT

# --- Configuration ---
API_BASE      = http://127.0.0.1:8000

# ================================
# === 🧪 LOCAL DEVELOPMENT =======
# ================================

# Setup Python virtual environment
init:
	python -m venv venv && . venv/bin/activate && pip install -r requirements.txt

# Run backend FastAPI locally
backend:
	uvicorn app.main:app --reload

# Run full stack (frontend + backend)
dev:
	cd frontend && npm run dev & uvicorn app.main:app --reload

# Trigger ingestion via FastAPI POST /api/v1/ingestion
ingest-api:
	curl -X POST $(API_BASE)/api/v1/ingestion/ \
	  -H "Content-Type: application/json" \
	  -d '{"start":"2025-01-01","end":"2025-06-30"}'

# Run per-provider ingestion scripts (overwrites CSVs)
fetch-aws:
	python3 -m scripts.ingestion.fetch_aws

fetch-azure:
	python3 -m scripts.ingestion.fetch_azure

fetch-gcp:
	python3 -m scripts.ingestion.fetch_gcp

# Run Python backend tests
test:
	python -m pytest

# Clean Python caches
clean:
	find . -type d -name "__pycache__" -exec rm -r {} + || true
	find . -type d -name ".pytest_cache" -exec rm -r {} + || true

# Frontend management
frontend-install:
	cd frontend && npm install

frontend-build:
	cd frontend && npm run build

frontend-start:
	cd frontend && npm start

frontend-dev:
	cd frontend && npm run dev

frontend-lint:
	cd frontend && npm run lint

frontend-test:
	cd frontend && npm test

# ================================
# === 🐳 DOCKER LOCAL (optional)
# ================================

docker-up:
	docker-compose up

docker-build-local:
	docker-compose up --build

docker-down:
	docker-compose down

# ================================
# === ☁️ PRODUCTION DEPLOYMENT ===
# ================================

# Install CLI tools (kubectl, eksctl, helm, terraform)
install-tools:
	chmod +x ./scripts/install-kubectl.sh    && ./scripts/install-kubectl.sh
	chmod +x ./scripts/get-latest-helm.sh    && ./scripts/get-latest-helm.sh
	chmod +x ./scripts/get-latest-terraform.sh && ./scripts/get-latest-terraform.sh

# Create EKS Cluster
setup-eks:
	chmod +x ./scripts/setup-eks.sh && ./scripts/setup-eks.sh

# Install AWS Load Balancer Controller
setup-lb-controller:
	chmod +x ./scripts/setup-lb-controller.sh && ./scripts/setup-lb-controller.sh

# ================================================
# === 🚀 BUILD AND DEPLOYMENT PIPELINE ===========
# ================================================

build-push:
	chmod +x ./scripts/build-push.sh && ./scripts/build-push.sh

helm-deploy:
	chmod +x ./scripts/deploy-helm.sh && ./scripts/deploy-helm.sh

get-url:
	chmod +x ./scripts/get-url.sh && ./scripts/get-url.sh

deploy: build-push helm-deploy get-url

safe-deploy:
	chmod +x ./scripts/safe-deploy.sh && ./scripts/safe-deploy.sh

full-setup:
	chmod +x ./scripts/deploy-ai-finops.sh && ./scripts/deploy-ai-finops.sh

# ================================
# === ☁️ CLUSTER MANAGEMENT ======
# ================================

# Soft reset workloads in cluster (preserve infra)
cluster-reset:
	chmod +x ./scripts/reset-cluster.sh && ./scripts/reset-cluster.sh

# Destroy EKS Cluster entirely
destroy-eks:
	chmod +x ./scripts/destroy-eks.sh && ./scripts/destroy-eks.sh

