from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.v1 import api_info, costs, ingestion

tags_metadata = [
    {
        "name": "ingestion",
        "description": "Endpoints for importing cost data from AWS, Azure, and GCP",
    },
    {
        "name": "costs",
        "description": "Operations for querying and managing cost data",
    },
    {
        "name": "forecast",
        "description": "Cost forecasting based on ML models",
    },
    {
        "name": "anomalies",
        "description": "Anomaly detection endpoints",
    },
]

app = FastAPI(
    title="AI FinOps Platform API",
    version="1.0.0",
    description="API for extracting, normalizing and analyzing cloud cost data across AWS, Azure and GCP.",
    contact={"name": "Erick Jara", "url": "https://github.com/Impesud"},
    license_info={"name": "MIT", "url": "https://opensource.org/licenses/MIT"},
    servers=[
        {"url": "http://localhost:8000", "description": "Local dev"},
        {"url": "https://api.yourdomain.com", "description": "Production API"},
    ],
    openapi_tags=tags_metadata,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    swagger_ui_parameters={
        "supportedSubmitMethods": ["get", "post", "put", "delete", "patch"],
        "tryItOutEnabled": True,
    },
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include versioned routers
app.include_router(api_info.router, prefix="/api/v1", tags=["info"])
app.include_router(ingestion.router, prefix="/api/v1", tags=["ingestion"])
app.include_router(costs.router, prefix="/api/v1", tags=["costs"])
