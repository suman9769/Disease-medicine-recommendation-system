"""Diseases API routes"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
import logging

from app.models.schemas import DiseasesListResponse, DiseaseInfo, SeverityLevel
from app.services.ml_service import MLService

logger = logging.getLogger(__name__)
router = APIRouter()

async def get_ml_service() -> MLService:
    """Dependency to get ML service"""
    from main import ml_service
    if ml_service is None:
        raise HTTPException(status_code=503, detail="ML Service not available")
    return ml_service

@router.get("/diseases", response_model=DiseasesListResponse)
async def get_diseases(
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    search: Optional[str] = Query(None, description="Search diseases by name"),
    ml_service: MLService = Depends(get_ml_service)
):
    """
    Get list of available diseases
    """
    try:
        diseases_data = ml_service.get_diseases_list()
        
        # Filter by severity if specified
        if severity:
            diseases_data = [d for d in diseases_data if d['severity'].lower() == severity.lower()]
        
        # Search by name if specified
        if search:
            search_lower = search.lower()
            diseases_data = [d for d in diseases_data if search_lower in d['name'].lower()]
        
        # Convert to response format
        diseases = [
            DiseaseInfo(
                name=d['name'],
                description=f"Medical condition: {d['name']}",
                symptoms=[],  # Could be populated from datasets
                severity=SeverityLevel(d['severity'])
            )
            for d in diseases_data
        ]
        
        return DiseasesListResponse(
            diseases=diseases,
            total=len(diseases)
        )
        
    except Exception as e:
        logger.error(f"Error getting diseases: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving diseases")

@router.get("/diseases/{disease_name}")
async def get_disease_details(
    disease_name: str,
    ml_service: MLService = Depends(get_ml_service)
):
    """
    Get detailed information about a specific disease
    """
    try:
        # Get disease info
        disease_info = ml_service.get_disease_info(disease_name)
        
        if not disease_info:
            raise HTTPException(status_code=404, detail="Disease not found")
        
        return {
            "name": disease_name,
            "info": disease_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting disease details: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving disease details")
