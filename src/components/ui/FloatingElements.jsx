import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Star, Heart, Zap, Award } from 'lucide-react';

export const FloatingElements = () => {
  const icons = [BookOpen, Lightbulb, Star, Heart, Zap, Award];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-primary-200 dark:text-primary-800 opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Icon size={24 + Math.random() * 16} />
        </motion.div>
      ))}
    </div>
  );
};