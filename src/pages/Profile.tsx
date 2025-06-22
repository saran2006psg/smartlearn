import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  BookOpen, 
  Settings, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Globe,
  Sun,
  Moon,
  Contrast,
  Type,
  Volume2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useLanguageStore } from '../stores/languageStore';
import { Language } from '../types';

const languages = [
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

const fontSizes = [
  { value: 'small', label: 'Small', size: 'text-sm' },
  { value: 'medium', label: 'Medium', size: 'text-base' },
  { value: 'large', label: 'Large', size: 'text-lg' },
];

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'high-contrast': return <Contrast className="h-5 w-5" />;
    }
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('profile.title', 'Profile & Settings')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('profile.subtitle', 'Manage your account and preferences')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {t('profile.personalInfo', 'Personal Information')}
                  </h2>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      leftIcon={<Edit3 className="h-4 w-4" />}
                    >
                      {t('common.edit', 'Edit')}
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={user?.profileImage || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={user?.name}
                        className="h-20 w-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                      <button className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-1 rounded-full hover:bg-primary-700 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user?.email}
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('profile.name', 'Name')}
                        </label>
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder={t('profile.namePlaceholder', 'Enter your name')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('profile.email', 'Email')}
                        </label>
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          placeholder={t('profile.emailPlaceholder', 'Enter your email')}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleSave}
                          leftIcon={<Save className="h-4 w-4" />}
                        >
                          {t('common.save', 'Save')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          leftIcon={<X className="h-4 w-4" />}
                        >
                          {t('common.cancel', 'Cancel')}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              {/* Preferences */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  {t('profile.preferences', 'Preferences')}
                </h3>
                
                <div className="space-y-4">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {t('profile.language', 'Language')}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      {getThemeIcon()}
                      <span className="ml-1">{t('profile.theme', 'Theme')}</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['light', 'dark', 'high-contrast'] as const).map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => setTheme(themeOption)}
                          className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                            theme === themeOption
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {themeOption === 'light' && <Sun className="h-4 w-4 mx-auto mb-1" />}
                          {themeOption === 'dark' && <Moon className="h-4 w-4 mx-auto mb-1" />}
                          {themeOption === 'high-contrast' && <Contrast className="h-4 w-4 mx-auto mb-1" />}
                          {t(`profile.themes.${themeOption}`, themeOption)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Type className="h-4 w-4 mr-1" />
                      {t('profile.fontSize', 'Font Size')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizes.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => updateUser({ preferences: { ...user?.preferences, fontSize: size.value as any } })}
                          className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                            user?.preferences.fontSize === size.value
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Statistics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {t('profile.statistics', 'Statistics')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('profile.lessonsCompleted', 'Lessons Completed')}
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('profile.totalProgress', 'Total Progress')}
                    </span>
                    <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('profile.streak', 'Current Streak')}
                    </span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">7 days</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 