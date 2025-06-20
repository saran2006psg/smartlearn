import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  onClick,
}) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30',
    secondary: 'text-secondary-600 bg-secondary-100 dark:bg-secondary-900/30',
    success: 'text-success-600 bg-success-100 dark:bg-success-900/30',
    warning: 'text-warning-600 bg-warning-100 dark:bg-warning-900/30',
    error: 'text-error-600 bg-error-100 dark:bg-error-900/30',
  };

  return (
    <Card hoverable={!!onClick} onClick={onClick} className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-3 rounded-xl ${colorClasses[color]}`}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      </div>
      
      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 ${colorClasses[color]} rounded-full -translate-y-10 translate-x-10`} />
    </Card>
  );
};