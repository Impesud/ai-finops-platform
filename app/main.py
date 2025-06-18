from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import costs

app = FastAPI(title="AI FinOps API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(costs.router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok"}





