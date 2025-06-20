import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, Target, Calendar, BookOpen, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DashboardCard } from '../components/dashboard/DashboardCard';

const progressData = [
  { month: 'Jan', lessons: 5, hours: 12 },
  { month: 'Feb', lessons: 8, hours: 18 },
  { month: 'Mar', lessons: 12, hours: 25 },
  { month: 'Apr', lessons: 15, hours: 32 },
  { month: 'May', lessons: 18, hours: 38 },
  { month: 'Jun', lessons: 22, hours: 45 },
];

const categoryData = [
  { name: 'Alphabets', value: 35, color: '#4F46E5' },
  { name: 'Numbers', value: 25, color: '#06B6D4' },
  { name: 'Math', value: 20, color: '#22C55E' },
  { name: 'Science', value: 15, color: '#F59E0B' },
  { name: 'Sentences', value: 5, color: '#EF4444' },
];

const achievements = [
  { id: 1, title: 'First Steps', description: 'Completed your first lesson', icon: '🎯', earned: true, date: '2024-01-15' },
  { id: 2, title: 'Quick Learner', description: 'Completed 5 lessons in a week', icon: '⚡', earned: true, date: '2024-02-01' },
  { id: 3, title: 'Alphabet Master', description: 'Mastered all ISL alphabets', icon: '🔤', earned: true, date: '2024-02-15' },
  { id: 4, title: 'Number Ninja', description: 'Completed all number lessons', icon: '🔢', earned: true, date: '2024-03-01' },
  { id: 5, title: 'Streak Champion', description: 'Maintained 30-day learning streak', icon: '🔥', earned: false, date: null },
  { id: 6, title: 'Science Scholar', description: 'Completed advanced science vocabulary', icon: '🧪', earned: false, date: null },
];

export const Progress: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { title: t('dashboard.lessons_completed'), value: '22', icon: BookOpen, color: 'primary' as const, trend: { value: 15, isPositive: true } },
    { title: t('dashboard.hours_learned'), value: '45', icon: Clock, color: 'secondary' as const, trend: { value: 12, isPositive: true } },
    { title: 'Current Level', value: 'Intermediate', icon: TrendingUp, color: 'success' as const },
    { title: 'Achievements', value: '4/6', icon: Award, color: 'warning' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <span>{t('navigation.progress')}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your ISL learning journey and achievements
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">78%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress Chart */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Learning Progress
            </h2>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lessons" 
                    stroke="#4F46E5" 
                    strokeWidth={3}
                    dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#06B6D4" 
                    strokeWidth={3}
                    dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Hours Studied</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Learning Categories
            </h2>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Achievements</span>
            </h2>
            <Badge variant="primary">4 of 6 earned</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.earned
                    ? 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
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
                  {achievement.earned && (
                    <div className="text-success-600 dark:text-success-400">
                      <Award className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};