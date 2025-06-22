import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Volume2, 
  RotateCcw, 
  Copy, 
  History, 
  Play, 
  Pause,
  Download,
  Share,
  BookOpen
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { LoadingSpinner, PulseLoader } from '../ui/LoadingSpinner';
import { ISLAvatar3D } from '../avatar/ISLAvatar3D';

export const EnhancedTranslationTool = () => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [translationSpeed, setTranslationSpeed] = useState('normal');

  const languages = [
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  ];

  const speeds = [
    { value: 'slow', label: 'Slow', icon: '🐌' },
    { value: 'normal', label: 'Normal', icon: '🚶' },
    { value: 'fast', label: 'Fast', icon: '🏃' },
  ];

  const commonPhrases = [
    { text: 'नमस्ते', translation: 'Hello/Namaste' },
    { text: 'धन्यवाद', translation: 'Thank you' },
    { text: 'मेरा नाम है', translation: 'My name is' },
    { text: 'आप कैसे हैं?', translation: 'How are you?' },
    { text: 'मुझे समझ नहीं आया', translation: 'I don\'t understand' },
    { text: 'कृपया मदद करें', translation: 'Please help' },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTranslatedText(`ISL translation for: "${inputText}"`);
    setHistory(prev => [...prev, { 
      text: inputText, 
      translation: `ISL translation for: "${inputText}"`,
      timestamp: new Date(),
      language: selectedLanguage 
    }]);
    setIsTranslating(false);
  };

  const handleSpeechToText = () => {
    setIsListening(true);
    
    // Simulate speech recognition
    setTimeout(() => {
      const phrases = [
        'नमस्ते, आप कैसे हैं?',
        'मुझे ISL सीखना है',
        'यह बहुत अच्छा है',
        'धन्यवाद आपका'
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setInputText(randomPhrase);
      setIsListening(false);
    }, 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && inputText) {
      const utterance = new SpeechSynthesisUtterance(inputText);
      utterance.lang = selectedLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  const playTranslation = () => {
    setIsPlaying(true);
    // Simulate playing ISL animation
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText);
  };

  const shareTranslation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ISL Translation',
        text: `Original: ${inputText}\nTranslation: ${translatedText}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Translation Interface */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('translation.title')}
            </h2>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
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
          
          {/* Input Section */}
          <div className="space-y-4">
            <Input
              placeholder={t('translation.input_placeholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="text-lg min-h-[60px]"
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
            
            {/* Quick Phrases */}
            <div className="space-y-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Quick phrases:</span>
              <div className="flex flex-wrap gap-2">
                {commonPhrases.map((phrase, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInputText(phrase.text)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title={phrase.translation}
                  >
                    {phrase.text}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleTranslate}
                  loading={isTranslating}
                  disabled={!inputText.trim()}
                  className="flex-1 sm:flex-none"
                >
                  {isTranslating ? 'Translating...' : t('translation.translate')}
                </Button>
                
                {/* Speed Control */}
                <div className="flex items-center space-x-1">
                  {speeds.map((speed) => (
                    <motion.button
                      key={speed.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTranslationSpeed(speed.value)}
                      className={`px-2 py-1 rounded text-sm ${
                        translationSpeed === speed.value
                          ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      title={speed.label}
                    >
                      {speed.icon}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={copyToClipboard} disabled={!inputText} size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={clearAll} size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Translation Output */}
      <AnimatePresence>
        {(translatedText || isTranslating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* 3D Avatar Display */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    3D ISL Avatar
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={playTranslation}
                      disabled={isPlaying || isTranslating}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? 'Playing' : 'Play'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareTranslation}>
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {isTranslating ? (
                  <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center space-y-4">
                      <LoadingSpinner size="lg" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Generating ISL translation...
                      </p>
                    </div>
                  </div>
                ) : (
                  <ISLAvatar3D 
                    text={inputText} 
                    isAnimating={isPlaying}
                  />
                )}
              </div>
            </Card>

            {/* Translation Details */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Translation Details
                </h3>
                
                {isTranslating ? (
                  <div className="space-y-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PulseLoader />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Processing translation...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <p className="text-primary-800 dark:text-primary-200 font-medium">
                        {translatedText}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Source:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {languages.find(l => l.code === selectedLanguage)?.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Target:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Indian Sign Language
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Speed:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {translationSpeed}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          ~{Math.ceil(inputText.length / 10)}s
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => navigator.clipboard.writeText(translatedText)}>
                        Copy Translation
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {history.slice(-10).reverse().map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setInputText(item.text)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.translation}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-gray-400">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(item.text);
                        }}
                        className="p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Learning Resources */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>ISL Learning Resources</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Basic Gestures', description: 'Learn fundamental hand movements', level: 'Beginner' },
              { title: 'Common Phrases', description: 'Everyday conversation starters', level: 'Intermediate' },
              { title: 'Advanced Grammar', description: 'Complex sentence structures', level: 'Advanced' },
            ].map((resource, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer"
              >
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {resource.description}
                </p>
                <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                  {resource.level}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};