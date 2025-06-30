"""
Training script for ISL translation models
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from speech_to_isl import ISLTrainingPipeline
from data_preparation import ISLDatasetBuilder
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Main training function"""
    logger.info("Starting ISL model training pipeline...")
    
    # Step 1: Prepare data
    logger.info("Step 1: Preparing dataset...")
    builder = ISLDatasetBuilder()
    
    # Create synthetic dataset
    synthetic_stats = builder.create_synthetic_dataset()
    augmented_count = builder.augment_dataset()
    validation = builder.validate_dataset()
    
    if validation['issues']:
        logger.error(f"Dataset validation failed: {validation['issues']}")
        return
    
    logger.info("Dataset preparation completed successfully!")
    
    # Step 2: Train models
    logger.info("Step 2: Training models...")
    pipeline = ISLTrainingPipeline()
    
    try:
        # Train text-to-ISL model
        logger.info("Training text-to-ISL model...")
        text_history = pipeline.train_text_to_isl_model("ml-models/data", epochs=50)
        
        # Train speech-to-ISL model (if audio data available)
        logger.info("Training speech-to-ISL model...")
        try:
            speech_history = pipeline.train_speech_to_isl_model("ml-models/data", epochs=50)
        except Exception as e:
            logger.warning(f"Speech model training skipped: {e}")
            speech_history = None
        
        # Step 3: Evaluate models
        logger.info("Step 3: Evaluating models...")
        try:
            results = pipeline.evaluate_models("ml-models/data/test")
            logger.info(f"Evaluation results: {results}")
        except Exception as e:
            logger.warning(f"Model evaluation skipped: {e}")
        
        logger.info("Training pipeline completed successfully!")
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

if __name__ == "__main__":
    main()