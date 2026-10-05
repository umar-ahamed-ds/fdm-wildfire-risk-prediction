import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
import json

client = TestClient(app)

mock_record = {
    "prediction_id": "WFR-20261005-ABC123",
    "created_at": "2026-10-05T10:00:00Z",
    "assessment_date": "2026-10-05",
    "location": {"latitude": 7.29, "longitude": 80.63},
    "input_features": {
        "latitude": 7.29,
        "longitude": 80.63,
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
        "vapor_pressure_deficit": 1.2,
        "year": 2026,
        "month": 10,
        "day_of_year": 278
    },
    "prediction": {
        "probability": 0.82,
        "percentage": 82.0,
        "risk_level": "High Risk"
    },
    "model": {"name": "XGBoost"}
}

@patch('app.api.prediction.prediction_repository')
def test_get_prediction_history(mock_repo):
    mock_repo.get_predictions.return_value = [mock_record]
    response = client.get("/api/v1/predictions")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["prediction_id"] == "WFR-20261005-ABC123"

@patch('app.api.prediction.prediction_repository')
def test_get_prediction_by_id(mock_repo):
    mock_repo.get_prediction_by_id.return_value = mock_record
    response = client.get("/api/v1/predictions/WFR-20261005-ABC123")
    assert response.status_code == 200
    assert response.json()["prediction_id"] == "WFR-20261005-ABC123"

@patch('app.api.prediction.prediction_repository')
def test_get_prediction_not_found(mock_repo):
    mock_repo.get_prediction_by_id.return_value = None
    response = client.get("/api/v1/predictions/INVALID")
    assert response.status_code == 404

@patch('app.api.prediction.prediction_repository')
def test_download_prediction_report(mock_repo):
    mock_repo.get_prediction_by_id.return_value = mock_record
    response = client.get("/api/v1/predictions/WFR-20261005-ABC123/report")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "attachment; filename=" in response.headers["content-disposition"]
