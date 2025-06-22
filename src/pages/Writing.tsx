import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PenTool, Eye, Save } from 'lucide-react';
import { WritingPad } from '../components/writing/WritingPad';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const Writing: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: PenTool,
      title: 'Digital Canvas',
      description: 'Practice writing with touch-friendly digital canvas',
      color: 'primary' as const,
    },
    {
      icon: Eye,
      title: 'Text Recognition',
      description: 'AI-powered handwriting recognition and feedback',
      color: 'secondary' as const,
    },
    {
      icon: Save,
      title: 'Save Progress',
      description: 'Save and track your writing practice sessions',
      color: 'success' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-xl">
              <PenTool className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('writing.title')}
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice writing letters, words, and sentences with our interactive digital writing pad
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="primary">Touch Friendly</Badge>
            <Badge variant="secondary">AI Recognition</Badge>
            <Badge variant="success">Progress Tracking</Badge>
            <Badge variant="warning">Multi-language</Badge>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
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

      {/* Writing Pad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <WritingPad />
      </motion.div>

      {/* Instructions */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            How to Use the Writing Pad
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Getting Started:</h3>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                  <span>Choose your preferred brush color and size</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                  <span>Use your finger, stylus, or mouse to write on the canvas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                  <span>Click "Recognize Text" to see AI interpretation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                  <span>Save your work or clear to start over</span>
                </li>
              </ol>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Tips for Better Recognition:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-success-600 mt-1">•</span>
                  <span>Write clearly with consistent letter sizes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-success-600 mt-1">•</span>
                  <span>Leave space between words and letters</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-success-600 mt-1">•</span>
                  <span>Use a medium brush size for best results</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-success-600 mt-1">•</span>
                  <span>Practice regularly to improve your writing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};