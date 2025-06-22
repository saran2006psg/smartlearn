import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Languages,
  PenTool,
  BarChart3,
  Users,
  FileText,
  Award
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';

const navigationItems = [
  { 
    key: 'dashboard', 
    icon: LayoutDashboard, 
    path: '/dashboard',
    roles: ['student', 'teacher', 'parent', 'hr']
  },
  { 
    key: 'lessons', 
    icon: BookOpen, 
    path: '/lessons',
    roles: ['student', 'teacher']
  },
  { 
    key: 'progress', 
    icon: TrendingUp, 
    path: '/progress',
    roles: ['student', 'parent', 'teacher']
  },
  { 
    key: 'translation', 
    icon: Languages, 
    path: '/translation',
    roles: ['student', 'teacher', 'parent', 'hr']
  },
  { 
    key: 'writing', 
    icon: PenTool, 
    path: '/writing',
    roles: ['student', 'teacher']
  },
  { 
    key: 'analytics', 
    icon: BarChart3, 
    path: '/analytics',
    roles: ['teacher', 'hr']
  },
  { 
    key: 'students', 
    icon: Users, 
    path: '/students',
    roles: ['teacher', 'parent']
  },
  { 
    key: 'reports', 
    icon: FileText, 
    path: '/reports',
    roles: ['teacher', 'hr', 'parent']
  },
];

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuthStore();
  const { isRTL } = useLanguageStore();

  const filteredItems = navigationItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <aside className={`fixed top-16 ${isRTL ? 'right-0' : 'left-0'} z-30 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 -translate-x-full`}>
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-2 flex-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={() =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {({ isActive: active }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${isRTL ? 'ml-3' : 'mr-3'}`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                    </motion.div>
                    <span className="truncate">
                      {t(`navigation.${item.key}`)}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute ${isRTL ? 'left-0' : 'right-0'} w-1 h-8 bg-primary-600 rounded-l`}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Role Badge */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex-shrink-0">
              <Award className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                {user?.role}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};