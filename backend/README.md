# Medical Prediction API

A robust FastAPI backend for medical prediction using Google Gemini-2.0-Flash AI and machine learning models, specifically designed for the Indian healthcare market.

## 🚀 Features

- **AI-Powered Predictions**: Google Gemini-2.0-Flash integration for enhanced medical analysis
- **Dummy ML Model**: Fallback dummy model for testing and development
- **Indian Healthcare Focus**: Traditional medicines, home remedies, and local treatments
- **Robust Error Handling**: Comprehensive error management and graceful degradation
- **High Performance**: Async processing, rate limiting, and caching
- **Scalable Architecture**: Docker support and horizontal scaling ready
- **Comprehensive API**: RESTful endpoints with OpenAPI documentation

## 📋 Prerequisites

- Python 3.11+
- Google AI API Key (for Gemini integration)
- Docker (optional, for containerized deployment)

## 🛠️ Quick Setup

### 1. Clone and Setup

\`\`\`bash
git clone <repository>
cd backend
chmod +x setup.sh
./setup.sh
\`\`\`

### 2. Configure Environment

\`\`\`bash
# Copy and edit environment file
cp .env.example .env

# Add your Google AI API key
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
\`\`\`

### 3. Add Your Data (Optional)

\`\`\`bash
# Copy your ML model and datasets
cp /path/to/your/svc.pkl models/
cp /path/to/your/datasets
