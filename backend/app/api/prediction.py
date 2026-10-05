from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import make_prediction
from app.db.prediction_repository import prediction_repository
from app.services.report_service import generate_pdf_report

router = APIRouter()

@router.post("/predictions", response_model=PredictionResponse)
def predict_wildfire_risk(request: PredictionRequest):
    """
    Endpoint to predict wildfire risk based on environmental and temporal conditions.
    """
    try:
        response = make_prediction(request)
        return response
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        # Avoid exposing raw Python traces
        import traceback
        traceback.print_exc()
        error_type = type(e).__name__
        if error_type in ['ServerSelectionTimeoutError', 'ConnectionFailure', 'ConfigurationError', 'OperationFailure', 'NetworkTimeout']:
            raise HTTPException(status_code=503, detail="Prediction was generated successfully, but the server failed to save it to the database (MongoDB unavailable).")
        raise HTTPException(status_code=500, detail="Internal server error during prediction.")

@router.get("/predictions")
def get_prediction_history():
    """
    Retrieves recent prediction records from the database.
    """
    try:
        records = prediction_repository.get_predictions(limit=50)
        return records
    except Exception as e:
        error_type = type(e).__name__
        if error_type in ['ServerSelectionTimeoutError', 'ConnectionFailure', 'ConfigurationError', 'OperationFailure', 'NetworkTimeout']:
            raise HTTPException(status_code=503, detail="Failed to retrieve predictions (MongoDB unavailable).")
        raise HTTPException(status_code=500, detail="Failed to retrieve predictions.")

@router.get("/predictions/{prediction_id}")
def get_prediction(prediction_id: str):
    """
    Retrieves a single prediction record by ID.
    """
    try:
        record = prediction_repository.get_prediction_by_id(prediction_id)
        if not record:
            raise HTTPException(status_code=404, detail="Prediction not found.")
        return record
    except HTTPException:
        raise
    except Exception as e:
        error_type = type(e).__name__
        if error_type in ['ServerSelectionTimeoutError', 'ConnectionFailure', 'ConfigurationError', 'OperationFailure', 'NetworkTimeout']:
            raise HTTPException(status_code=503, detail="Failed to retrieve prediction (MongoDB unavailable).")
        raise HTTPException(status_code=500, detail="Failed to retrieve prediction.")

@router.get("/predictions/{prediction_id}/report")
def download_prediction_report(prediction_id: str):
    """
    Generates and downloads a PDF assessment report for a prediction.
    """
    record = prediction_repository.get_prediction_by_id(prediction_id)
    if not record:
        raise HTTPException(status_code=404, detail="Prediction not found.")
    
    try:
        pdf_buffer = generate_pdf_report(record)
        
        headers = {
            'Content-Disposition': f'attachment; filename="wildfire_assessment_{prediction_id}.pdf"'
        }
        
        return StreamingResponse(pdf_buffer, media_type='application/pdf', headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate report.")
