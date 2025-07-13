"""
FastAPI Medical Prediction Backend
Integrates Google Gemini-2.0-Flash with dummy ML model fallback
Designed for Indian healthcare market
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager
import time
from typing import Optional

from app.api.routes import health, predict, symptoms, diseases
from app.core.config import get_settings
from app.core.logging import setup_logging
from app.services.ml_service import MLService
from app.services.gemini_service import GeminiService
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Global services
ml_service: Optional[MLService] = None
gemini_service: Optional[GeminiService] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global ml_service, gemini_service
    
    logger.info("Starting Medical Prediction API...")
    
    try:
        # Initialize services
        settings = get_settings()
        
        # Initialize ML Service (dummy model)
        ml_service = MLService()
        await ml_service.initialize()
        
        # Initialize Gemini Service
        gemini_service = GeminiService(api_key=settings.GOOGLE_GENERATIVE_AI_API_KEY)
        await gemini_service.initialize()
        
        logger.info("All services initialized successfully")
        
        yield
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise
    finally:
        logger.info("Shutting down Medical Prediction API...")
        if ml_service:
            await ml_service.cleanup()
        if gemini_service:
            await gemini_service.cleanup()

# Create FastAPI app
app = FastAPI(
    title="Medical Prediction API",
    description="AI-powered medical prediction system with focus on Indian healthcare",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add middleware
settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware, calls=100, period=60)

# Dependency to get services
async def get_ml_service() -> MLService:
    if ml_service is None:
        raise HTTPException(status_code=503, detail="ML Service not available")
    return ml_service

async def get_gemini_service() -> GeminiService:
    if gemini_service is None:
        raise HTTPException(status_code=503, detail="Gemini Service not available")
    return gemini_service

# Include routers
app.include_router(
    health.router,
    prefix="/api/v1",
    tags=["health"]
)

app.include_router(
    predict.router,
    prefix="/api/v1",
    tags=["prediction"],
    dependencies=[Depends(get_ml_service), Depends(get_gemini_service)]
)

app.include_router(
    symptoms.router,
    prefix="/api/v1",
    tags=["symptoms"],
    dependencies=[Depends(get_ml_service)]
)

app.include_router(
    diseases.router,
    prefix="/api/v1",
    tags=["diseases"],
    dependencies=[Depends(get_ml_service)]
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
            "timestamp": time.time()
        }
    )

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Medical Prediction API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
