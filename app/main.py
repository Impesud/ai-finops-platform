from fastapi import FastAPI
from app.api import routes_costs

app = FastAPI(title="AI FinOps API")

# Include routers
app.include_router(routes_costs.router, prefix="/api/costs", tags=["Costs"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI FinOps API"}
