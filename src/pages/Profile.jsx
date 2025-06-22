import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Volume2,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useLanguageStore } from '../stores/languageStore';

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

const achievements = [
  { id: 1, title: 'First Steps', icon: '🎯', earned: true, date: '2024-01-15', description: 'Completed your first lesson' },
  { id: 2, title: 'Quick Learner', icon: '⚡', earned: true, date: '2024-02-01', description: 'Completed 5 lessons in a week' },
  { id: 3, title: 'Alphabet Master', icon: '🔤', earned: true, date: '2024-02-15', description: 'Mastered all ISL alphabets' },
  { id: 4, title: 'Number Ninja', icon: '🔢', earned: true, date: '2024-03-01', description: 'Completed all number lessons' },
  { id: 5, title: 'Streak Champion', icon: '🔥', earned: false, description: 'Maintain 30-day learning streak' },
  { id: 6, title: 'Science Scholar', icon: '🧪', earned: false, description: 'Complete advanced science vocabulary' },
];

export const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [activeTab, setActiveTab] = useState('profile');

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'statistics', label: 'Statistics', icon: TrendingUp },
  ];

  const stats = [
    { label: 'Lessons Completed', value: '24', icon: BookOpen, color: 'primary' },
    { label: 'Total Progress', value: '78%', icon: Target, color: 'success' },
    { label: 'Current Streak', value: '7 days', icon: Calendar, color: 'warning' },
    { label: 'Average Score', value: '92%', icon: Star, color: 'secondary' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <AnimatedBackground variant="primary">
            <div className="p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative inline-block"
              >
                <img
                  src={user?.profileImage || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user?.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                />
                <button className="absolute -bottom-1 -right-1 bg-white text-primary-600 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-white/80 mt-1">{user?.email}</p>
                <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                  {user?.role}
                </Badge>
              </motion.div>
            </div>
          </AnimatedBackground>

          {/* Navigation Tabs */}
          <Card>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Personal Information */}
                <Card>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </h2>
                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          leftIcon={<Edit3 className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          <Input
                            label="Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            placeholder="Enter your name"
                          />
                          <Input
                            label="Email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            placeholder="Enter your email"
                          />
                          <div className="flex space-x-3">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleSave}
                              leftIcon={<Save className="h-4 w-4" />}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancel}
                              leftIcon={<X className="h-4 w-4" />}
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                            <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">{user?.role}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</label>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">January 2024</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Quick Stats
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <stat.icon className={`h-8 w-8 mx-auto mb-2 ${
                            stat.color === 'primary' ? 'text-primary-600' :
                            stat.color === 'success' ? 'text-success-600' :
                            stat.color === 'warning' ? 'text-warning-600' :
                            'text-secondary-600'
                          }`} />
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Card>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Preferences
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Language Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          Language
                        </h3>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Theme Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                          {getThemeIcon()}
                          <span className="ml-2">Theme</span>
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {(['light', 'dark', 'high-contrast']).map((themeOption) => (
                            <motion.button
                              key={themeOption}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setTheme(themeOption)}
                              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                                theme === themeOption
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {themeOption === 'light' && <Sun className="h-5 w-5 mx-auto mb-1" />}
                              {themeOption === 'dark' && <Moon className="h-5 w-5 mx-auto mb-1" />}
                              {themeOption === 'high-contrast' && <Contrast className="h-5 w-5 mx-auto mb-1" />}
                              <div className="capitalize">{themeOption.replace('-', ' ')}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Font Size Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                          <Type className="h-4 w-4 mr-2" />
                          Font Size
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {fontSizes.map((size) => (
                            <motion.button
                              key={size.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => updateUser({ preferences: { ...user?.preferences, fontSize: size.value } })}
                              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                                user?.preferences?.fontSize === size.value
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <Type className={`h-4 w-4 mx-auto mb-1 ${size.size}`} />
                              {size.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Accessibility Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                          <Volume2 className="h-4 w-4 mr-2" />
                          Accessibility
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              defaultChecked
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Enable sound effects
                            </span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              defaultChecked
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Show animations
                            </span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Reduce motion
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Achievements
                      </h2>
                      <Badge variant="primary">
                        {achievements.filter(a => a.earned).length} of {achievements.length} earned
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                            achievement.earned
                              ? 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/20'
                              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                          }`}
                        >
                          <div className="text-center space-y-3">
                            <div className={`text-4xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${
                                achievement.earned 
                                  ? 'text-success-800 dark:text-success-200' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {achievement.title}
                              </h3>
                              <p className={`text-sm mt-1 ${
                                achievement.earned 
                                  ? 'text-success-600 dark:text-success-300' 
                                  : 'text-gray-500 dark:text-gray-500'
                              }`}>
                                {achievement.description}
                              </p>
                              {achievement.earned && achievement.date && (
                                <p className="text-xs text-success-500 dark:text-success-400 mt-2">
                                  Earned on {new Date(achievement.date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'statistics' && (
              <motion.div
                key="statistics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Card>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Detailed Statistics
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Study Time', value: '48 hours', change: '+12%', positive: true },
                        { label: 'Lessons Completed', value: '24', change: '+8', positive: true },
                        { label: 'Average Score', value: '92%', change: '+5%', positive: true },
                        { label: 'Streak Record', value: '15 days', change: 'Current: 7', positive: false },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {stat.value}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {stat.label}
                          </p>
                          <p className={`text-xs font-medium ${
                            stat.positive ? 'text-success-600' : 'text-gray-500'
                          }`}>
                            {stat.change}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Learning Progress Chart Placeholder */}
                    <div className="mt-8 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Learning Progress Chart
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Detailed analytics and progress tracking coming soon
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};