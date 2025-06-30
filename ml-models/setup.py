"""
Setup script for ISL ML models
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Install required packages"""
    print("Installing ML dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "ml-models/requirements.txt"])

def setup_directories():
    """Create necessary directories"""
    print("Setting up directories...")
    directories = [
        "ml-models/data/train/text_data",
        "ml-models/data/train/audio_data", 
        "ml-models/data/train/video_data",
        "ml-models/data/test/text_data",
        "ml-models/data/test/audio_data",
        "ml-models/data/test/video_data",
        "ml-models/models",
        "ml-models/checkpoints",
        "ml-models/logs"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"Created: {directory}")

def prepare_data():
    """Prepare training data"""
    print("Preparing training data...")
    from data_preparation import main as prepare_main
    prepare_main()

def main():
    """Main setup function"""
    print("Setting up ISL ML Models...")
    
    try:
        install_requirements()
        setup_directories()
        prepare_data()
        
        print("\n✅ Setup completed successfully!")
        print("\nNext steps:")
        print("1. Run training: python ml-models/train_models.py")
        print("2. Start inference server: python ml-models/start_inference_server.py")
        
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()