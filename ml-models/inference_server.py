"""
ISL Translation Inference Server
Serves trained models for real-time translation
"""

import os
import json
import numpy as np
import tensorflow as tf
import pickle
import librosa
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from pathlib import Path
import base64
import io
import wave
from speech_to_isl import ISLDataProcessor, ISLAvatarGenerator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class ISLInferenceService:
    """Service for ISL translation inference"""
    
    def __init__(self):
        self.data_processor = ISLDataProcessor()
        self.avatar_generator = ISLAvatarGenerator()
        self.text_model = None
        self.speech_model = None
        self.text_label_encoder = None
        self.speech_label_encoder = None
        self.load_models()
    
    def load_models(self):
        """Load trained models and encoders"""
        try:
            # Load text-to-ISL model
            text_model_path = "ml-models/models/text_to_isl_model.h5"
            if os.path.exists(text_model_path):
                self.text_model = tf.keras.models.load_model(text_model_path)
                logger.info("Text-to-ISL model loaded successfully")
            
            # Load speech-to-ISL model
            speech_model_path = "ml-models/models/speech_to_isl_model.h5"
            if os.path.exists(speech_model_path):
                self.speech_model = tf.keras.models.load_model(speech_model_path)
                logger.info("Speech-to-ISL model loaded successfully")
            
            # Load label encoders
            text_encoder_path = "ml-models/models/text_label_encoder.pkl"
            if os.path.exists(text_encoder_path):
                with open(text_encoder_path, 'rb') as f:
                    self.text_label_encoder = pickle.load(f)
                logger.info("Text label encoder loaded successfully")
            
            speech_encoder_path = "ml-models/models/speech_label_encoder.pkl"
            if os.path.exists(speech_encoder_path):
                with open(speech_encoder_path, 'rb') as f:
                    self.speech_label_encoder = pickle.load(f)
                logger.info("Speech label encoder loaded successfully")
                
        except Exception as e:
            logger.error(f"Error loading models: {e}")
    
    def translate_text_to_isl(self, text):
        """Translate text to ISL signs"""
        if self.text_model is None or self.text_label_encoder is None:
            raise ValueError("Text model not loaded")
        
        # Preprocess text
        processed_text = self.data_processor.preprocess_text(text)
        processed_text = np.expand_dims(processed_text, axis=0)
        
        # Predict ISL signs
        predictions = self.text_model.predict(processed_text)
        predicted_classes = np.argmax(predictions, axis=1)
        confidence_scores = np.max(predictions, axis=1)
        
        # Decode predictions
        isl_signs = self.text_label_encoder.inverse_transform(predicted_classes)
        
        return {
            'signs': isl_signs.tolist(),
            'confidence': confidence_scores.tolist(),
            'original_text': text
        }
    
    def translate_speech_to_isl(self, audio_data):
        """Translate speech to ISL signs"""
        if self.speech_model is None or self.speech_label_encoder is None:
            raise ValueError("Speech model not loaded")
        
        # Extract audio features
        features = self.extract_audio_features_from_data(audio_data)
        if features is None:
            raise ValueError("Could not extract audio features")
        
        features = np.expand_dims(features, axis=0)
        
        # Predict ISL signs
        predictions = self.speech_model.predict(features)
        predicted_classes = np.argmax(predictions, axis=1)
        confidence_scores = np.max(predictions, axis=1)
        
        # Decode predictions
        isl_signs = self.speech_label_encoder.inverse_transform(predicted_classes)
        
        return {
            'signs': isl_signs.tolist(),
            'confidence': confidence_scores.tolist()
        }
    
    def extract_audio_features_from_data(self, audio_data):
        """Extract features from audio data"""
        try:
            # Convert base64 audio to numpy array
            audio_bytes = base64.b64decode(audio_data)
            audio_io = io.BytesIO(audio_bytes)
            
            # Read audio data
            with wave.open(audio_io, 'rb') as wav_file:
                frames = wav_file.readframes(-1)
                audio_array = np.frombuffer(frames, dtype=np.int16)
                sample_rate = wav_file.getframerate()
            
            # Convert to float and normalize
            audio_array = audio_array.astype(np.float32) / 32768.0
            
            # Extract MFCC features
            mfccs = librosa.feature.mfcc(
                y=audio_array, 
                sr=sample_rate, 
                n_mfcc=self.data_processor.n_mfcc
            )
            mfccs_scaled = np.mean(mfccs.T, axis=0)
            
            return mfccs_scaled
            
        except Exception as e:
            logger.error(f"Error extracting audio features: {e}")
            return None
    
    def generate_avatar_animation(self, isl_signs):
        """Generate 3D avatar animation for ISL signs"""
        return self.avatar_generator.generate_avatar_animation(isl_signs)

# Initialize inference service
inference_service = ISLInferenceService()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'text_model_loaded': inference_service.text_model is not None,
        'speech_model_loaded': inference_service.speech_model is not None
    })

@app.route('/translate/text', methods=['POST'])
def translate_text():
    """Translate text to ISL"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Translate text to ISL
        translation_result = inference_service.translate_text_to_isl(text)
        
        # Generate avatar animation
        animation_data = inference_service.generate_avatar_animation(
            translation_result['signs']
        )
        
        return jsonify({
            'success': True,
            'translation': translation_result,
            'animation': animation_data
        })
        
    except Exception as e:
        logger.error(f"Text translation error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/translate/speech', methods=['POST'])
def translate_speech():
    """Translate speech to ISL"""
    try:
        data = request.get_json()
        audio_data = data.get('audio', '')
        
        if not audio_data:
            return jsonify({'error': 'Audio data is required'}), 400
        
        # Translate speech to ISL
        translation_result = inference_service.translate_speech_to_isl(audio_data)
        
        # Generate avatar animation
        animation_data = inference_service.generate_avatar_animation(
            translation_result['signs']
        )
        
        return jsonify({
            'success': True,
            'translation': translation_result,
            'animation': animation_data
        })
        
    except Exception as e:
        logger.error(f"Speech translation error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/avatar/preview', methods=['POST'])
def preview_avatar():
    """Generate avatar preview for given signs"""
    try:
        data = request.get_json()
        signs = data.get('signs', [])
        
        if not signs:
            return jsonify({'error': 'Signs are required'}), 400
        
        # Generate avatar animation
        animation_data = inference_service.generate_avatar_animation(signs)
        
        return jsonify({
            'success': True,
            'animation': animation_data
        })
        
    except Exception as e:
        logger.error(f"Avatar preview error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/models/info', methods=['GET'])
def model_info():
    """Get information about loaded models"""
    return jsonify({
        'text_model': {
            'loaded': inference_service.text_model is not None,
            'classes': len(inference_service.text_label_encoder.classes_) if inference_service.text_label_encoder else 0
        },
        'speech_model': {
            'loaded': inference_service.speech_model is not None,
            'classes': len(inference_service.speech_label_encoder.classes_) if inference_service.speech_label_encoder else 0
        },
        'available_signs': list(inference_service.avatar_generator.sign_to_animation.keys())
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)