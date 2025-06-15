# 📘 AI FinOps Platform

💪 To set up the AI FinOps Platform, first create a Python virtual environment using:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

🚀 Then run the FastAPI backend with:
```bash
make run
```

📌 You can access the live API documentation here:  
http://127.0.0.1:8000/docs

📓 To use the Jupyter Notebooks for machine learning modules, launch them with:
```bash
make notebook
```

🔍 Then open the following files in your browser:  
📈 notebooks/01_forecasting.ipynb  
🚨 notebooks/02_anomaly_detection.ipynb  
🧹 notebooks/03_clustering.ipynb

✅ To run the test suite and validate backend functionality:
```bash
make test
```

🐳 To containerize and run the platform with Docker:
```bash
make docker-build
make docker-up
```

📛 To stop all running Docker services:
```bash
make docker-stop
```

🩹 To clean your local project environment and remove temporary files:
```bash
make clean
```

📋 Complete list of available Makefile commands for automation:
- `make init` → 📦 Create the virtual environment and install requirements  
- `make run` → 🚀 Start the FastAPI backend server  
- `make notebook` → 📓 Launch the Jupyter interface  
- `make test` → ✅ Execute unit and integration tests  
- `make docker-build` → 🐳 Build Docker containers  
- `make docker-up` → 🟢 Run the application via Docker  
- `make docker-stop` → 🔻 Stop all Docker containers  
- `make api-docs` → 🔍 Print the API documentation link  
- `make clean` → 🩹 Clean up cache and temp files

🧠 The platform uses FastAPI with PostgreSQL for relational storage and InfluxDB for time series data. Authentication and authorization are handled via OAuth2 and JWT tokens. The machine learning layer includes forecasting using XGBoost and statsmodels, anomaly detection with Isolation Forest and Autoencoders, clustering with KMeans, and cost-saving recommendations via Reinforcement Learning. Models are tracked and deployed using MLflow. The frontend is built using React and styled with TailwindCSS. All data is visualized using Chart.js and Recharts, with secure communication via JWT-protected API calls. Infrastructure provisioning is performed via Terraform for AWS, GCP, and Azure. The platform is deployed in Kubernetes clusters managed with Helm. Monitoring is performed using Prometheus and Grafana. Continuous integration and testing pipelines are configured using GitHub Actions.

📂 The repository is organized as follows:  
📁 `app/` – FastAPI backend logic and APIs  
📁 `frontend/` – React web dashboard with visualizations  
📁 `notebooks/` – Jupyter notebooks for machine learning tasks  
📁 `infra/` – Terraform modules and Helm charts  
📁 `tests/` – Backend unit and integration tests  
📁 `docs/` – Technical documentation and this manual  
📁 `data/` – Simulated or real cloud billing datasets  
📄 `Makefile` – Task automation  
📄 `requirements.txt` – Python package list  
📄 `docker-compose.yml` – Local container setup  
📄 `README.md` – Main project summary


