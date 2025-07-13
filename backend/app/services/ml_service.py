"""Machine Learning Service with dummy model"""

import logging
import numpy as np
import pandas as pd
import pickle
import random
from pathlib import Path
from typing import Optional, List, Dict, Tuple
import asyncio

from app.models.schemas import SeverityLevel

logger = logging.getLogger(__name__)

class MLService:
    """Machine Learning service with dummy model fallback"""
    
    def __init__(self):
        self.model = None
        self.symptoms_dict = {}
        self.diseases_list = {}
        self.datasets = {}
        self.is_initialized = False
        
    async def initialize(self):
        """Initialize ML service"""
        try:
            logger.info("Initializing ML Service...")
            
            # Try to load real model and data
            await self._load_model_and_data()
            
            # If real model fails, use dummy model
            if not self.model:
                logger.warning("Real model not available, using dummy model")
                self._initialize_dummy_model()
            
            self.is_initialized = True
            logger.info("ML Service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize ML Service: {e}")
            # Fallback to dummy model
            self._initialize_dummy_model()
            self.is_initialized = True
            logger.info("ML Service initialized with dummy model")
    
    async def _load_model_and_data(self):
        """Load real model and datasets"""
        try:
            # Define paths
            model_path = Path("models/svc.pkl")
            datasets_path = Path("datasets")
            
            # Load model if exists
            if model_path.exists():
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                logger.info("Real ML model loaded successfully")
            
            # Load datasets if they exist
            dataset_files = {
                'symptoms': 'symtoms_df.csv',
                'precautions': 'precautions_df.csv',
                'workout': 'workout_df.csv',
                'description': 'description.csv',
                'medications': 'medications.csv',
                'diets': 'diets.csv'
            }
            
            for key, filename in dataset_files.items():
                file_path = datasets_path / filename
                if file_path.exists():
                    self.datasets[key] = pd.read_csv(file_path)
                    logger.info(f"Loaded dataset: {filename}")
            
            # Initialize symptoms dictionary and diseases list
            self._initialize_mappings()
            
        except Exception as e:
            logger.error(f"Error loading real model/data: {e}")
            self.model = None
    
    def _initialize_mappings(self):
        """Initialize symptoms and diseases mappings"""
        # Real symptoms dictionary (from your Flask app)
        self.symptoms_dict = {
            'itching': 0, 'skin_rash': 1, 'nodal_skin_eruptions': 2, 'continuous_sneezing': 3,
            'shivering': 4, 'chills': 5, 'joint_pain': 6, 'stomach_pain': 7, 'acidity': 8,
            'ulcers_on_tongue': 9, 'muscle_wasting': 10, 'vomiting': 11, 'burning_micturition': 12,
            'spotting_ urination': 13, 'fatigue': 14, 'weight_gain': 15, 'anxiety': 16,
            'cold_hands_and_feets': 17, 'mood_swings': 18, 'weight_loss': 19, 'restlessness': 20,
            'lethargy': 21, 'patches_in_throat': 22, 'irregular_sugar_level': 23, 'cough': 24,
            'high_fever': 25, 'sunken_eyes': 26, 'breathlessness': 27, 'sweating': 28,
            'dehydration': 29, 'indigestion': 30, 'headache': 31, 'yellowish_skin': 32,
            'dark_urine': 33, 'nausea': 34, 'loss_of_appetite': 35, 'pain_behind_the_eyes': 36,
            'back_pain': 37, 'constipation': 38, 'abdominal_pain': 39, 'diarrhoea': 40,
            'mild_fever': 41, 'yellow_urine': 42, 'yellowing_of_eyes': 43, 'acute_liver_failure': 44,
            'fluid_overload': 45, 'swelling_of_stomach': 46, 'swelled_lymph_nodes': 47,
            'malaise': 48, 'blurred_and_distorted_vision': 49, 'phlegm': 50, 'throat_irritation': 51,
            'redness_of_eyes': 52, 'sinus_pressure': 53, 'runny_nose': 54, 'congestion': 55,
            'chest_pain': 56, 'weakness_in_limbs': 57, 'fast_heart_rate': 58,
            'pain_during_bowel_movements': 59, 'pain_in_anal_region': 60, 'bloody_stool': 61,
            'irritation_in_anus': 62, 'neck_pain': 63, 'dizziness': 64, 'cramps': 65,
            'bruising': 66, 'obesity': 67, 'swollen_legs': 68, 'swollen_blood_vessels': 69,
            'puffy_face_and_eyes': 70, 'enlarged_thyroid': 71, 'brittle_nails': 72,
            'swollen_extremeties': 73, 'excessive_hunger': 74, 'extra_marital_contacts': 75,
            'drying_and_tingling_lips': 76, 'slurred_speech': 77, 'knee_pain': 78,
            'hip_joint_pain': 79, 'muscle_weakness': 80, 'stiff_neck': 81, 'swelling_joints': 82,
            'movement_stiffness': 83, 'spinning_movements': 84, 'loss_of_balance': 85,
            'unsteadiness': 86, 'weakness_of_one_body_side': 87, 'loss_of_smell': 88,
            'bladder_discomfort': 89, 'foul_smell_of urine': 90, 'continuous_feel_of_urine': 91,
            'passage_of_gases': 92, 'internal_itching': 93, 'toxic_look_(typhos)': 94,
            'depression': 95, 'irritability': 96, 'muscle_pain': 97, 'altered_sensorium': 98,
            'red_spots_over_body': 99, 'belly_pain': 100, 'abnormal_menstruation': 101,
            'dischromic _patches': 102, 'watering_from_eyes': 103, 'increased_appetite': 104,
            'polyuria': 105, 'family_history': 106, 'mucoid_sputum': 107, 'rusty_sputum': 108,
            'lack_of_concentration': 109, 'visual_disturbances': 110, 'receiving_blood_transfusion': 111,
            'receiving_unsterile_injections': 112, 'coma': 113, 'stomach_bleeding': 114,
            'distention_of_abdomen': 115, 'history_of_alcohol_consumption': 116,
            'fluid_overload.1': 117, 'blood_in_sputum': 118, 'prominent_veins_on_calf': 119,
            'palpitations': 120, 'painful_walking': 121, 'pus_filled_pimples': 122,
            'blackheads': 123, 'scurring': 124, 'skin_peeling': 125, 'silver_like_dusting': 126,
            'small_dents_in_nails': 127, 'inflammatory_nails': 128, 'blister': 129,
            'red_sore_around_nose': 130, 'yellow_crust_ooze': 131
        }
        
        # Real diseases list (from your Flask app)
        self.diseases_list = {
            15: 'Fungal infection', 4: 'Allergy', 16: 'GERD', 9: 'Chronic cholestasis',
            14: 'Drug Reaction', 33: 'Peptic ulcer diseae', 1: 'AIDS', 12: 'Diabetes ',
            17: 'Gastroenteritis', 6: 'Bronchial Asthma', 23: 'Hypertension ', 30: 'Migraine',
            7: 'Cervical spondylosis', 32: 'Paralysis (brain hemorrhage)', 28: 'Jaundice',
            29: 'Malaria', 8: 'Chicken pox', 11: 'Dengue', 37: 'Typhoid', 40: 'hepatitis A',
            19: 'Hepatitis B', 20: 'Hepatitis C', 21: 'Hepatitis D', 22: 'Hepatitis E',
            3: 'Alcoholic hepatitis', 36: 'Tuberculosis', 10: 'Common Cold', 34: 'Pneumonia',
            13: 'Dimorphic hemmorhoids(piles)', 18: 'Heart attack', 39: 'Varicose veins',
            26: 'Hypothyroidism', 24: 'Hyperthyroidism', 25: 'Hypoglycemia',
            31: 'Osteoarthristis', 5: 'Arthritis', 0: '(vertigo) Paroymsal  Positional Vertigo',
            2: 'Acne', 38: 'Urinary tract infection', 35: 'Psoriasis', 27: 'Impetigo'
        }
    
    def _initialize_dummy_model(self):
        """Initialize dummy model for testing"""
        logger.info("Initializing dummy ML model...")
        
        # Initialize mappings if not already done
        if not self.symptoms_dict:
            self._initialize_mappings()
        
        # Create dummy datasets
        self._create_dummy_datasets()
        
        # Dummy model class
        class DummyModel:
            def predict(self, X):
                # Return random disease prediction
                return [random.choice(list(self.diseases_list.keys()))]
        
        self.model = DummyModel()
        logger.info("Dummy ML model initialized")
    
    def _create_dummy_datasets(self):
        """Create dummy datasets for testing"""
        # Create dummy data for each dataset
        diseases = list(self.diseases_list.values())
        
        # Dummy descriptions
        descriptions = []
        for disease in diseases:
            descriptions.append({
                'Disease': disease,
                'Description': f"This is a medical condition characterized by various symptoms. {disease} requires proper medical attention and care."
            })
        self.datasets['description'] = pd.DataFrame(descriptions)
        
        # Dummy precautions
        precautions = []
        for disease in diseases:
            precautions.append({
                'Disease': disease,
                'Precaution_1': 'Maintain proper hygiene',
                'Precaution_2': 'Take prescribed medications',
                'Precaution_3': 'Get adequate rest',
                'Precaution_4': 'Consult healthcare provider'
            })
        self.datasets['precautions'] = pd.DataFrame(precautions)
        
        # Dummy medications
        medications = []
        for disease in diseases:
            medications.append({
                'Disease': disease,
                'Medication': f'Standard medication for {disease}'
            })
        self.datasets['medications'] = pd.DataFrame(medications)
        
        # Dummy diets
        diets = []
        for disease in diseases:
            diets.append({
                'Disease': disease,
                'Diet': 'Balanced diet with plenty of fluids and nutritious foods'
            })
        self.datasets['diets'] = pd.DataFrame(diets)
        
        # Dummy workouts
        workouts = []
        for disease in diseases:
            workouts.append({
                'disease': disease,
                'workout': 'Light exercise as recommended by healthcare provider'
            })
        self.datasets['workout'] = pd.DataFrame(workouts)
    
    async def predict_disease(self, symptoms: List[str]) -> Tuple[Optional[str], float]:
        """Predict disease from symptoms"""
        if not self.is_initialized:
            raise RuntimeError("ML Service not initialized")
        
        try:
            # Process symptoms
            processed_symptoms = [s.strip().lower().replace(" ", "_") for s in symptoms]
            
            # Create input vector
            input_vector = np.zeros(len(self.symptoms_dict))
            valid_symptoms = 0
            
            for symptom in processed_symptoms:
                if symptom in self.symptoms_dict:
                    input_vector[self.symptoms_dict[symptom]] = 1
                    valid_symptoms += 1
            
            if valid_symptoms == 0:
                return None, 0.0
            
            # Make prediction
            prediction = self.model.predict([input_vector])[0]
            disease = self.diseases_list.get(prediction, "Unknown Disease")
            
            # Calculate confidence (dummy calculation)
            confidence = min(0.95, 0.6 + (valid_symptoms * 0.1))
            
            return disease, confidence
            
        except Exception as e:
            logger.error(f"Error in disease prediction: {e}")
            raise
    
    def get_disease_info(self, disease: str) -> Dict:
        """Get comprehensive disease information"""
        try:
            info = {}
            
            # Get description
            if 'description' in self.datasets:
                desc_df = self.datasets['description']
                desc_row = desc_df[desc_df['Disease'] == disease]
                info['description'] = desc_row['Description'].iloc[0] if not desc_row.empty else "No description available"
            
            # Get precautions
            if 'precautions' in self.datasets:
                prec_df = self.datasets['precautions']
                prec_row = prec_df[prec_df['Disease'] == disease]
                if not prec_row.empty:
                    precautions = []
                    for col in ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']:
                        if col in prec_row.columns:
                            val = prec_row[col].iloc[0]
                            if pd.notna(val):
                                precautions.append(val)
                    info['precautions'] = precautions
            
            # Get medications
            if 'medications' in self.datasets:
                med_df = self.datasets['medications']
                med_rows = med_df[med_df['Disease'] == disease]
                info['medications'] = med_rows['Medication'].tolist() if not med_rows.empty else []
            
            # Get diet
            if 'diets' in self.datasets:
                diet_df = self.datasets['diets']
                diet_row = diet_df[diet_df['Disease'] == disease]
                info['diet'] = diet_row['Diet'].iloc[0] if not diet_row.empty else "Balanced diet recommended"
            
            # Get workout
            if 'workout' in self.datasets:
                workout_df = self.datasets['workout']
                workout_row = workout_df[workout_df['disease'] == disease]
                info['workout'] = workout_row['workout'].tolist() if not workout_row.empty else ["Light exercise recommended"]
            
            return info
            
        except Exception as e:
            logger.error(f"Error getting disease info: {e}")
            return {}
    
    def get_symptoms_list(self) -> List[Dict]:
        """Get list of all available symptoms"""
        symptoms = []
        for symptom, index in self.symptoms_dict.items():
            symptoms.append({
                'name': symptom.replace('_', ' ').title(),
                'key': symptom,
                'index': index,
                'category': self._get_symptom_category(symptom)
            })
        return sorted(symptoms, key=lambda x: x['name'])
    
    def get_diseases_list(self) -> List[Dict]:
        """Get list of all available diseases"""
        diseases = []
        for index, disease in self.diseases_list.items():
            diseases.append({
                'name': disease,
                'index': index,
                'severity': self._get_disease_severity(disease)
            })
        return sorted(diseases, key=lambda x: x['name'])
    
    def _get_symptom_category(self, symptom: str) -> str:
        """Categorize symptoms"""
        if any(word in symptom for word in ['fever', 'temperature', 'chills', 'sweating']):
            return 'Temperature Related'
        elif any(word in symptom for word in ['pain', 'ache', 'cramps']):
            return 'Pain Related'
        elif any(word in symptom for word in ['skin', 'rash', 'itching']):
            return 'Skin Related'
        elif any(word in symptom for word in ['stomach', 'abdominal', 'nausea', 'vomiting']):
            return 'Digestive'
        elif any(word in symptom for word in ['cough', 'breathlessness', 'chest']):
            return 'Respiratory'
        else:
            return 'General'
    
    def _get_disease_severity(self, disease: str) -> str:
        """Determine disease severity"""
        severe_diseases = ['AIDS', 'Heart attack', 'Paralysis', 'Tuberculosis']
        moderate_diseases = ['Diabetes', 'Hypertension', 'Asthma']
        
        if any(severe in disease for severe in severe_diseases):
            return 'Severe'
        elif any(moderate in disease for moderate in moderate_diseases):
            return 'Moderate'
        else:
            return 'Mild'
    
    async def cleanup(self):
        """Cleanup ML service"""
        logger.info("Cleaning up ML Service...")
        self.model = None
        self.datasets.clear()
        self.is_initialized = False
