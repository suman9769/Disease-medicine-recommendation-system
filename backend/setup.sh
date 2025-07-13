#!/bin/bash

# Medical Prediction API Setup Script

echo "🏥 Setting up Medical Prediction API..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python -m venv venv
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs models datasets

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "Please update .env file with your configuration"
fi

# Set permissions
chmod +x run.sh
chmod +x setup.sh

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your Google AI API key"
echo "2. Copy your model files to the models/ directory"
echo "3. Copy your dataset files to the datasets/ directory"
echo "4. Run: ./run.sh"
echo ""
echo "API Documentation will be available at: http://localhost:8000/docs"
