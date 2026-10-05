import joblib
import pandas as pd
from pathlib import Path
from typing import List, Any
import logging

logger = logging.getLogger(__name__)

class WildfirePredictor:
    def __init__(self):
        self.model = None
        self.feature_names: List[str] = []
        self._load_model()

    def _load_model(self):
        """Loads the model and feature names from the ml/models directory."""
        # Find the path to the model directory
        # This resolves assuming the app is running from the backend directory
        base_dir = Path(__file__).resolve().parent.parent.parent.parent
        model_dir = base_dir / "ml" / "models"
        
        model_path = model_dir / "xgboost_final.joblib"
        features_path = model_dir / "xgboost_feature_names.joblib"
        
        try:
            if not model_path.exists():
                raise FileNotFoundError(f"Model file not found at {model_path}")
            if not features_path.exists():
                raise FileNotFoundError(f"Feature names file not found at {features_path}")
                
            self.model = joblib.load(model_path)
            self.feature_names = joblib.load(features_path)
            logger.info("Model and feature names loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load model or feature names: {e}")
            raise e

    def predict_proba(self, input_df: pd.DataFrame) -> float:
        """
        Runs the prediction on the constructed dataframe.
        Expects a DataFrame with the exact features in the exact order.
        """
        if self.model is None:
            raise RuntimeError("Model is not loaded.")
        
        # Ensure column order matches exactly
        try:
            input_df = input_df[self.feature_names]
        except KeyError as e:
            raise ValueError(f"Missing required features: {e}")
            
        # Get probabilities
        probabilities = self.model.predict_proba(input_df)
        
        # Return probability for class 1 (wildfire ignition)
        return float(probabilities[0][1])

# Create a singleton instance to be used across the application
predictor = WildfirePredictor()
