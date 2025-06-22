import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Languages, Zap, Users, Globe, Brain, Video, Mic } from 'lucide-react';
import { EnhancedTranslationTool } from '../components/translation/EnhancedTranslationTool';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export const Translation = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Translation',
      description: 'Advanced neural networks for accurate text-to-ISL conversion',
      color: 'primary',
    },
    {
      icon: Video,
      title: '3D Avatar Demonstration',
      description: 'Realistic 3D avatars showing precise ISL gestures and movements',
      color: 'secondary',
    },
    {
      icon: Mic,
      title: 'Voice Recognition',
      description: 'Speak naturally and get instant ISL translations',
      color: 'success',
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Share translations with teachers, parents, and peers',
      color: 'warning',
    },
  ];

  const supportedLanguages = [
    { name: 'Hindi', native: 'हिंदी', speakers: '600M+', flag: '🇮🇳' },
    { name: 'English', native: 'English', speakers: '1.5B+', flag: '🇺🇸' },
    { name: 'Gujarati', native: 'ગુજરાતી', speakers: '56M+', flag: '🇮🇳' },
    { name: 'Tamil', native: 'தமிழ்', speakers: '75M+', flag: '🇮🇳' },
    { name: 'Kannada', native: 'ಕನ್ನಡ', speakers: '44M+', flag: '🇮🇳' },
    { name: 'Bengali', native: 'বাংলা', speakers: '230M+', flag: '🇮🇳' },
  ];

  const translationStats = [
    { label: 'Languages Supported', value: '7+', icon: Globe },
    { label: 'Translation Accuracy', value: '96%', icon: Zap },
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Translations Daily', value: '50K+', icon: Languages },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedBackground variant="primary">
        <div className="p-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Languages className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold">
                {t('translation.title')}
              </h1>
            </div>
            
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Bridge communication gaps with our advanced AI-powered translation system that converts text and speech into Indian Sign Language with stunning 3D avatar demonstrations
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                AI Powered
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Real-time
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                3D Avatar
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Voice Input
              </Badge>
            </div>
          </motion.div>
        </div>
      </AnimatedBackground>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {translationStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <div className="space-y-2">
                <stat.icon className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hoverable className="text-center h-full">
              <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-xl ${
                  feature.color === 'primary' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' :
                  feature.color === 'secondary' ? 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400' :
                  feature.color === 'success' ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400' :
                  'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                }`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Translation Tool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <EnhancedTranslationTool />
      </motion.div>

      {/* Supported Languages */}
      <Card>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Supported Languages</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedLanguages.map((language, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-2xl">{language.flag}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {language.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language.native}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {language.speakers} speakers
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <Card>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            How Translation Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Input Text or Speech',
                description: 'Type your message or use voice input in any supported language',
                icon: '📝'
              },
              {
                step: '2',
                title: 'AI Processing',
                description: 'Our neural network analyzes and converts your input to ISL structure',
                icon: '🧠'
              },
              {
                step: '3',
                title: '3D Avatar Display',
                description: 'Watch the realistic 3D avatar demonstrate the signs with perfect accuracy',
                icon: '🤖'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center space-y-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};