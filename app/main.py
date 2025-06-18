from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import costs

app = FastAPI(title="AI FinOps API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(costs.router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok"}
=======
app.include_router(costs.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI FinOps API"}





