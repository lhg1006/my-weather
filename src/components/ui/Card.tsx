import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
  onClick?: () => void;
  animated?: boolean;
}

export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  animated = true 
}: CardProps) => {
  const baseClasses = 'p-4 transition-all duration-200';
  
  const variantClasses = {
    default: 'ios-card',
    glass: 'glass-card',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const cardContent = (
    <div 
      className={classes}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={onClick ? { scale: 1.02 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};