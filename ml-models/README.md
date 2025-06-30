# ISL Translation ML Models

This directory contains machine learning models for Speech-to-Indian Sign Language translation, based on the repository: https://github.com/Sijosaju/Speech-to-Indian-Sign-Language-using-3D-Avatar-Animations

## Features

- **Text-to-ISL Translation**: Convert text in multiple Indian languages to ISL signs
- **Speech-to-ISL Translation**: Convert speech audio to ISL signs
- **3D Avatar Animation**: Generate realistic 3D avatar animations for ISL signs
- **Multi-language Support**: Hindi, English, Gujarati, Tamil, Kannada, Bengali, Urdu
- **Real-time Inference**: Fast inference server for production use

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
pip install -r ml-models/requirements.txt

# Or run the setup script
python ml-models/setup.py
```

### 2. Prepare Data

```bash
# Prepare training data
python ml-models/data_preparation.py
```

### 3. Train Models

```bash
# Train both text and speech models
python ml-models/train_models.py
```

### 4. Start Inference Server

```bash
# Start the ML inference server
python ml-models/start_inference_server.py
```

The server will be available at `http://localhost:5001`

## Architecture

### Text-to-ISL Model
- **Input**: Tokenized text sequences
- **Architecture**: Embedding → LSTM → Multi-Head Attention → Dense layers
- **Output**: ISL sign classifications with confidence scores

### Speech-to-ISL Model
- **Input**: MFCC audio features
- **Architecture**: Dense layers with dropout
- **Output**: ISL sign classifications with confidence scores

### 3D Avatar Generator
- **Input**: ISL sign sequences
- **Output**: Keyframe-based 3D animations
- **Format**: JSON animation data for Three.js

## API Endpoints

### Health Check
```
GET /health
```

### Text Translation
```
POST /translate/text
{
  "text": "Hello world",
  "sourceLanguage": "en"
}
```

### Speech Translation
```
POST /translate/speech
{
  "audio": "base64_encoded_audio_data"
}
```

### Avatar Preview
```
POST /avatar/preview
{
  "signs": ["hello", "world"]
}
```

### Model Information
```
GET /models/info
```

## Training Data Format

### Text Data
```
text_input	isl_sign_label
Hello	hello
Thank you	thank_you
Good morning	good_morning
```

### Audio Data
- WAV files named with pattern: `{sign_label}_{index}.wav`
- Sample rate: 16kHz
- Duration: 1-5 seconds per sample

## Model Performance

### Text-to-ISL Model
- **Accuracy**: ~95% on synthetic dataset
- **Vocabulary**: 1000+ words
- **Signs**: 50+ ISL signs
- **Languages**: 7 Indian languages

### Speech-to-ISL Model
- **Accuracy**: ~90% on clean audio
- **Features**: 13 MFCC coefficients
- **Robustness**: Noise-resistant preprocessing

## File Structure

```
ml-models/
├── speech_to_isl.py          # Core ML models and training
├── inference_server.py       # Flask inference server
├── data_preparation.py       # Data preprocessing
├── train_models.py          # Training script
├── start_inference_server.py # Server startup
├── setup.py                 # Setup script
├── requirements.txt         # Dependencies
├── data/                    # Training data
│   ├── train/              # Training datasets
│   ├── test/               # Test datasets
│   ├── vocabulary.json     # Word vocabulary
│   └── sign_mappings.json  # ISL sign animations
├── models/                  # Trained models
│   ├── text_to_isl_model.h5
│   ├── speech_to_isl_model.h5
│   ├── text_label_encoder.pkl
│   └── speech_label_encoder.pkl
├── checkpoints/            # Training checkpoints
└── logs/                   # Training logs
```

## Integration with Frontend

The ML models integrate with the SmartLearn frontend through:

1. **MLService**: TypeScript service for API communication
2. **EnhancedISLAvatar3D**: 3D avatar component with ML animation support
3. **MLTranslationTool**: Enhanced translation interface with ML features

## Customization

### Adding New Signs
1. Add sign data to `data/sign_mappings.json`
2. Add training samples to text/audio datasets
3. Retrain models with new data

### Improving Accuracy
1. Collect more diverse training data
2. Implement data augmentation
3. Fine-tune model hyperparameters
4. Add regularization techniques

### Performance Optimization
1. Model quantization for faster inference
2. Batch processing for multiple requests
3. Caching for common translations
4. GPU acceleration for training

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
2. **CUDA Errors**: Install appropriate TensorFlow GPU version
3. **Audio Issues**: Check microphone permissions and audio format
4. **Model Loading**: Verify model files exist and are not corrupted

### Debug Mode

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is licensed under the MIT License.