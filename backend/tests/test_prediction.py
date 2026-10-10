import pytest
from fastapi.testclient import TestClient
from datetime import date
import pandas as pd

from app.main import app
from app.services.prediction_service import derive_date_features, get_risk_category, make_prediction
from app.schemas.prediction import PredictionRequest
from app.ml.predictor import predictor
from unittest.mock import patch
import uuid

# Mock the repository so we don't need a real MongoDB connection
patch('app.services.prediction_service.prediction_repository.create_prediction', return_value=f"WFR-TEST-{uuid.uuid4().hex[:6].upper()}").start()

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "model_loaded" in data

def test_date_conversion():
    d = date(2026, 10, 5)
    features = derive_date_features(d)
    assert features["year"] == 2026
    assert features["month"] == 10
    assert features["day_of_year"] == 278

def test_risk_category_conversion():
    assert get_risk_category(0.0) == "No Risk"
    assert get_risk_category(0.15) == "Low Risk"
    assert get_risk_category(0.30) == "Low Risk"
    assert get_risk_category(0.31) == "Medium Risk"
    assert get_risk_category(0.70) == "Medium Risk"
    assert get_risk_category(0.71) == "High Risk"
    assert get_risk_category(0.99) == "High Risk"

# Base valid payload
valid_payload = {
    "latitude": 7.29,
    "longitude": 80.63,
    "assessment_date": date.today().isoformat(),
    "precipitation": 12.5,
    "relative_humidity_max": 85.0,
    "relative_humidity_min": 60.0,
    "specific_humidity": 0.015,
    "solar_radiation": 15.2,
    "temperature_min": 22.5,
    "temperature_max": 30.1,
    "wind_speed": 4.5,
    "burning_index": 45.2,
    "fuel_moisture_100hr": 12.0,
    "fuel_moisture_1000hr": 15.5,
    "energy_release_component": 35.5,
    "reference_evapotranspiration": 5.2,
    "potential_evapotranspiration": 4.8,
    "vapor_pressure_deficit": 1.2
}

def test_valid_prediction_request():
    response = client.post("/api/v1/predictions", json=valid_payload)
    assert response.status_code == 200, response.text
    data = response.json()
    assert "probability" in data
    assert "percentage" in data
    assert "risk_level" in data
    assert "model_name" in data
    assert data["model_name"] == "XGBoost"

def test_invalid_latitude():
    payload = valid_payload.copy()
    payload["latitude"] = 95.0 # Invalid > 90
    response = client.post("/api/v1/predictions", json=payload)
    assert response.status_code == 422
    assert "latitude" in response.text.lower()

def test_invalid_longitude():
    payload = valid_payload.copy()
    payload["longitude"] = -190.0 # Invalid < -180
    response = client.post("/api/v1/predictions", json=payload)
    assert response.status_code == 422
    assert "longitude" in response.text.lower()

def test_invalid_humidity():
    payload = valid_payload.copy()
    payload["relative_humidity_max"] = 105.0 # Invalid > 100
    response = client.post("/api/v1/predictions", json=payload)
    assert response.status_code == 422
    assert "relative_humidity_max" in response.text.lower()

def test_missing_required_input():
    payload = valid_payload.copy()
    del payload["precipitation"]
    response = client.post("/api/v1/predictions", json=payload)
    assert response.status_code == 422
    assert "precipitation" in response.text.lower()

def test_probability_output():
    # We don't know the exact probability for the arbitrary payload, 
    # but we can check if it's between 0 and 1
    response = client.post("/api/v1/predictions", json=valid_payload)
    assert response.status_code == 200
    prob = response.json()["probability"]
    assert 0.0 <= prob <= 1.0

def test_model_feature_order():
    # Directly use the loaded predictor to ensure the column reordering works
    # Create a dict with features in random order
    req = PredictionRequest(**valid_payload)
    
    date_features = derive_date_features(req.assessment_date)
    features_dict = req.model_dump(exclude={'assessment_date'})
    features_dict.update(date_features)
    
    # Create DataFrame with sorted keys (wrong order)
    wrong_order_df = pd.DataFrame([dict(sorted(features_dict.items()))])
    
    # Predictor should reorder them based on feature_names, so this should not raise an exception
    prob = predictor.predict_proba(wrong_order_df)
    assert isinstance(prob, float)
    
    # Ensure predictor.feature_names has exactly 20 features
    assert len(predictor.feature_names) == 20
    
    # Ensure they match the required names
    required_features = [
        'latitude', 'longitude', 'precipitation', 'relative_humidity_max',
        'relative_humidity_min', 'specific_humidity', 'solar_radiation',
        'temperature_min', 'temperature_max', 'wind_speed', 'burning_index',
        'fuel_moisture_100hr', 'fuel_moisture_1000hr', 'energy_release_component',
        'reference_evapotranspiration', 'potential_evapotranspiration',
        'vapor_pressure_deficit', 'year', 'month', 'day_of_year'
    ]
    # Check that both sets contain the same features
    assert set(predictor.feature_names) == set(required_features)
