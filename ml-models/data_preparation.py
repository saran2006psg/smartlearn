"""
Data Preparation for ISL Translation Models
Prepares training data from various sources
"""

import os
import json
import numpy as np
import pandas as pd
from pathlib import Path
import librosa
import cv2
import mediapipe as mp
from sklearn.preprocessing import LabelEncoder
import logging
from tqdm import tqdm
import requests
import zipfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ISLDatasetBuilder:
    """Build ISL dataset from various sources"""
    
    def __init__(self, data_dir="ml-models/data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        # Create subdirectories
        (self.data_dir / "train" / "text_data").mkdir(parents=True, exist_ok=True)
        (self.data_dir / "train" / "audio_data").mkdir(parents=True, exist_ok=True)
        (self.data_dir / "train" / "video_data").mkdir(parents=True, exist_ok=True)
        (self.data_dir / "test" / "text_data").mkdir(parents=True, exist_ok=True)
        (self.data_dir / "test" / "audio_data").mkdir(parents=True, exist_ok=True)
        (self.data_dir / "test" / "video_data").mkdir(parents=True, exist_ok=True)
        
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
    
    def create_synthetic_dataset(self):
        """Create synthetic dataset for initial training"""
        logger.info("Creating synthetic ISL dataset...")
        
        # Common ISL vocabulary with Hindi/English mappings
        isl_vocabulary = {
            'hello': ['hello', 'hi', 'नमस्ते', 'हैलो'],
            'thank_you': ['thank you', 'thanks', 'धन्यवाद', 'शुक्रिया'],
            'please': ['please', 'कृपया', 'प्लीज'],
            'sorry': ['sorry', 'माफ करना', 'सॉरी'],
            'good_morning': ['good morning', 'सुप्रभात', 'गुड मॉर्निंग'],
            'good_evening': ['good evening', 'शुभ संध्या', 'गुड इवनिंग'],
            'yes': ['yes', 'हाँ', 'जी हाँ'],
            'no': ['no', 'नहीं', 'ना'],
            'help': ['help', 'मदद', 'सहायता'],
            'water': ['water', 'पानी', 'जल'],
            'food': ['food', 'खाना', 'भोजन'],
            'home': ['home', 'घर', 'होम'],
            'school': ['school', 'स्कूल', 'विद्यालय'],
            'book': ['book', 'किताब', 'पुस्तक'],
            'pen': ['pen', 'कलम', 'पेन'],
            'mother': ['mother', 'mom', 'माँ', 'माता'],
            'father': ['father', 'dad', 'पिता', 'पापा'],
            'friend': ['friend', 'दोस्त', 'मित्र'],
            'teacher': ['teacher', 'शिक्षक', 'टीचर'],
            'student': ['student', 'छात्र', 'विद्यार्थी'],
            'love': ['love', 'प्यार', 'प्रेम'],
            'happy': ['happy', 'खुश', 'प्रसन्न'],
            'sad': ['sad', 'दुखी', 'उदास'],
            'beautiful': ['beautiful', 'सुंदर', 'खूबसूरत'],
            'good': ['good', 'अच्छा', 'बढ़िया'],
            'bad': ['bad', 'बुरा', 'खराब'],
            'big': ['big', 'बड़ा', 'विशाल'],
            'small': ['small', 'छोटा', 'नन्हा'],
            'hot': ['hot', 'गर्म', 'तेज़'],
            'cold': ['cold', 'ठंडा', 'शीत'],
            'fast': ['fast', 'तेज़', 'जल्दी'],
            'slow': ['slow', 'धीमा', 'आराम से'],
            'come': ['come', 'आओ', 'आना'],
            'go': ['go', 'जाओ', 'जाना'],
            'sit': ['sit', 'बैठो', 'बैठना'],
            'stand': ['stand', 'खड़े हो', 'खड़ा होना'],
            'eat': ['eat', 'खाओ', 'खाना'],
            'drink': ['drink', 'पीओ', 'पीना'],
            'sleep': ['sleep', 'सोओ', 'सोना'],
            'wake_up': ['wake up', 'जागो', 'उठना'],
            'work': ['work', 'काम', 'कार्य'],
            'play': ['play', 'खेलो', 'खेलना'],
            'read': ['read', 'पढ़ो', 'पढ़ना'],
            'write': ['write', 'लिखो', 'लिखना'],
            'listen': ['listen', 'सुनो', 'सुनना'],
            'speak': ['speak', 'बोलो', 'बोलना'],
            'see': ['see', 'देखो', 'देखना'],
            'understand': ['understand', 'समझो', 'समझना'],
            'learn': ['learn', 'सीखो', 'सीखना'],
            'teach': ['teach', 'सिखाओ', 'सिखाना'],
            'money': ['money', 'पैसा', 'धन'],
            'time': ['time', 'समय', 'वक्त'],
            'day': ['day', 'दिन', 'दिवस'],
            'night': ['night', 'रात', 'रात्रि'],
            'morning': ['morning', 'सुबह', 'प्रातः'],
            'evening': ['evening', 'शाम', 'संध्या']
        }
        
        # Generate text training data
        text_data = []
        for sign, variations in isl_vocabulary.items():
            for variation in variations:
                text_data.append(f"{variation}\t{sign}")
        
        # Save text training data
        train_text_file = self.data_dir / "train" / "text_data" / "synthetic_data.txt"
        with open(train_text_file, 'w', encoding='utf-8') as f:
            for line in text_data[:int(len(text_data) * 0.8)]:  # 80% for training
                f.write(line + '\n')
        
        # Save text test data
        test_text_file = self.data_dir / "test" / "text_data" / "synthetic_data.txt"
        with open(test_text_file, 'w', encoding='utf-8') as f:
            for line in text_data[int(len(text_data) * 0.8):]:  # 20% for testing
                f.write(line + '\n')
        
        # Create vocabulary mapping
        vocab = {'<PAD>': 0, '<UNK>': 1}
        idx = 2
        for sign, variations in isl_vocabulary.items():
            for variation in variations:
                for word in variation.split():
                    if word.lower() not in vocab:
                        vocab[word.lower()] = idx
                        idx += 1
        
        vocab_file = self.data_dir / "vocabulary.json"
        with open(vocab_file, 'w', encoding='utf-8') as f:
            json.dump(vocab, f, ensure_ascii=False, indent=2)
        
        # Create sign mappings for avatar generation
        sign_mappings = {}
        for sign in isl_vocabulary.keys():
            sign_mappings[sign] = self.generate_default_animation(sign)
        
        mappings_file = self.data_dir / "sign_mappings.json"
        with open(mappings_file, 'w', encoding='utf-8') as f:
            json.dump(sign_mappings, f, indent=2)
        
        logger.info(f"Created synthetic dataset with {len(text_data)} text samples")
        logger.info(f"Vocabulary size: {len(vocab)}")
        logger.info(f"ISL signs: {len(isl_vocabulary)}")
        
        return {
            'text_samples': len(text_data),
            'vocabulary_size': len(vocab),
            'isl_signs': len(isl_vocabulary)
        }
    
    def generate_default_animation(self, sign):
        """Generate default animation keyframes for a sign"""
        # Basic animation templates based on sign type
        if sign in ['hello', 'hi']:
            return {
                'keyframes': [
                    {'time': 0, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.5, 'right_hand': [0.3, 0.8, 0.2], 'left_hand': [0, 0, 0]},
                    {'time': 1.0, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]}
                ],
                'duration': 1.0
            }
        elif sign in ['thank_you', 'thanks']:
            return {
                'keyframes': [
                    {'time': 0, 'right_hand': [0, 0.3, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.5, 'right_hand': [0, 0.6, 0.3], 'left_hand': [0, 0, 0]},
                    {'time': 1.0, 'right_hand': [0.2, 0.4, 0.1], 'left_hand': [0, 0, 0]},
                    {'time': 1.5, 'right_hand': [0, 0.3, 0], 'left_hand': [0, 0, 0]}
                ],
                'duration': 1.5
            }
        elif sign in ['yes']:
            return {
                'keyframes': [
                    {'time': 0, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.3, 'right_hand': [0, 0.3, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.6, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]}
                ],
                'duration': 0.8
            }
        elif sign in ['no']:
            return {
                'keyframes': [
                    {'time': 0, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.3, 'right_hand': [-0.2, 0.5, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.6, 'right_hand': [0.2, 0.5, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.9, 'right_hand': [0, 0.5, 0], 'left_hand': [0, 0, 0]}
                ],
                'duration': 1.0
            }
        else:
            # Default animation for other signs
            return {
                'keyframes': [
                    {'time': 0, 'right_hand': [0, 0.4, 0], 'left_hand': [0, 0, 0]},
                    {'time': 0.5, 'right_hand': [0.1, 0.6, 0.1], 'left_hand': [0, 0, 0]},
                    {'time': 1.0, 'right_hand': [0, 0.4, 0], 'left_hand': [0, 0, 0]}
                ],
                'duration': 1.2
            }
    
    def download_public_datasets(self):
        """Download public ISL datasets if available"""
        logger.info("Checking for public ISL datasets...")
        
        # List of potential public datasets (URLs would need to be actual sources)
        datasets = [
            {
                'name': 'ISL_Basic_Signs',
                'url': 'https://example.com/isl_basic_signs.zip',  # Placeholder
                'description': 'Basic ISL signs dataset'
            }
        ]
        
        downloaded = []
        for dataset in datasets:
            try:
                logger.info(f"Attempting to download {dataset['name']}...")
                # This would download actual datasets if URLs were available
                # For now, we'll skip actual downloads
                logger.info(f"Skipping {dataset['name']} - URL not available")
            except Exception as e:
                logger.warning(f"Could not download {dataset['name']}: {e}")
        
        return downloaded
    
    def augment_dataset(self):
        """Apply data augmentation techniques"""
        logger.info("Applying data augmentation...")
        
        # Text augmentation - add variations and synonyms
        augmented_data = []
        
        # Read existing training data
        train_text_file = self.data_dir / "train" / "text_data" / "synthetic_data.txt"
        if train_text_file.exists():
            with open(train_text_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            for line in lines:
                if '\t' in line:
                    text, sign = line.strip().split('\t')
                    
                    # Add variations with different cases
                    augmented_data.append(f"{text.upper()}\t{sign}")
                    augmented_data.append(f"{text.lower()}\t{sign}")
                    augmented_data.append(f"{text.title()}\t{sign}")
                    
                    # Add with punctuation
                    augmented_data.append(f"{text}.\t{sign}")
                    augmented_data.append(f"{text}!\t{sign}")
                    augmented_data.append(f"{text}?\t{sign}")
        
        # Save augmented data
        aug_file = self.data_dir / "train" / "text_data" / "augmented_data.txt"
        with open(aug_file, 'w', encoding='utf-8') as f:
            for line in augmented_data:
                f.write(line + '\n')
        
        logger.info(f"Generated {len(augmented_data)} augmented samples")
        return len(augmented_data)
    
    def validate_dataset(self):
        """Validate the prepared dataset"""
        logger.info("Validating dataset...")
        
        validation_results = {
            'text_train_samples': 0,
            'text_test_samples': 0,
            'vocabulary_size': 0,
            'unique_signs': 0,
            'issues': []
        }
        
        # Check text data
        train_text_file = self.data_dir / "train" / "text_data" / "synthetic_data.txt"
        if train_text_file.exists():
            with open(train_text_file, 'r', encoding='utf-8') as f:
                validation_results['text_train_samples'] = len(f.readlines())
        
        test_text_file = self.data_dir / "test" / "text_data" / "synthetic_data.txt"
        if test_text_file.exists():
            with open(test_text_file, 'r', encoding='utf-8') as f:
                validation_results['text_test_samples'] = len(f.readlines())
        
        # Check vocabulary
        vocab_file = self.data_dir / "vocabulary.json"
        if vocab_file.exists():
            with open(vocab_file, 'r', encoding='utf-8') as f:
                vocab = json.load(f)
                validation_results['vocabulary_size'] = len(vocab)
        
        # Check sign mappings
        mappings_file = self.data_dir / "sign_mappings.json"
        if mappings_file.exists():
            with open(mappings_file, 'r', encoding='utf-8') as f:
                mappings = json.load(f)
                validation_results['unique_signs'] = len(mappings)
        
        # Validate data quality
        if validation_results['text_train_samples'] == 0:
            validation_results['issues'].append("No training text samples found")
        
        if validation_results['text_test_samples'] == 0:
            validation_results['issues'].append("No test text samples found")
        
        if validation_results['vocabulary_size'] < 10:
            validation_results['issues'].append("Vocabulary too small")
        
        if validation_results['unique_signs'] < 5:
            validation_results['issues'].append("Too few unique ISL signs")
        
        logger.info(f"Dataset validation results: {validation_results}")
        return validation_results

def main():
    """Main data preparation function"""
    logger.info("Starting ISL dataset preparation...")
    
    # Initialize dataset builder
    builder = ISLDatasetBuilder()
    
    # Create synthetic dataset
    synthetic_stats = builder.create_synthetic_dataset()
    
    # Download public datasets (if available)
    downloaded = builder.download_public_datasets()
    
    # Apply data augmentation
    augmented_count = builder.augment_dataset()
    
    # Validate dataset
    validation = builder.validate_dataset()
    
    # Summary
    logger.info("Dataset preparation completed!")
    logger.info(f"Synthetic samples: {synthetic_stats['text_samples']}")
    logger.info(f"Augmented samples: {augmented_count}")
    logger.info(f"Total vocabulary: {validation['vocabulary_size']}")
    logger.info(f"Unique ISL signs: {validation['unique_signs']}")
    
    if validation['issues']:
        logger.warning(f"Issues found: {validation['issues']}")
    else:
        logger.info("Dataset validation passed!")

if __name__ == "__main__":
    main()