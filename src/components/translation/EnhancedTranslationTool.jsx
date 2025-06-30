import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Languages, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Heart, 
  Share2, 
  Settings,
  History,
  Star,
  FileText,
  User
} from 'lucide-react';
import apiService from '../../services/api';
import { useTranslation } from 'react-i18next';

const EnhancedTranslationTool = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('isl');
  const [avatarType, setAvatarType] = useState('default');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [avatarTypes, setAvatarTypes] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'isl', name: 'Indian Sign Language', flag: '🤟' }
  ];

  useEffect(() => {
    loadAvatarTypes();
    loadHistory();
  }, []);

  const loadAvatarTypes = async () => {
    try {
      const response = await apiService.getAvatarTypes();
      setAvatarTypes(response.avatarTypes);
    } catch (error) {
      console.error('Failed to load avatar types:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await apiService.getTranslationHistory(10);
      setHistory(response.translations);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      const response = await apiService.translateText(
        text,
        sourceLanguage,
        targetLanguage,
        avatarType
      );
      
      setTranslation(response.translation);
      setAvatarUrl(response.avatarUrl);
      loadHistory(); // Refresh history
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleFavorite = async (translationId, isFavorite) => {
    try {
      await apiService.toggleTranslationFavorite(translationId, !isFavorite);
      loadHistory(); // Refresh history
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && translation) {
      try {
        await navigator.share({
          title: 'SmartLearn Translation',
          text: `${text} → ${JSON.parse(translation.translated_content).translated}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiService.exportTranslations('csv');
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translations.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getLanguageName = (code) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Languages className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">SmartLearn Translator</h1>
                <p className="text-blue-100">Translate with AI-powered avatars</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title="Translation History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Language
                </label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.filter(lang => lang.code !== 'isl').map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Language
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Avatar Selection */}
            {targetLanguage === 'isl' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {avatarTypes.map(avatar => (
                    <button
                      key={avatar.id}
                      onClick={() => setAvatarType(avatar.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        avatarType === avatar.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{avatar.name}</div>
                          <div className="text-xs text-gray-500">{avatar.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={!text.trim() || isTranslating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isTranslating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5" />
                  <span>Translate</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {translation ? (
              <>
                {/* Translation Result */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Translation</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleFavorite(translation.id, false)}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Add to Favorites"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-lg text-gray-800 mb-2">
                    {JSON.parse(translation.translated_content).translated}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getLanguageFlag(sourceLanguage)} {getLanguageName(sourceLanguage)} → {getLanguageFlag(targetLanguage)} {getLanguageName(targetLanguage)}
                  </div>
                </div>

                {/* Avatar Video */}
                {avatarUrl && (
                  <div className="bg-black rounded-lg overflow-hidden">
                    <div className="relative">
                      <video
                        src={avatarUrl}
                        className="w-full h-64 object-cover"
                        controls
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors">
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Languages className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Ready to Translate
                </h3>
                <p className="text-gray-500">
                  Enter your text and click translate to see the result with avatar
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Translations</h3>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <FileText className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {history.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.original_text}</div>
                    <div className="text-sm text-gray-500">
                      {JSON.parse(item.translated_content).translated}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFavorite(item.id, false)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setText(item.original_text);
                        setSourceLanguage(item.source_language);
                        setTargetLanguage(item.target_language);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-500"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EnhancedTranslationTool;