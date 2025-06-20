import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Languages, Zap, Users, Globe } from 'lucide-react';
import { TranslationTool } from '../components/translation/TranslationTool';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const Translation: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: 'Real-time Translation',
      description: 'Instant text to ISL conversion with 3D avatar demonstrations',
      color: 'primary' as const,
    },
    {
      icon: Users,
      title: 'Multi-user Support',
      description: 'Share translations with teachers, parents, and peers',
      color: 'secondary' as const,
    },
    {
      icon: Globe,
      title: 'Multi-language Input',
      description: 'Support for Hindi, English, and regional Indian languages',
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
              <Languages className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('translation.title')}
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Convert text and speech into Indian Sign Language with our advanced AI-powered translation tool
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="primary">AI Powered</Badge>
            <Badge variant="secondary">Real-time</Badge>
            <Badge variant="success">Multi-language</Badge>
            <Badge variant="warning">3D Avatar</Badge>
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

      {/* Translation Tool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TranslationTool />
      </motion.div>

      {/* Tips */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Translation Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">For Best Results:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Use clear, simple sentences</li>
                <li>• Avoid complex grammatical structures</li>
                <li>• Include context when possible</li>
                <li>• Check the 3D avatar demonstration</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Supported Languages:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Hindi (हिंदी)</li>
                <li>• English</li>
                <li>• Gujarati (ગુજરાતી)</li>
                <li>• Tamil (தமிழ்)</li>
                <li>• And more regional languages</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};