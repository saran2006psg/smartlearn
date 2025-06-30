import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Languages, 
  Mic, 
  MicOff,
  Play, 
  Pause,
  Volume2, 
  Download, 
  Settings,
  Zap,
  Brain,
  Loader
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EnhancedISLAvatar3D } from '../avatar/EnhancedISLAvatar3D';
import mlService from '../../services/mlService';

export const MLTranslationTool: React.FC = () => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translationResult, setTranslationResult] = useState<any>(null);
  const [mlServiceStatus, setMlServiceStatus] = useState<any>(null);
  const [sourceLanguage, setSourceLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  ];

  // Check ML service status on component mount
  useEffect(() => {
    checkMLServiceStatus();
  }, []);

  const checkMLServiceStatus = async () => {
    try {
      const status = await mlService.healthCheck();
      const modelInfo = await mlService.getModelInfo();
      setMlServiceStatus({ ...status, ...modelInfo });
    } catch (error) {
      console.warn('ML service not available:', error);
      setMlServiceStatus({ status: 'unavailable' });
    }
  };

  const handleTextTranslation = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await mlService.enhancedTranslateText(inputText, sourceLanguage);
      setTranslationResult(result);
    } catch (error) {
      console.error('Translation failed:', error);
      // Show error to user
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    try {
      const audioData = await mlService.recordAudioToBase64(5000); // 5 seconds
      setIsRecording(false);
      
      setIsTranslating(true);
      const result = await mlService.translateSpeech(audioData);
      setTranslationResult(result);
    } catch (error) {
      console.error('Voice translation failed:', error);
      setIsRecording(false);
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayAnimation = () => {
    if (!translationResult?.animation) return;
    
    setIsPlaying(true);
  };

  const handleAnimationComplete = () => {
    setIsPlaying(false);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && inputText) {
      const utterance = new SpeechSynthesisUtterance(inputText);
      utterance.lang = sourceLanguage === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const clearAll = () => {
    setInputText('');
    setTranslationResult(null);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* ML Service Status */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              mlServiceStatus?.status === 'healthy' 
                ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                : 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
            }`}>
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                AI Translation Engine
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mlServiceStatus?.status === 'healthy' 
                  ? 'Advanced ML models active'
                  : 'Using fallback translation'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={mlServiceStatus?.status === 'healthy' ? 'success' : 'warning'}>
              {mlServiceStatus?.status === 'healthy' ? 'Enhanced' : 'Basic'}
            </Badge>
            {mlServiceStatus?.text_model?.loaded && (
              <Badge variant="primary">
                {mlServiceStatus.text_model.classes} Signs
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Translation Input */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Languages className="h-6 w-6" />
              <span>AI-Powered ISL Translation</span>
            </h2>
            
            <div className="flex items-center space-x-2">
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder={t('translation.input_placeholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="text-lg"
              rightIcon={
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className={isRecording ? 'text-error-500 animate-pulse' : ''}
                    aria-label="Voice input"
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSpeak}
                    disabled={!inputText}
                    aria-label="Speak text"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleTextTranslation}
                loading={isTranslating}
                disabled={!inputText.trim() || isRecording}
                className="flex-1 sm:flex-none"
                leftIcon={mlServiceStatus?.status === 'healthy' ? <Zap className="h-4 w-4" /> : <Languages className="h-4 w-4" />}
              >
                {isTranslating ? 'Translating...' : 'Translate with AI'}
              </Button>
              
              {translationResult && (
                <Button
                  variant="outline"
                  onClick={handlePlayAnimation}
                  disabled={isPlaying}
                  leftIcon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                >
                  {isPlaying ? 'Playing' : 'Play Signs'}
                </Button>
              )}
              
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
            </div>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center p-4 bg-error-50 dark:bg-error-900/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-error-500 rounded-full animate-pulse"></div>
                  <span className="text-error-700 dark:text-error-300 font-medium">
                    Recording... Speak now
                  </span>
                  <div className="w-3 h-3 bg-error-500 rounded-full animate-pulse"></div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      {/* Translation Results */}
      {translationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* 3D Avatar */}
          <Card padding="none">
            <EnhancedISLAvatar3D
              animationData={translationResult.animation}
              isPlaying={isPlaying}
              onAnimationComplete={handleAnimationComplete}
            />
          </Card>

          {/* Translation Details */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Translation Results
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={translationResult.source === 'ml' ? 'success' : 'warning'}>
                    {translationResult.enhanced ? 'AI Enhanced' : 'Basic'}
                  </Badge>
                  {translationResult.source === 'ml' && (
                    <Badge variant="primary">
                      ML Powered
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Original Text
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {translationResult.translation.original_text || inputText}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ISL Signs ({translationResult.translation.signs.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {translationResult.translation.signs.map((sign: string, index: number) => (
                      <Badge
                        key={index}
                        variant="primary"
                        className="text-sm"
                      >
                        {sign.replace('_', ' ')}
                        {translationResult.translation.confidence && (
                          <span className="ml-1 text-xs opacity-75">
                            {Math.round(translationResult.translation.confidence[index] * 100)}%
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {translationResult.animation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Animation Details
                    </label>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Duration: {translationResult.animation.total_duration.toFixed(1)}s</p>
                      <p>Frame Rate: {translationResult.animation.fps} FPS</p>
                      <p>Signs: {translationResult.animation.signs.length}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isTranslating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center p-8"
        >
          <div className="flex items-center space-x-3">
            <Loader className="h-6 w-6 animate-spin text-primary-600" />
            <span className="text-gray-600 dark:text-gray-400">
              {mlServiceStatus?.status === 'healthy' 
                ? 'AI is processing your request...'
                : 'Processing translation...'
              }
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};