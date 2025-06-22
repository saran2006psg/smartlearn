import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PenTool, Eye, Save, Sparkles, Target, Users } from 'lucide-react';
import { EnhancedWritingPad } from '../components/writing/EnhancedWritingPad';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export const Writing = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: PenTool,
      title: 'Advanced Canvas',
      description: 'Multi-touch support with pressure sensitivity and smooth drawing',
      color: 'primary',
    },
    {
      icon: Eye,
      title: 'AI Recognition',
      description: 'State-of-the-art handwriting recognition with multi-language support',
      color: 'secondary',
    },
    {
      icon: Save,
      title: 'Smart Saving',
      description: 'Auto-save progress with cloud sync and export options',
      color: 'success',
    },
    {
      icon: Sparkles,
      title: 'Interactive Feedback',
      description: 'Real-time suggestions and writing improvement tips',
      color: 'warning',
    },
  ];

  const writingTips = [
    {
      category: 'Devanagari Script',
      tips: [
        'Start with basic strokes and curves',
        'Practice vowel marks (matras) separately',
        'Focus on consistent letter spacing',
        'Use proper pen pressure for clean lines'
      ]
    },
    {
      category: 'English Letters',
      tips: [
        'Maintain consistent letter height',
        'Practice connecting cursive letters',
        'Focus on proper letter formation',
        'Keep uniform slant and spacing'
      ]
    }
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
                <PenTool className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold">
                {t('writing.title')}
              </h1>
            </div>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Master the art of writing with our intelligent digital canvas featuring AI-powered recognition and real-time feedback
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Multi-touch Support
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                AI Recognition
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Cloud Sync
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Multi-language
              </Badge>
            </div>
          </motion.div>
        </div>
      </AnimatedBackground>

      {/* Features Grid */}
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

      {/* Enhanced Writing Pad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <EnhancedWritingPad />
      </motion.div>

      {/* Writing Tips and Tutorials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Writing Tips */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Writing Tips</span>
            </h2>
            
            <div className="space-y-6">
              {writingTips.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="space-y-3"
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                    <span>{section.category}</span>
                  </h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <motion.li
                        key={tipIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.2) + (tipIndex * 0.1) }}
                        className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="text-success-600 mt-1">•</span>
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Practice Challenges */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Practice Challenges</span>
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Daily Letter Practice',
                  description: 'Practice writing 5 letters perfectly',
                  difficulty: 'Beginner',
                  points: 50,
                  color: 'success'
                },
                {
                  title: 'Word Formation',
                  description: 'Write 10 common words clearly',
                  difficulty: 'Intermediate',
                  points: 100,
                  color: 'warning'
                },
                {
                  title: 'Sentence Writing',
                  description: 'Complete a full sentence in cursive',
                  difficulty: 'Advanced',
                  points: 200,
                  color: 'error'
                },
                {
                  title: 'Speed Challenge',
                  description: 'Write a paragraph in under 2 minutes',
                  difficulty: 'Expert',
                  points: 300,
                  color: 'primary'
                }
              ].map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {challenge.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant={challenge.color} 
                          size="sm"
                        >
                          {challenge.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {challenge.points} points
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                      🎯
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Tracking */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Writing Progress
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Practice Sessions', value: '23', unit: 'sessions' },
              { label: 'Recognition Accuracy', value: '94', unit: '%' },
              { label: 'Words Written', value: '1,247', unit: 'words' },
              { label: 'Improvement Rate', value: '+15', unit: '%' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {stat.unit}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};