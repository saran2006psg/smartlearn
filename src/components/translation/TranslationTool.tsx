import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, RotateCcw, Copy, Save, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { ISLVideoPlayer } from '../lessons/ISLVideoPlayer';

export const TranslationTool: React.FC = () => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState<Array<{ text: string; timestamp: Date }>>([]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTranslatedText(`ISL translation for: "${inputText}"`);
    setHistory(prev => [...prev, { text: inputText, timestamp: new Date() }]);
    setIsTranslating(false);
  };

  const handleSpeechToText = () => {
    setIsListening(true);
    
    // Simulate speech recognition
    setTimeout(() => {
      setInputText('Hello, how are you today?');
      setIsListening(false);
    }, 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && inputText) {
      const utterance = new SpeechSynthesisUtterance(inputText);
      speechSynthesis.speak(utterance);
    }
  };

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText);
  };

  return (
    <div className="space-y-6">
      {/* Translation Input */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('translation.title')}
          </h2>
          
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
                    onClick={handleSpeechToText}
                    className={isListening ? 'text-error-500 animate-pulse' : ''}
                    aria-label="Voice input"
                  >
                    <Mic className="h-4 w-4" />
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
                onClick={handleTranslate}
                loading={isTranslating}
                disabled={!inputText.trim()}
                className="flex-1 sm:flex-none"
              >
                {t('translation.translate')}
              </Button>
              
              <Button variant="outline" onClick={copyToClipboard} disabled={!inputText}>
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ISL Video Output */}
      {translatedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* 3D Avatar */}
          <Card>
            <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary-200 dark:bg-primary-800 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary-400 dark:bg-primary-600 rounded-full animate-bounce-gentle"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">3D ISL Avatar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signing: "{inputText}"</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Video Player */}
          <ISLVideoPlayer
            title="ISL Video Translation"
            description={translatedText}
          />
        </motion.div>
      )}

      {/* Translation History */}
      {history.length > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>{t('translation.history')}</span>
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setHistory([])}>
                {t('translation.clear')}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.slice(-5).reverse().map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                    {item.text}
                  </span>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputText(item.text)}
                      className="p-1"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};