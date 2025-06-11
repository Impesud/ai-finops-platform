from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_costs():
    return {"message": "List of cloud costs will appear here."}
