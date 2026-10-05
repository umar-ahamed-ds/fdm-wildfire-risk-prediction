import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not configured")

if not MONGODB_DB:
    raise RuntimeError("MONGODB_DB is not configured")

client = MongoClient(
    MONGODB_URI,
    server_api=ServerApi("1")
)

db = client[MONGODB_DB]

predictions_collection = db["predictions"]

# Create indexes safely (may fail if DB is offline during startup/testing)
try:
    predictions_collection.create_index("prediction_id", unique=True)
    predictions_collection.create_index("created_at")
except Exception as e:
    print(f"Warning: Failed to create MongoDB indexes on startup: {e}")