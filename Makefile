# AI FinOps Platform - FULL PRODUCTION PIPELINE + LOCAL DEVELOPMENT

# --- Configuration ---
DATETAG ?= $(shell date +%Y%m%d%H%M)
CLUSTER_NAME=ai-finops-cluster
REGION=eu-central-1

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
	chmod +x ./scripts/install-kubectl.sh && ./scripts/install-kubectl.sh
	chmod +x ./scripts/get-latest-helm.sh && ./scripts/get-latest-helm.sh
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
=======
# Makefile for AI FinOps Platform

init:
    python -m venv venv && source venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt

run:
    uvicorn app.main:app --reload

dev:
    cd frontend && npm run dev & \
    uvicorn app.main:app --reload

notebook:
    jupyter notebook

test:
    python -m pytest

docker-build:
    docker build -t ai-finops-platform .

docker-up:
    docker-compose up --build

docker-stop:
    docker-compose down

api-docs:
    @echo "Visit http://127.0.0.1:8000/docs for API docs"

clean:
    find . -type d -name "__pycache__" -exec rm -r {} + && \
    find . -type d -name ".pytest_cache" -exec rm -r {} + && \
    rm -rf .mypy_cache .coverage htmlcov

# --- Frontend commands ---

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
    cd frontend
