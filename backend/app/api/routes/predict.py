"""Prediction API routes"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging
import time

from app.models.schemas import SymptomRequest, PredictionResponse
from app.services.ml_service import MLService
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)
router = APIRouter()

async def get_ml_service() -> MLService:
    """Dependency to get ML service"""
    from main import ml_service
    if ml_service is None:
        raise HTTPException(status_code=503, detail="ML Service not available")
    return ml_service

async def get_gemini_service() -> GeminiService:
    """Dependency to get Gemini service"""
    from main import gemini_service
    if gemini_service is None:
        raise HTTPException(status_code=503, detail="Gemini Service not available")
    return gemini_service

@router.post("/predict", response_model=PredictionResponse)
async def predict_disease(
    request: SymptomRequest,
    ml_service: MLService = Depends(get_ml_service),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """
    Predict disease from symptoms using ML model and enhance with AI
    """
    try:
        logger.info(f"Prediction request: {request.symptoms}")
        
        # Parse symptoms
        symptoms_list = [s.strip() for s in request.symptoms.split(',') if s.strip()]
        
        if not symptoms_list:
            raise HTTPException(status_code=400, detail="No valid symptoms provided")
        
        # Get ML prediction
        predicted_disease, confidence = await ml_service.predict_disease(symptoms_list)
        
        if predicted_disease is None:
            raise HTTPException(
                status_code=400, 
                detail="None of the entered symptoms are recognized. Please check spelling and try again."
            )
        
        # Get basic disease information
        basic_info = ml_service.get_disease_info(predicted_disease)
        
        # Enhance with AI if available
        enhanced_info = await gemini_service.enhance_prediction(
            predicted_disease, 
            request.symptoms, 
            basic_info
        )
        
        # Create response
        response = PredictionResponse(
            disease=predicted_disease,
            description=enhanced_info.get('description', ''),
            severity=enhanced_info.get('severity', 'Moderate'),
            precautions=enhanced_info.get('precautions', []),
            medications=enhanced_info.get('medications', []),
            traditionalMedicines=enhanced_info.get('traditionalMedicines', []),
            homeRemedies=enhanced_info.get('homeRemedies', []),
            diet=enhanced_info.get('diet', ''),
            workouts=enhanced_info.get('workouts', []),
            consultationAdvice=enhanced_info.get('consultationAdvice', ''),
            confidence=confidence,
            source="ML+AI" if gemini_service.is_initialized else "ML"
        )
        
        logger.info(f"Prediction successful: {predicted_disease} (confidence: {confidence:.2f})")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during prediction")
