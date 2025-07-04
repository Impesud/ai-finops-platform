from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def api_info():
    return {
        "service": "AI FinOps Platform API",
        "version": "0.2.0",
        "endpoints": [
            "/api/costs",
            "/api/forecast",
            "/api/anomalies"
        ],
        "status": "OK"
    }
