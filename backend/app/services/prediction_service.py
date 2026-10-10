import pandas as pd
from datetime import date
from typing import Dict, Any, List

from app.schemas.prediction import PredictionRequest, PredictionResponse, LocationResponse
from app.ml.predictor import predictor

def derive_date_features(assessment_date: date) -> Dict[str, int]:
    """Derives year, month, and day of year from the assessment date."""
    return {
        "year": assessment_date.year,
        "month": assessment_date.month,
        "day_of_year": assessment_date.timetuple().tm_yday
    }

def get_risk_category(probability: float) -> str:
    """
    Converts probability to application-level risk category.
    0%: No Risk
    >0% - 30%: Low Risk
    31% - 70%: Medium Risk
    71% - 100%: High Risk
    """
    percentage = probability * 100
    
    # Due to floating point representation, round to 1 decimal place for classification
    # or just use strictly bounds as described. The instructions say:
    # 0%: No Risk, >0% - 30%: Low Risk, 31% - 70%: Medium Risk, 71% - 100%: High Risk
    
    if percentage == 0.0:
        return "No Risk"
    elif percentage <= 30.0:
        return "Low Risk"
    elif percentage <= 70.0:
        return "Medium Risk"
    else:
        return "High Risk"

def get_risk_guidance(risk_level: str) -> List[str]:
    """Returns risk guidance based on the risk level."""
    if risk_level == "High Risk":
        return [
            "Increase monitoring.",
            "Prepare emergency response resources.",
            "Avoid unnecessary ignition sources.",
            "Keep access routes clear.",
            "Follow official fire/disaster-management warnings.",
            "Follow official evacuation instructions if issued.",
            "Do not attempt to fight an established wildfire yourself."
        ]
    elif risk_level == "Medium Risk":
        return [
            "Increase monitoring.",
            "Avoid unnecessary outdoor burning.",
            "Review preparedness.",
            "Monitor official warnings."
        ]
    elif risk_level == "Low Risk":
        return [
            "Continue normal monitoring.",
            "Maintain basic preparedness."
        ]
    elif risk_level == "No Risk":
        return [
            "No elevated wildfire risk detected under the supplied conditions."
        ]
    return []

from app.db.prediction_repository import prediction_repository

def make_prediction(request: PredictionRequest) -> PredictionResponse:
    """
    Coordinates the prediction process:
    1. Derives date features.
    2. Prepares dataframe.
    3. Calls model predictor.
    4. Formats and returns the response.
    """
    # 1. Derive date features
    date_features = derive_date_features(request.assessment_date)
    
    # 2. Combine all features into a dictionary
    features_dict = request.model_dump(exclude={'assessment_date', 'location_name'})
    features_dict.update(date_features)
    
    # 3. Create DataFrame
    df = pd.DataFrame([features_dict])
    
    # 4. Predict
    probability = predictor.predict_proba(df)
    percentage = round(probability * 100, 1)
    risk_level = get_risk_category(probability)
    
    # 5. Save to database
    # Structure the document
    prediction_data = {
        "assessment_date": request.assessment_date.isoformat(),
        "location": {
            "name": request.location_name,
            "latitude": request.latitude,
            "longitude": request.longitude
        },
        "input_features": features_dict,
        "prediction": {
            "probability": round(probability, 4),
            "percentage": percentage,
            "risk_level": risk_level
        },
        "model": {
            "name": "XGBoost"
        }
    }
    
    # If this fails, the API will return a 500, preventing silent failures
    prediction_id = prediction_repository.create_prediction(prediction_data)
    
    # 6. Build Response
    return PredictionResponse(
        prediction_id=prediction_id,
        probability=round(probability, 4),
        percentage=percentage,
        risk_level=risk_level,
        model_name="XGBoost",
        assessment_date=request.assessment_date,
        location=LocationResponse(
            name=request.location_name,
            latitude=request.latitude,
            longitude=request.longitude
        ),
        guidance=get_risk_guidance(risk_level)
    )
