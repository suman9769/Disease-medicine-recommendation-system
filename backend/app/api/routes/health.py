"""Health check API routes"""

from fastapi import APIRouter
import time
import logging

from app.models.schemas import HealthResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    """
    try:
        from main import ml_service, gemini_service
        
        services = {
            "ml_service": "healthy" if ml_service and ml_service.is_initialized else "unavailable",
            "gemini_service": "healthy" if gemini_service and gemini_service.is_initialized else "unavailable"
        }
        
        return HealthResponse(
            status="healthy",
            timestamp=time.time(),
            version="1.0.0",
            services=services
        )
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return HealthResponse(
            status="unhealthy",
            timestamp=time.time(),
            version="1.0.0",
            services={"error": str(e)}
        )

@router.get("/health/detailed")
async def detailed_health_check():
    """
    Detailed health check with service information
    """
    try:
        from main import ml_service, gemini_service
        
        ml_status = {
            "initialized": ml_service.is_initialized if ml_service else False,
            "model_loaded": ml_service.model is not None if ml_service else False,
            "datasets_loaded": len(ml_service.datasets) if ml_service else 0
        }
        
        gemini_status = {
            "initialized": gemini_service.is_initialized if gemini_service else False,
            "api_key_configured": bool(gemini_service.api_key) if gemini_service else False
        }
        
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "version": "1.0.0",
            "services": {
                "ml_service": ml_status,
                "gemini_service": gemini_status
            }
        }
        
    except Exception as e:
        logger.error(f"Detailed health check error: {e}")
        return {
            "status": "error",
            "timestamp": time.time(),
            "error": str(e)
        }
