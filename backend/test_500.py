# Test script

payload = {
  "latitude": 7.29,
  "longitude": 80.63,
  "assessment_date": "2026-10-05",
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

try:
    from app.services.prediction_service import make_prediction
    from app.schemas.prediction import PredictionRequest
    
    req = PredictionRequest(**payload)
    resp = make_prediction(req)
    print("Success:", resp)
except Exception as e:
    import traceback
    traceback.print_exc()
