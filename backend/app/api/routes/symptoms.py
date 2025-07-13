"""Symptoms API routes"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
import logging

from app.models.schemas import SymptomsListResponse, SymptomInfo
from app.services.ml_service import MLService

logger = logging.getLogger(__name__)
router = APIRouter()

async def get_ml_service() -> MLService:
    """Dependency to get ML service"""
    from main import ml_service
    if ml_service is None:
        raise HTTPException(status_code=503, detail="ML Service not available")
    return ml_service

@router.get("/symptoms", response_model=SymptomsListResponse)
async def get_symptoms(
    category: Optional[str] = Query(None, description="Filter by symptom category"),
    search: Optional[str] = Query(None, description="Search symptoms by name"),
    ml_service: MLService = Depends(get_ml_service)
):
    """
    Get list of available symptoms
    """
    try:
        symptoms_data = ml_service.get_symptoms_list()
        
        # Filter by category if specified
        if category:
            symptoms_data = [s for s in symptoms_data if s['category'].lower() == category.lower()]
        
        # Search by name if specified
        if search:
            search_lower = search.lower()
            symptoms_data = [s for s in symptoms_data if search_lower in s['name'].lower()]
        
        # Convert to response format
        symptoms = [
            SymptomInfo(
                name=s['name'],
                description=f"Medical symptom: {s['name']}",
                category=s['category']
            )
            for s in symptoms_data
        ]
        
        return SymptomsListResponse(
            symptoms=symptoms,
            total=len(symptoms)
        )
        
    except Exception as e:
        logger.error(f"Error getting symptoms: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving symptoms")

@router.get("/symptoms/categories")
async def get_symptom_categories(ml_service: MLService = Depends(get_ml_service)):
    """
    Get list of symptom categories
    """
    try:
        symptoms_data = ml_service.get_symptoms_list()
        categories = list(set(s['category'] for s in symptoms_data))
        
        return {
            "categories": sorted(categories),
            "total": len(categories)
        }
        
    except Exception as e:
        logger.error(f"Error getting symptom categories: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving symptom categories")
