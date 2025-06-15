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