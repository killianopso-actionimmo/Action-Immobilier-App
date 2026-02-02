import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    className = ''
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 shadow-lg shadow-blue-500/50',
        secondary: 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:border-gray-600',
        ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`
                ${variants[variant]} 
                ${sizes[size]} 
                rounded-lg font-medium
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

export default Button;
