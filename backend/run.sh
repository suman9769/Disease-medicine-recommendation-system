#!/bin/bash

# Medical Prediction API Run Script

echo "🚀 Starting Medical Prediction API..."

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run setup.sh first."
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Start the API
echo "🏥 Starting FastAPI server..."
echo "📖 API Documentation: http://localhost:8000/docs"
echo "🔍 Health Check: http://localhost:8000/api/v1/health"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info
