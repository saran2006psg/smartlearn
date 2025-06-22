import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = ({ children, variant = 'default' }) => {
  const variants = {
    default: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    primary: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
    },
    success: {
      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    },
    warning: {
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={variants[variant]}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};