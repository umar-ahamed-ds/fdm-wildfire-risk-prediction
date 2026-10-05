from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List

class PredictionRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude")
    assessment_date: date = Field(..., description="Date of assessment")
    precipitation: float = Field(..., ge=0.0, description="Precipitation (mm)")
    relative_humidity_max: float = Field(..., ge=0.0, le=100.0, description="Maximum relative humidity (%)")
    relative_humidity_min: float = Field(..., ge=0.0, le=100.0, description="Minimum relative humidity (%)")
    specific_humidity: float = Field(..., ge=0.0, description="Specific humidity")
    solar_radiation: float = Field(..., ge=0.0, description="Solar radiation")
    temperature_min: float = Field(..., description="Minimum temperature")
    temperature_max: float = Field(..., description="Maximum temperature")
    wind_speed: float = Field(..., ge=0.0, description="Wind speed (m/s)")
    burning_index: float = Field(..., description="Burning index")
    fuel_moisture_100hr: float = Field(..., ge=0.0, description="100-hour fuel moisture")
    fuel_moisture_1000hr: float = Field(..., ge=0.0, description="1000-hour fuel moisture")
    energy_release_component: float = Field(..., description="Energy release component")
    reference_evapotranspiration: float = Field(..., description="Reference evapotranspiration")
    potential_evapotranspiration: float = Field(..., description="Potential evapotranspiration")
    vapor_pressure_deficit: float = Field(..., description="Vapor pressure deficit")

class LocationResponse(BaseModel):
    latitude: float
    longitude: float

class PredictionResponse(BaseModel):
    prediction_id: str
    probability: float
    percentage: float
    risk_level: str
    model_name: str
    assessment_date: date
    location: LocationResponse
    guidance: Optional[List[str]] = None
    disclaimer: str = "This prediction is a machine-learning estimate based on the supplied conditions and should not replace official emergency warnings or professional risk assessments."
