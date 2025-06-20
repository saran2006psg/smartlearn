import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Users, 
  Target,
  PlayCircle,
  Calendar
} from 'lucide-react';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { LessonCard } from '../components/lessons/LessonCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/authStore';
import { Lesson } from '../types';

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Hand Gestures',
    description: 'Learn fundamental ISL hand positions and movements',
    category: 'alphabets',
    level: 'beginner',
    duration: 15,
    progress: 75,
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Numbers 1-10',
    description: 'Master number signs in Indian Sign Language',
    category: 'numbers',
    level: 'beginner',
    duration: 12,
    progress: 100,
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Science Vocabulary',
    description: 'Essential science terms and concepts in ISL',
    category: 'science',
    level: 'intermediate',
    duration: 25,
    progress: 0,
    isCompleted: false,
  },
];

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLessonStart = (lesson: Lesson) => {
    navigate(`/lessons/${lesson.id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Role-specific dashboard data
  const getDashboardData = () => {
    switch (user?.role) {
      case 'student':
        return {
          stats: [
            { title: t('dashboard.lessons_completed'), value: '12', icon: BookOpen, color: 'primary' as const, trend: { value: 20, isPositive: true } },
            { title: t('dashboard.hours_learned'), value: '48', icon: Clock, color: 'secondary' as const, trend: { value: 15, isPositive: true } },
            { title: t('dashboard.current_streak'), value: '7 days', icon: Award, color: 'success' as const },
            { title: 'Skill Level', value: 'Intermediate', icon: TrendingUp, color: 'warning' as const },
          ],
          showLessons: true,
          showProgress: true,
        };
      case 'teacher':
        return {
          stats: [
            { title: 'Active Students', value: '45', icon: Users, color: 'primary' as const, trend: { value: 12, isPositive: true } },
            { title: 'Lessons Created', value: '28', icon: BookOpen, color: 'secondary' as const },
            { title: 'Avg. Completion', value: '78%', icon: Target, color: 'success' as const, trend: { value: 5, isPositive: true } },
            { title: 'This Week', value: '15h', icon: Clock, color: 'warning' as const },
          ],
          showLessons: false,
          showProgress: false,
        };
      case 'parent':
        return {
          stats: [
            { title: "Child's Progress", value: '85%', icon: TrendingUp, color: 'primary' as const, trend: { value: 10, isPositive: true } },
            { title: 'Lessons This Week', value: '8', icon: BookOpen, color: 'secondary' as const },
            { title: 'Study Time', value: '12h', icon: Clock, color: 'success' as const },
            { title: 'Achievements', value: '5', icon: Award, color: 'warning' as const },
          ],
          showLessons: false,
          showProgress: true,
        };
      case 'hr':
        return {
          stats: [
            { title: 'Registered Users', value: '1,245', icon: Users, color: 'primary' as const, trend: { value: 18, isPositive: true } },
            { title: 'Course Completion', value: '67%', icon: Target, color: 'secondary' as const },
            { title: 'Active This Month', value: '892', icon: TrendingUp, color: 'success' as const, trend: { value: 8, isPositive: true } },
            { title: 'Avg. Engagement', value: '4.2h', icon: Clock, color: 'warning' as const },
          ],
          showLessons: false,
          showProgress: false,
        };
      default:
        return {
          stats: [],
          showLessons: false,
          showProgress: false,
        };
    }
  };

  const dashboardData = getDashboardData();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t('dashboard.welcome_message')}, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Ready to continue your ISL learning journey?
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <Badge variant="primary">{user?.role}</Badge>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.stats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              onClick={() => {
                if (stat.title.includes('Lessons')) navigate('/lessons');
                if (stat.title.includes('Progress')) navigate('/progress');
                if (stat.title.includes('Students')) navigate('/students');
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning / Recent Lessons */}
        {dashboardData.showLessons && (
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t('dashboard.continue_learning')}
                  </h2>
                  <Button variant="ghost" onClick={() => navigate('/lessons')}>
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {mockLessons.slice(0, 2).map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      onStart={handleLessonStart}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recent Activity / Announcements */}
        <motion.div variants={itemVariants} className={dashboardData.showLessons ? '' : 'lg:col-span-2'}>
          <Card>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('dashboard.recent_activity')}
              </h2>
              
              <div className="space-y-3">
                {[
                  { icon: PlayCircle, text: 'Completed "Basic Hand Gestures"', time: '2 hours ago', color: 'text-success-600' },
                  { icon: BookOpen, text: 'Started "Science Vocabulary"', time: '1 day ago', color: 'text-primary-600' },
                  { icon: Award, text: 'Earned "Quick Learner" badge', time: '3 days ago', color: 'text-warning-600' },
                  { icon: Calendar, text: 'Joined weekly practice session', time: '5 days ago', color: 'text-secondary-600' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className={dashboardData.showLessons ? '' : 'lg:col-span-1'}>
          <Card>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quick Actions
              </h2>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/translation')}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Translation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/writing')}
                >
                  <BookOpen className="h-4 w-4  mr-2" />
                  Practice Writing
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/progress')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};