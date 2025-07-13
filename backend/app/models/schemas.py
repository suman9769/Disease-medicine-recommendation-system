"""Pydantic models for request/response schemas"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from enum import Enum

class SeverityLevel(str, Enum):
    MILD = "Mild"
    MODERATE = "Moderate"
    SEVERE = "Severe"

class SymptomRequest(BaseModel):
    """Request model for symptom input"""
    symptoms: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="Comma-separated list of symptoms",
        example="fever, headache, body ache, fatigue"
    )
    
    @validator('symptoms')
    def validate_symptoms(cls, v):
        if not v or v.strip().lower() in ['symptoms', '']:
            raise ValueError('Please provide valid symptoms')
        return v.strip()

class PredictionResponse(BaseModel):
    """Response model for medical prediction"""
    disease: str = Field(..., description="Predicted disease name")
    description: str = Field(..., description="Detailed disease description")
    severity: SeverityLevel = Field(..., description="Severity level")
    precautions: List[str] = Field(..., description="Safety precautions")
    medications: List[str] = Field(..., description="Modern medications")
    traditionalMedicines: List[str] = Field(..., description="Traditional Indian medicines")
    homeRemedies: List[str] = Field(..., description="Home remedies")
    diet: str = Field(..., description="Dietary recommendations")
    workouts: List[str] = Field(..., description="Exercise recommendations")
    consultationAdvice: str = Field(..., description="Medical consultation advice")
    confidence: Optional[float] = Field(None, description="Prediction confidence score")
    source: str = Field(..., description="Prediction source (ML/AI)")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: float
    version: str
    services: Dict[str, str]

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    message: str
    timestamp: float
    details: Optional[Dict[str, Any]] = None

class SymptomInfo(BaseModel):
    """Symptom information model"""
    name: str
    description: str
    category: str

class DiseaseInfo(BaseModel):
    """Disease information model"""
    name: str
    description: str
    symptoms: List[str]
    severity: SeverityLevel

class SymptomsListResponse(BaseModel):
    """Response for symptoms list"""
    symptoms: List[SymptomInfo]
    total: int

class DiseasesListResponse(BaseModel):
    """Response for diseases list"""
    diseases: List[DiseaseInfo]
    total: int
