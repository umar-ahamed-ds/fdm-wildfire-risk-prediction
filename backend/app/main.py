import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.mongodb import client
from app.core.config import settings
from app.api.prediction import router as prediction_router
from app.api.location import router as location_router
from app.ml.predictor import predictor

logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
)

app = FastAPI(
    title="FDM Wildfire Prediction API",
    description="Backend API for the FDM Wildfire Prediction System",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router, prefix="/api/v1")
app.include_router(location_router, prefix="/api/v1")


@app.on_event("startup")
def startup_message():
    print()
    print("========================================")
    print("   FDM WILDFIRE PREDICTION SYSTEM")
    print("========================================")
    print("  Backend : FastAPI")
    print("  Database: MongoDB Atlas")
    print(f"  Model   : {'Loaded' if predictor.model is not None else 'Failed'}")
    print("  Status  : Backend started successfully")
    print("  API     : http://127.0.0.1:8000")
    print("  Docs    : http://127.0.0.1:8000/docs")
    print("========================================")
    print()


@app.get("/")
def root():
    return {
        "message": "Wildfire Prediction API is running successfully."
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": predictor.model is not None
    }


@app.get("/api/database-health")
def database_health():
    try:
        client.admin.command("ping")

        return {
            "status": "connected",
            "message": "MongoDB is connected successfully."
        }

    except Exception:
        return {
            "status": "disconnected",
            "message": "MongoDB connection failed."
        }