import apiService from './api';

interface MLTranslationRequest {
  text?: string;
  audio?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

interface MLTranslationResponse {
  success: boolean;
  translation: {
    signs: string[];
    confidence: number[];
    original_text?: string;
  };
  animation: {
    signs: Array<{
      sign: string;
      start_time: number;
      end_time: number;
      keyframes: Array<{
        time: number;
        right_hand: number[];
        left_hand: number[];
      }>;
    }>;
    total_duration: number;
    fps: number;
  };
}

interface MLModelInfo {
  text_model: {
    loaded: boolean;
    classes: number;
  };
  speech_model: {
    loaded: boolean;
    classes: number;
  };
  available_signs: string[];
}

class MLService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5001';
  }

  async healthCheck(): Promise<{ status: string; text_model_loaded: boolean; speech_model_loaded: boolean }> {
    const response = await fetch(`${this.baseURL}/health`);
    return response.json();
  }

  async translateText(text: string, sourceLanguage = 'en'): Promise<MLTranslationResponse> {
    const response = await fetch(`${this.baseURL}/translate/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage: 'isl'
      }),
    });

    if (!response.ok) {
      throw new Error(`ML translation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async translateSpeech(audioData: string): Promise<MLTranslationResponse> {
    const response = await fetch(`${this.baseURL}/translate/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: audioData
      }),
    });

    if (!response.ok) {
      throw new Error(`ML speech translation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async generateAvatarPreview(signs: string[]): Promise<MLTranslationResponse['animation']> {
    const response = await fetch(`${this.baseURL}/avatar/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signs
      }),
    });

    if (!response.ok) {
      throw new Error(`Avatar preview generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.animation;
  }

  async getModelInfo(): Promise<MLModelInfo> {
    const response = await fetch(`${this.baseURL}/models/info`);
    return response.json();
  }

  // Audio recording utilities
  async startAudioRecording(): Promise<MediaRecorder> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    return mediaRecorder;
  }

  async recordAudioToBase64(duration: number = 5000): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const mediaRecorder = await this.startAudioRecording();
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(blob);
        };

        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }, duration);

      } catch (error) {
        reject(error);
      }
    });
  }

  // Enhanced translation with fallback to existing API
  async enhancedTranslateText(text: string, sourceLanguage = 'en'): Promise<any> {
    try {
      // Try ML service first
      const mlResult = await this.translateText(text, sourceLanguage);
      return {
        ...mlResult,
        source: 'ml',
        enhanced: true
      };
    } catch (error) {
      console.warn('ML service unavailable, falling back to basic translation:', error);
      
      // Fallback to existing translation service
      try {
        const fallbackResult = await apiService.translateText(text, sourceLanguage, 'isl');
        return {
          success: true,
          translation: {
            signs: [text], // Basic fallback
            confidence: [0.8],
            original_text: text
          },
          animation: {
            signs: [{
              sign: text,
              start_time: 0,
              end_time: 2,
              keyframes: [
                { time: 0, right_hand: [0, 0.5, 0], left_hand: [0, 0, 0] },
                { time: 1, right_hand: [0.2, 0.7, 0.1], left_hand: [0, 0, 0] },
                { time: 2, right_hand: [0, 0.5, 0], left_hand: [0, 0, 0] }
              ]
            }],
            total_duration: 2,
            fps: 30
          },
          source: 'fallback',
          enhanced: false
        };
      } catch (fallbackError) {
        throw new Error('Both ML service and fallback translation failed');
      }
    }
  }
}

export const mlService = new MLService();
export default mlService;