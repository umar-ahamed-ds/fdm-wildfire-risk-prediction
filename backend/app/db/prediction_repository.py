from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import uuid
from app.db.mongodb import predictions_collection

class PredictionRepository:
    def create_prediction(self, prediction_data: Dict[str, Any]) -> str:
        """
        Saves a new prediction to the database.
        Returns the prediction_id.
        """
        prediction_id = f"WFR-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        document = {
            "prediction_id": prediction_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            **prediction_data
        }
        
        predictions_collection.insert_one(document)
        return prediction_id

    def get_predictions(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Retrieves recent predictions, sorted newest first.
        """
        cursor = predictions_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
        return list(cursor)

    def get_prediction_by_id(self, prediction_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a single prediction by its ID.
        """
        return predictions_collection.find_one({"prediction_id": prediction_id}, {"_id": 0})

prediction_repository = PredictionRepository()
