import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Filter, BookOpen, Play, CheckCircle } from 'lucide-react';
import { LessonCard } from '../components/lessons/LessonCard';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Lesson } from '../types';

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'ISL Alphabet A-Z',
    description: 'Master all 26 letters of the alphabet in Indian Sign Language with clear demonstrations and practice exercises.',
    category: 'alphabets',
    level: 'beginner',
    duration: 20,
    progress: 100,
    isCompleted: true,
  },
  {
    id: '2',
    title: 'Numbers 1-100',
    description: 'Learn to sign numbers from 1 to 100, including special number combinations and mathematical expressions.',
    category: 'numbers',
    level: 'beginner',
    duration: 25,
    progress: 75,
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Basic Math Operations',
    description: 'Addition, subtraction, multiplication, and division signs with practical problem-solving examples.',
    category: 'math',
    level: 'intermediate',
    duration: 30,
    progress: 0,
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Science Laboratory Terms',
    description: 'Essential vocabulary for science experiments, equipment names, and laboratory procedures.',
    category: 'science',
    level: 'intermediate',
    duration: 35,
    progress: 50,
    isCompleted: false,
  },
  {
    id: '5',
    title: 'Daily Conversation Sentences',
    description: 'Common phrases and sentences used in everyday conversations, greetings, and social interactions.',
    category: 'sentences',
    level: 'beginner',
    duration: 40,
    progress: 25,
    isCompleted: false,
  },
  {
    id: '6',
    title: 'Advanced Grammar Structures',
    description: 'Complex sentence formations, tenses, and grammatical rules specific to Indian Sign Language.',
    category: 'sentences',
    level: 'advanced',
    duration: 45,
    progress: 0,
    isCompleted: false,
  },
];

export const Lessons: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'alphabets', label: t('lessons.categories.alphabets') },
    { key: 'numbers', label: t('lessons.categories.numbers') },
    { key: 'math', label: t('lessons.categories.math') },
    { key: 'science', label: t('lessons.categories.science') },
    { key: 'sentences', label: t('lessons.categories.sentences') },
  ];

  const levels = [
    { key: 'all', label: 'All Levels' },
    { key: 'beginner', label: t('lessons.levels.beginner') },
    { key: 'intermediate', label: t('lessons.levels.intermediate') },
    { key: 'advanced', label: t('lessons.levels.advanced') },
  ];

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
    const matchesCompletion = showCompleted || !lesson.isCompleted;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesCompletion;
  });

  const handleLessonStart = (lesson: Lesson) => {
    console.log('Starting lesson:', lesson.id);
    // Navigate to lesson detail page
  };

  const getProgressStats = () => {
    const total = mockLessons.length;
    const completed = mockLessons.filter(l => l.isCompleted).length;
    const inProgress = mockLessons.filter(l => l.progress > 0 && !l.isCompleted).length;
    
    return { total, completed, inProgress };
  };

  const stats = getProgressStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span>ISL Lessons</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Interactive lessons to master Indian Sign Language
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{stats.completed}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning-600">{stats.inProgress}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Level Filter */}
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <Button
                  key={level.key}
                  variant={selectedLevel === level.key ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedLevel(level.key)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
            
            {/* Show Completed Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showCompleted"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="showCompleted" className="text-sm text-gray-700 dark:text-gray-300">
                Show completed lessons
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LessonCard lesson={lesson} onStart={handleLessonStart} />
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredLessons.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No lessons found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setShowCompleted(true);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};