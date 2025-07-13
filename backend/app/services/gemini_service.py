"""Google Gemini AI Service"""

import logging
import asyncio
import httpx
from typing import Dict, Any, Optional
import json
import time

logger = logging.getLogger(__name__)

class GeminiService:
    """Google Gemini AI service for enhanced medical predictions"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        self.model = "gemini-2.0-flash-exp"
        self.client: Optional[httpx.AsyncClient] = None
        self.is_initialized = False
        
    async def initialize(self):
        """Initialize Gemini service"""
        try:
            logger.info("Initializing Gemini Service...")
            
            if not self.api_key:
                logger.warning("No Gemini API key provided, service will be disabled")
                return
            
            # Initialize HTTP client
            self.client = httpx.AsyncClient(
                timeout=30.0,
                limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
            )
            
            # Test API connection
            await self._test_connection()
            
            self.is_initialized = True
            logger.info("Gemini Service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Service: {e}")
            self.is_initialized = False
    
    async def _test_connection(self):
        """Test Gemini API connection"""
        try:
            url = f"{self.base_url}/models/{self.model}:generateContent"
            headers = {"Content-Type": "application/json"}
            
            payload = {
                "contents": [{
                    "parts": [{"text": "Hello, this is a test message."}]
                }],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": 100
                }
            }
            
            response = await self.client.post(
                f"{url}?key={self.api_key}",
                headers=headers,
                json=payload
            )
            
            if response.status_code != 200:
                raise Exception(f"API test failed: {response.status_code}")
                
            logger.info("Gemini API connection test successful")
            
        except Exception as e:
            logger.error(f"Gemini API connection test failed: {e}")
            raise
    
    async def enhance_prediction(self, disease: str, symptoms: str, basic_info: Dict) -> Dict[str, Any]:
        """Enhance basic ML prediction with AI-generated content"""
        if not self.is_initialized or not self.client:
            logger.warning("Gemini service not available, returning basic info")
            return self._create_fallback_response(disease, basic_info)
        
        try:
            # Create enhanced prompt
            prompt = self._create_medical_prompt(disease, symptoms, basic_info)
            
            # Generate AI response
            ai_response = await self._generate_content(prompt)
            
            # Parse and structure response
            enhanced_info = self._parse_ai_response(ai_response, basic_info)
            
            return enhanced_info
            
        except Exception as e:
            logger.error(f"Error enhancing prediction with AI: {e}")
            return self._create_fallback_response(disease, basic_info)
    
    def _create_medical_prompt(self, disease: str, symptoms: str, basic_info: Dict) -> str:
        """Create comprehensive medical prompt for Indian healthcare context"""
        
        prompt = f"""You are an expert medical AI assistant specializing in Indian healthcare systems. You have comprehensive knowledge of:

- Modern medical diagnosis and treatment protocols
- Traditional Indian medicine, herbs, and healing practices  
- Home remedies using common Indian household ingredients
- Indian dietary practices and therapeutic foods
- Practical treatment options suitable for Indian patients
- Yoga, pranayama, and traditional healing practices
- Indian pharmaceutical market and medicine availability

IMPORTANT FORMATTING RULES:
- Use **bold formatting** (double asterisks) for all important terms, medicine names, ingredients, and key concepts
- Format medicine names like **Triphala**, **Tulsi**, **Ashwagandha**
- Bold important instructions and dosages
- Bold key dietary recommendations and foods
- Bold exercise names and important precautions

Patient presents with these symptoms: {symptoms}
Predicted condition: {disease}

Provide a comprehensive medical analysis with proper **bold formatting** for all important terms:

1. **Disease Description**: Detailed explanation with **bold formatting** for key medical terms and concepts
2. **Severity Assessment**: Classify as Mild, Moderate, or Severe with reasoning
3. **Safety Precautions**: 5-7 specific preventive measures with **bold formatting** for critical actions
4. **Modern Medications**: List medicines available in Indian pharmacies with **bold formatting** for drug names
5. **Traditional Indian Medicines**: Specific treatments including:
   - Traditional formulations with **bold names** like **Triphala**, **Ashwagandha**
   - Medicinal herbs with **bold names** and usage (e.g., "**Tulsi leaves**: Boil 10-12 leaves in water, drink **twice daily**")
   - Traditional remedies with **bold preparation methods**
6. **Home Remedies**: Detailed remedies with **bold formatting** for:
   - **Ingredient names** and quantities
   - **Preparation methods** and usage instructions
   - **Timing and frequency** of application
7. **Dietary Recommendations**: Comprehensive Indian diet plan with **bold formatting** for:
   - **Beneficial foods** and **spices**
   - **Meal timing** and portion suggestions
   - **Foods to avoid** and why
   - **Therapeutic recipes** if applicable
8. **Exercise & Activities**: Specific activities with **bold formatting** for exercise names and yoga poses
9. **Consultation Advice**: When to seek medical help with **bold formatting** for urgency levels

Focus on:
- Practical, accessible solutions for Indian families
- Using locally available ingredients and medicines
- Both immediate relief and long-term management strategies
- Prevention and lifestyle modifications
- Integration of modern and traditional approaches
- Proper **bold formatting** throughout for clarity

Important: If symptoms indicate a serious condition, emphasize urgent medical consultation while still providing helpful guidance.

Please provide the response in JSON format with the following structure:
{{
    "description": "detailed description",
    "severity": "Mild/Moderate/Severe",
    "precautions": ["precaution1", "precaution2", ...],
    "medications": ["medication1", "medication2", ...],
    "traditionalMedicines": ["traditional1", "traditional2", ...],
    "homeRemedies": ["remedy1", "remedy2", ...],
    "diet": "comprehensive diet plan",
    "workouts": ["exercise1", "exercise2", ...],
    "consultationAdvice": "consultation guidance"
}}"""

        return prompt
    
    async def _generate_content(self, prompt: str) -> str:
        """Generate content using Gemini API"""
        try:
            url = f"{self.base_url}/models/{self.model}:generateContent"
            headers = {"Content-Type": "application/json"}
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.3,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 2048,
                    "stopSequences": []
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH", 
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            }
            
            response = await self.client.post(
                f"{url}?key={self.api_key}",
                headers=headers,
                json=payload
            )
            
            if response.status_code != 200:
                raise Exception(f"API request failed: {response.status_code} - {response.text}")
            
            result = response.json()
            
            if 'candidates' not in result or not result['candidates']:
                raise Exception("No content generated")
            
            content = result['candidates'][0]['content']['parts'][0]['text']
            return content
            
        except Exception as e:
            logger.error(f"Error generating content: {e}")
            raise
    
    def _parse_ai_response(self, ai_response: str, basic_info: Dict) -> Dict[str, Any]:
        """Parse AI response and structure it"""
        try:
            # Try to extract JSON from response
            start_idx = ai_response.find('{')
            end_idx = ai_response.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = ai_response[start_idx:end_idx]
                parsed_response = json.loads(json_str)
                
                # Validate and clean response
                enhanced_info = {
                    'description': parsed_response.get('description', basic_info.get('description', '')),
                    'severity': parsed_response.get('severity', 'Moderate'),
                    'precautions': parsed_response.get('precautions', basic_info.get('precautions', [])),
                    'medications': parsed_response.get('medications', basic_info.get('medications', [])),
                    'traditionalMedicines': parsed_response.get('traditionalMedicines', []),
                    'homeRemedies': parsed_response.get('homeRemedies', []),
                    'diet': parsed_response.get('diet', basic_info.get('diet', '')),
                    'workouts': parsed_response.get('workouts', basic_info.get('workout', [])),
                    'consultationAdvice': parsed_response.get('consultationAdvice', 'Consult healthcare provider if symptoms persist')
                }
                
                return enhanced_info
            else:
                raise Exception("No valid JSON found in response")
                
        except Exception as e:
            logger.error(f"Error parsing AI response: {e}")
            return self._create_fallback_response("Unknown", basic_info)
    
    def _create_fallback_response(self, disease: str, basic_info: Dict) -> Dict[str, Any]:
        """Create fallback response when AI is not available"""
        return {
            'description': basic_info.get('description', f"**{disease}** is a medical condition that requires proper attention and care. Please consult with a **qualified healthcare professional** for accurate diagnosis and treatment."),
            'severity': 'Moderate',
            'precautions': basic_info.get('precautions', [
                "Consult with a **qualified healthcare professional** promptly",
                "Monitor symptoms closely and note any **changes**",
                "Maintain **proper hygiene** and rest",
                "Stay **well-hydrated** with clean water",
                "Avoid **self-medication** without guidance"
            ]),
            'medications': basic_info.get('medications', [
                "Consult a **doctor** before taking any medications",
                "Follow **prescribed dosages** exactly",
                "Complete the full **course of treatment**"
            ]),
            'traditionalMedicines': [
                "**Tulsi** (Holy Basil) tea: Boil **8-10 fresh leaves** in water, drink **twice daily**",
                "**Ginger-turmeric** milk: Add **1/2 tsp each** to warm milk before bedtime",
                "**Triphala** powder: **1 tsp** with warm water at night",
                "Consult an **Ayurvedic practitioner** for personalized treatment"
            ],
            'homeRemedies': [
                "**Warm salt water** gargling: Mix **1/2 tsp salt** in warm water, gargle **3-4 times daily**",
                "**Steam inhalation**: Add few drops of **eucalyptus oil** to hot water",
                "**Honey-lemon** water: Mix **1 tsp honey** with **half lemon juice** in warm water",
                "Apply **warm compress** to affected areas for relief"
            ],
            'diet': basic_info.get('diet', "Follow a **balanced, easily digestible diet** with plenty of fluids. Include fresh fruits like **oranges and pomegranates**, vegetables, **whole grains**, and avoid **spicy, oily foods**. Include immunity-boosting spices like **turmeric**, **ginger**, and **garlic**."),
            'workouts': basic_info.get('workout', [
                "**Light walking** for 15-20 minutes daily",
                "**Gentle stretching exercises** and **yoga**",
                "**Deep breathing exercises** (Pranayama)",
                "Avoid **intense physical activity** during illness"
            ]),
            'consultationAdvice': f"Seek **medical consultation within 24-48 hours** if symptoms persist or worsen. For **{disease}**, it's recommended to visit a **general physician** first, who may refer you to a **specialist** if needed."
        }
    
    async def cleanup(self):
        """Cleanup Gemini service"""
        logger.info("Cleaning up Gemini Service...")
        if self.client:
            await self.client.aclose()
        self.is_initialized = False
