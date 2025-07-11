# app/api/routes/v1/costs.py

from datetime import date
from typing import List, Literal, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.cost_service import (
    get_aws_cost_data,
    get_azure_cost_data,
    get_cost_data,
    get_gcp_cost_data,
)

router = APIRouter(prefix="/costs", tags=["costs"])


class CostItem(BaseModel):
    provider: Literal["AWS", "Azure", "GCP"] = Field(
        ...,
        description="Which cloud provider this cost comes from",
        example="AWS",
    )
    cdate: date = Field(
        ...,
        alias="date",
        description="Date of the cost record (YYYY-MM-DD)",
        example="2025-06-30",
    )
    service: str = Field(
        ...,
        description="Name of the cloud service",
        example="AmazonEC2",
    )
    cost_usd: float = Field(
        ...,
        description="Cost amount in USD",
        example=150.42,
    )

    class Config:
        validate_by_name = True  # renamed from allow_population_by_field_name
        from_attributes = True  # renamed from orm_mode


@router.get(
    "/",
    summary="Unified cost data (AWS + Azure + GCP)",
    response_model=List[CostItem],
    responses={404: {"description": "No cost data found"}},
)
def unified_costs(
    service: Optional[str] = Query(
        None, description="Filter by service", examples="AmazonEC2"
    ),
    start_date: Optional[date] = Query(
        None, description="Start date YYYY-MM-DD", examples="2025-01-01"
    ),
    end_date: Optional[date] = Query(
        None, description="End date YYYY-MM-DD", examples="2025-01-31"
    ),
):
    results = get_cost_data(
        service=service,
        start_date=start_date,
        end_date=end_date,
    )
    if not results:
        raise HTTPException(404, "No cost data for the specified filters")
    return results


@router.get(
    "/aws",
    summary="AWS cost data",
    response_model=List[CostItem],
    responses={404: {"description": "No AWS cost data found"}},
)
def aws_costs(
    service: Optional[str] = Query(
        None, description="Filter by AWS service", examples="AmazonEC2"
    ),
    start_date: Optional[date] = Query(
        None, description="Start date YYYY-MM-DD", examples="2025-01-01"
    ),
    end_date: Optional[date] = Query(
        None, description="End date YYYY-MM-DD", examples="2025-01-31"
    ),
):
    results = get_aws_cost_data(
        service=service,
        start_date=start_date,
        end_date=end_date,
    )
    if not results:
        raise HTTPException(404, "No AWS cost data for the specified filters")
    return results


@router.get(
    "/azure",
    summary="Azure cost data",
    response_model=List[CostItem],
    responses={404: {"description": "No Azure cost data found"}},
)
def azure_costs(
    service: Optional[str] = Query(
        None, description="Filter by Azure service", examples="Virtual Machines"
    ),
    start_date: Optional[date] = Query(
        None, description="Start date YYYY-MM-DD", examples="2025-01-01"
    ),
    end_date: Optional[date] = Query(
        None, description="End date YYYY-MM-DD", examples="2025-01-31"
    ),
):
    results = get_azure_cost_data(
        service=service,
        start_date=start_date,
        end_date=end_date,
    )
    if not results:
        raise HTTPException(404, "No Azure cost data for the specified filters")
    return results


@router.get(
    "/gcp",
    summary="GCP cost data",
    response_model=List[CostItem],
    responses={404: {"description": "No GCP cost data found"}},
)
def gcp_costs(
    service: Optional[str] = Query(
        None, description="Filter by GCP service", examples="Compute Engine"
    ),
    start_date: Optional[date] = Query(
        None, description="Start date YYYY-MM-DD", examples="2025-01-01"
    ),
    end_date: Optional[date] = Query(
        None, description="End date YYYY-MM-DD", examples="2025-01-31"
    ),
):
    results = get_gcp_cost_data(
        service=service,
        start_date=start_date,
        end_date=end_date,
    )
    if not results:
        raise HTTPException(404, "No GCP cost data for the specified filters")
    return results
