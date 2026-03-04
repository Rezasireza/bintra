import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gold-500 text-white hover:shadow-lg hover:bg-gold-600 focus:ring-gold-500 rounded-xl",
    secondary: "bg-cream-100 text-primary-DEFAULT hover:bg-cream-200 focus:ring-cream-200 border border-primary-DEFAULT/10 rounded-xl",
    outline: "bg-transparent border border-primary-DEFAULT/20 text-primary-DEFAULT hover:border-gold-500 hover:text-gold-500 rounded-xl",
    ghost: "bg-transparent text-primary-secondary hover:text-gold-500 hover:bg-cream-50 rounded-lg",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;