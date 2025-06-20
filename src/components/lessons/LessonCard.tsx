import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Lesson } from '../../types';

interface LessonCardProps {
  lesson: Lesson;
  onStart: (lesson: Lesson) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStart }) => {
  const { t } = useTranslation();

  const categoryColors = {
    math: 'primary',
    science: 'secondary',
    alphabets: 'success',
    numbers: 'warning',
    sentences: 'error',
  } as const;

  const levelColors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  } as const;

  return (
    <Card hoverable className="group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {lesson.description}
            </p>
          </div>
          
          {lesson.isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-success-600"
            >
              <CheckCircle className="h-6 w-6" />
            </motion.div>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-2">
          <Badge variant={categoryColors[lesson.category]}>
            {t(`lessons.categories.${lesson.category}`)}
          </Badge>
          <Badge variant={levelColors[lesson.level]} size="sm">
            {t(`lessons.levels.${lesson.level}`)}
          </Badge>
        </div>

        {/* Progress */}
        {lesson.progress > 0 && !lesson.isCompleted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {lesson.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lesson.progress}%` }}
                className="bg-primary-600 h-2 rounded-full"
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{lesson.duration} min</span>
            </div>
            {lesson.isCompleted && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-warning-500" />
                <span>4.8</span>
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => onStart(lesson)}
            leftIcon={lesson.isCompleted ? <CheckCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            variant={lesson.isCompleted ? 'outline' : 'primary'}
          >
            {lesson.isCompleted 
              ? t('lessons.completed')
              : lesson.progress > 0 
                ? t('lessons.resume')
                : t('lessons.start_lesson')
            }
          </Button>
        </div>
      </div>
    </Card>
  );
};