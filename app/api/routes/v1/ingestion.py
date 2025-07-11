# app/api/routes/v1/ingestion.py

import os
from datetime import date
from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.ingestion.aws_ingest import AwsIngest
from app.services.ingestion.azure_ingest import AzureIngest
from app.services.ingestion.gcp_ingest import GcpIngest
from app.services.ingestion.loader import save
from app.services.ingestion.normalizer import normalize

router = APIRouter(
    prefix="/ingestion",
    tags=["ingestion"],
    responses={
        422: {"description": "Validation Error"},
        500: {"description": "Internal Server Error"},
    },
)


class IngestRequest(BaseModel):
    start: date = Field(
        ...,
        description="Start date (inclusive) for ingestion (YYYY-MM-DD)",
        example="2025-01-01",
    )
    end: date = Field(
        ...,
        description="End date (inclusive) for ingestion (YYYY-MM-DD)",
        example="2025-06-30",
    )


class IngestResponse(BaseModel):
    status: str = Field(..., example="ok")
    count: int = Field(..., description="Number of records ingested", example=1234)


@router.post(
    "/",
    summary="Trigger ingestion of cost data from all providers",
    description=(
        "Fetch raw cost data from AWS, Azure, GCP for the given date range, "
        "normalize it, and save to CSV files."
    ),
    response_model=IngestResponse,
)
async def ingest_all(payload: IngestRequest) -> Dict[str, Any]:
    # AWS
    aws = AwsIngest(profile_name="", region_name="")
    raw_aws = aws.fetch(payload.start, payload.end)

    # Azure
    sub_id = os.getenv("AZURE_SUBSCRIPTION_ID")
    if not sub_id:
        raise HTTPException(500, "Missing AZURE_SUBSCRIPTION_ID environment variable")
    azure = AzureIngest(subscription_id=sub_id)
    raw_az = azure.fetch(payload.start, payload.end)

    # GCP
    proj = os.getenv("GCP_PROJECT_ID")
    ds = os.getenv("GCP_DATASET")
    tbl = os.getenv("GCP_TABLE")
    if not (proj and ds and tbl):
        raise HTTPException(
            500,
            "Missing GCP_PROJECT_ID, GCP_DATASET, or GCP_TABLE environment variables",
        )
    gcp = GcpIngest(project_id=proj, dataset=ds, table=tbl)
    raw_gcp = gcp.fetch(payload.start, payload.end)

    # Normalize and save
    unified = normalize(raw_aws, raw_az, raw_gcp)
    save(unified)

    return IngestResponse(status="ok", count=len(unified)).dict()
