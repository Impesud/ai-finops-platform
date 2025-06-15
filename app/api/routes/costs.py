from fastapi import APIRouter, Query
from typing import Optional
from app.services.cost_service import get_cost_data

router = APIRouter()

@router.get("/costs", tags=["Costs"])
def read_costs(
    service: Optional[str] = Query(None),
    account_id: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    return get_cost_data(service=service, account_id=account_id, start_date=start_date, end_date=end_date)



