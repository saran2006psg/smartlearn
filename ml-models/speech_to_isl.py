"""
Speech to Indian Sign Language Translation Model
Based on: https://github.com/Sijosaju/Speech-to-Indian-Sign-Language-using-3D-Avatar-Animations
"""

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input, Embedding, Attention
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import librosa
import cv2
import mediapipe as mp
import json
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ISLDataProcessor:
    """Process speech and text data for ISL translation"""
    
    def __init__(self, sample_rate=16000, n_mfcc=13):
        self.sample_rate = sample_rate
        self.n_mfcc = n_mfcc
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
    def extract_audio_features(self, audio_path):
        """Extract MFCC features from audio"""
        try:
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)
            mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=self.n_mfcc)
            mfccs_scaled = np.mean(mfccs.T, axis=0)
            return mfccs_scaled
        except Exception as e:
            logger.error(f"Error extracting audio features: {e}")
            return None
    
    def extract_hand_landmarks(self, video_path):
        """Extract hand landmarks from ISL video"""
        landmarks_sequence = []
        cap = cv2.VideoCapture(video_path)
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(frame_rgb)
            
            frame_landmarks = []
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    landmarks = []
                    for landmark in hand_landmarks.landmark:
                        landmarks.extend([landmark.x, landmark.y, landmark.z])
                    frame_landmarks.extend(landmarks)
            
            # Pad or truncate to fixed size (2 hands * 21 landmarks * 3 coordinates = 126)
            while len(frame_landmarks) < 126:
                frame_landmarks.append(0.0)
            frame_landmarks = frame_landmarks[:126]
            
            landmarks_sequence.append(frame_landmarks)
        
        cap.release()
        return np.array(landmarks_sequence)
    
    def preprocess_text(self, text, max_length=50):
        """Preprocess text for model input"""
        # Convert to lowercase and tokenize
        words = text.lower().split()
        
        # Create word-to-index mapping (this should be loaded from training data)
        word_to_idx = self.load_vocabulary()
        
        # Convert words to indices
        indices = [word_to_idx.get(word, word_to_idx.get('<UNK>', 0)) for word in words]
        
        # Pad or truncate to max_length
        if len(indices) < max_length:
            indices.extend([0] * (max_length - len(indices)))
        else:
            indices = indices[:max_length]
            
        return np.array(indices)
    
    def load_vocabulary(self):
        """Load vocabulary mapping from file"""
        vocab_path = Path("ml-models/data/vocabulary.json")
        if vocab_path.exists():
            with open(vocab_path, 'r') as f:
                return json.load(f)
        else:
            # Default vocabulary for ISL common words
            return {
                '<PAD>': 0, '<UNK>': 1, 'hello': 2, 'thank': 3, 'you': 4,
                'please': 5, 'sorry': 6, 'good': 7, 'morning': 8, 'evening': 9,
                'night': 10, 'yes': 11, 'no': 12, 'help': 13, 'water': 14,
                'food': 15, 'home': 16, 'school': 17, 'book': 18, 'pen': 19
            }

class ISLTranslationModel:
    """Neural network model for Speech/Text to ISL translation"""
    
    def __init__(self, vocab_size=1000, embedding_dim=128, lstm_units=256):
        self.vocab_size = vocab_size
        self.embedding_dim = embedding_dim
        self.lstm_units = lstm_units
        self.model = None
        self.label_encoder = LabelEncoder()
        
    def build_text_to_isl_model(self, max_sequence_length=50, num_isl_signs=500):
        """Build text to ISL translation model"""
        
        # Input layer for text
        text_input = Input(shape=(max_sequence_length,), name='text_input')
        
        # Embedding layer
        embedding = Embedding(
            input_dim=self.vocab_size,
            output_dim=self.embedding_dim,
            input_length=max_sequence_length
        )(text_input)
        
        # LSTM layers with attention
        lstm1 = LSTM(self.lstm_units, return_sequences=True, dropout=0.3)(embedding)
        lstm2 = LSTM(self.lstm_units, return_sequences=True, dropout=0.3)(lstm1)
        
        # Attention mechanism
        attention = tf.keras.layers.MultiHeadAttention(
            num_heads=8, key_dim=self.lstm_units
        )(lstm2, lstm2)
        
        # Global average pooling
        pooled = tf.keras.layers.GlobalAveragePooling1D()(attention)
        
        # Dense layers
        dense1 = Dense(512, activation='relu')(pooled)
        dropout1 = Dropout(0.4)(dense1)
        dense2 = Dense(256, activation='relu')(dropout1)
        dropout2 = Dropout(0.3)(dense2)
        
        # Output layer for ISL sign classification
        output = Dense(num_isl_signs, activation='softmax', name='isl_output')(dropout2)
        
        # Create model
        model = Model(inputs=text_input, outputs=output)
        
        # Compile model
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        self.model = model
        return model
    
    def build_speech_to_isl_model(self, audio_features_dim=13, num_isl_signs=500):
        """Build speech to ISL translation model"""
        
        # Input layer for audio features
        audio_input = Input(shape=(audio_features_dim,), name='audio_input')
        
        # Dense layers for audio processing
        dense1 = Dense(256, activation='relu')(audio_input)
        dropout1 = Dropout(0.3)(dense1)
        dense2 = Dense(128, activation='relu')(dropout1)
        dropout2 = Dropout(0.3)(dense2)
        dense3 = Dense(64, activation='relu')(dropout2)
        
        # Output layer
        output = Dense(num_isl_signs, activation='softmax', name='isl_output')(dense3)
        
        # Create model
        model = Model(inputs=audio_input, outputs=output)
        
        # Compile model
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        self.model = model
        return model
    
    def train_model(self, X_train, y_train, X_val, y_val, epochs=100, batch_size=32):
        """Train the ISL translation model"""
        
        # Callbacks
        early_stopping = EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
        
        model_checkpoint = ModelCheckpoint(
            'ml-models/checkpoints/best_isl_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max'
        )
        
        # Train model
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=[early_stopping, model_checkpoint],
            verbose=1
        )
        
        return history
    
    def predict_isl_signs(self, input_data):
        """Predict ISL signs from input data"""
        if self.model is None:
            raise ValueError("Model not built or loaded")
        
        predictions = self.model.predict(input_data)
        predicted_classes = np.argmax(predictions, axis=1)
        confidence_scores = np.max(predictions, axis=1)
        
        return predicted_classes, confidence_scores
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.model:
            self.model.save(filepath)
            logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a trained model"""
        self.model = tf.keras.models.load_model(filepath)
        logger.info(f"Model loaded from {filepath}")

class ISLAvatarGenerator:
    """Generate 3D avatar animations for ISL signs"""
    
    def __init__(self):
        self.sign_to_animation = self.load_sign_mappings()
        
    def load_sign_mappings(self):
        """Load ISL sign to animation mappings"""
        mappings_path = Path("ml-models/data/sign_mappings.json")
        if mappings_path.exists():
            with open(mappings_path, 'r') as f:
                return json.load(f)
        else:
            # Default mappings for common ISL signs
            return {
                'hello': {
                    'keyframes': [
                        {'time': 0, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]},
                        {'time': 0.5, 'right_hand': [0.3, 0.8, 0.2], 'left_hand': [0, 0, 0]},
                        {'time': 1.0, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]}
                    ],
                    'duration': 1.0
                },
                'thank_you': {
                    'keyframes': [
                        {'time': 0, 'right_hand': [0, 0.3, 0], 'left_hand': [0, 0, 0]},
                        {'time': 0.5, 'right_hand': [0, 0.6, 0.3], 'left_hand': [0, 0, 0]},
                        {'time': 1.0, 'right_hand': [0.2, 0.4, 0.1], 'left_hand': [0, 0, 0]},
                        {'time': 1.5, 'right_hand': [0, 0.3, 0], 'left_hand': [0, 0, 0]}
                    ],
                    'duration': 1.5
                }
            }
    
    def generate_avatar_animation(self, isl_signs):
        """Generate 3D avatar animation for ISL signs"""
        animation_data = {
            'signs': [],
            'total_duration': 0,
            'fps': 30
        }
        
        current_time = 0
        for sign in isl_signs:
            if sign in self.sign_to_animation:
                sign_data = self.sign_to_animation[sign].copy()
                
                # Adjust timing based on current position
                for keyframe in sign_data['keyframes']:
                    keyframe['time'] += current_time
                
                animation_data['signs'].append({
                    'sign': sign,
                    'start_time': current_time,
                    'end_time': current_time + sign_data['duration'],
                    'keyframes': sign_data['keyframes']
                })
                
                current_time += sign_data['duration'] + 0.2  # Add pause between signs
        
        animation_data['total_duration'] = current_time
        return animation_data
    
    def export_animation_json(self, animation_data, output_path):
        """Export animation data as JSON for frontend"""
        with open(output_path, 'w') as f:
            json.dump(animation_data, f, indent=2)
        
        logger.info(f"Animation data exported to {output_path}")

class ISLTrainingPipeline:
    """Complete training pipeline for ISL translation"""
    
    def __init__(self):
        self.data_processor = ISLDataProcessor()
        self.text_model = ISLTranslationModel()
        self.speech_model = ISLTranslationModel()
        self.avatar_generator = ISLAvatarGenerator()
        
    def prepare_training_data(self, data_dir):
        """Prepare training data from dataset"""
        data_dir = Path(data_dir)
        
        # Load text-ISL pairs
        text_data = []
        isl_labels = []
        
        # Load speech-ISL pairs
        speech_data = []
        speech_labels = []
        
        # Process training files
        for text_file in data_dir.glob("text_data/*.txt"):
            with open(text_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                for line in lines:
                    if '\t' in line:
                        text, isl_sign = line.strip().split('\t')
                        text_processed = self.data_processor.preprocess_text(text)
                        text_data.append(text_processed)
                        isl_labels.append(isl_sign)
        
        # Process audio files
        for audio_file in data_dir.glob("audio_data/*.wav"):
            features = self.data_processor.extract_audio_features(str(audio_file))
            if features is not None:
                speech_data.append(features)
                # Get corresponding label from filename or metadata
                label = audio_file.stem.split('_')[0]  # Assuming filename format: sign_001.wav
                speech_labels.append(label)
        
        return {
            'text_data': np.array(text_data),
            'text_labels': np.array(isl_labels),
            'speech_data': np.array(speech_data),
            'speech_labels': np.array(speech_labels)
        }
    
    def train_text_to_isl_model(self, data_dir, epochs=100):
        """Train text to ISL translation model"""
        logger.info("Starting text-to-ISL model training...")
        
        # Prepare data
        data = self.prepare_training_data(data_dir)
        
        # Encode labels
        label_encoder = LabelEncoder()
        encoded_labels = label_encoder.fit_transform(data['text_labels'])
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            data['text_data'], encoded_labels, test_size=0.2, random_state=42
        )
        
        # Build and train model
        num_classes = len(label_encoder.classes_)
        self.text_model.build_text_to_isl_model(num_isl_signs=num_classes)
        
        history = self.text_model.train_model(
            X_train, y_train, X_val, y_val, epochs=epochs
        )
        
        # Save model and label encoder
        self.text_model.save_model('ml-models/models/text_to_isl_model.h5')
        with open('ml-models/models/text_label_encoder.pkl', 'wb') as f:
            pickle.dump(label_encoder, f)
        
        logger.info("Text-to-ISL model training completed!")
        return history
    
    def train_speech_to_isl_model(self, data_dir, epochs=100):
        """Train speech to ISL translation model"""
        logger.info("Starting speech-to-ISL model training...")
        
        # Prepare data
        data = self.prepare_training_data(data_dir)
        
        # Encode labels
        label_encoder = LabelEncoder()
        encoded_labels = label_encoder.fit_transform(data['speech_labels'])
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            data['speech_data'], encoded_labels, test_size=0.2, random_state=42
        )
        
        # Build and train model
        num_classes = len(label_encoder.classes_)
        self.speech_model.build_speech_to_isl_model(num_isl_signs=num_classes)
        
        history = self.speech_model.train_model(
            X_train, y_train, X_val, y_val, epochs=epochs
        )
        
        # Save model and label encoder
        self.speech_model.save_model('ml-models/models/speech_to_isl_model.h5')
        with open('ml-models/models/speech_label_encoder.pkl', 'wb') as f:
            pickle.dump(label_encoder, f)
        
        logger.info("Speech-to-ISL model training completed!")
        return history
    
    def evaluate_models(self, test_data_dir):
        """Evaluate trained models on test data"""
        logger.info("Evaluating models...")
        
        # Load test data
        test_data = self.prepare_training_data(test_data_dir)
        
        # Load label encoders
        with open('ml-models/models/text_label_encoder.pkl', 'rb') as f:
            text_label_encoder = pickle.load(f)
        
        with open('ml-models/models/speech_label_encoder.pkl', 'rb') as f:
            speech_label_encoder = pickle.load(f)
        
        # Evaluate text model
        text_encoded_labels = text_label_encoder.transform(test_data['text_labels'])
        text_loss, text_accuracy = self.text_model.model.evaluate(
            test_data['text_data'], text_encoded_labels, verbose=0
        )
        
        # Evaluate speech model
        speech_encoded_labels = speech_label_encoder.transform(test_data['speech_labels'])
        speech_loss, speech_accuracy = self.speech_model.model.evaluate(
            test_data['speech_data'], speech_encoded_labels, verbose=0
        )
        
        results = {
            'text_model': {'loss': text_loss, 'accuracy': text_accuracy},
            'speech_model': {'loss': speech_loss, 'accuracy': speech_accuracy}
        }
        
        logger.info(f"Evaluation results: {results}")
        return results

def main():
    """Main training function"""
    # Initialize training pipeline
    pipeline = ISLTrainingPipeline()
    
    # Set data directories
    train_data_dir = "ml-models/data/train"
    test_data_dir = "ml-models/data/test"
    
    # Create directories if they don't exist
    Path(train_data_dir).mkdir(parents=True, exist_ok=True)
    Path(test_data_dir).mkdir(parents=True, exist_ok=True)
    Path("ml-models/models").mkdir(parents=True, exist_ok=True)
    Path("ml-models/checkpoints").mkdir(parents=True, exist_ok=True)
    
    try:
        # Train text-to-ISL model
        text_history = pipeline.train_text_to_isl_model(train_data_dir, epochs=50)
        
        # Train speech-to-ISL model
        speech_history = pipeline.train_speech_to_isl_model(train_data_dir, epochs=50)
        
        # Evaluate models
        results = pipeline.evaluate_models(test_data_dir)
        
        # Plot training history
        plt.figure(figsize=(12, 4))
        
        plt.subplot(1, 2, 1)
        plt.plot(text_history.history['accuracy'], label='Text Model Training')
        plt.plot(text_history.history['val_accuracy'], label='Text Model Validation')
        plt.title('Text-to-ISL Model Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        
        plt.subplot(1, 2, 2)
        plt.plot(speech_history.history['accuracy'], label='Speech Model Training')
        plt.plot(speech_history.history['val_accuracy'], label='Speech Model Validation')
        plt.title('Speech-to-ISL Model Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        
        plt.tight_layout()
        plt.savefig('ml-models/training_results.png')
        plt.show()
        
        logger.info("Training pipeline completed successfully!")
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

if __name__ == "__main__":
    main()