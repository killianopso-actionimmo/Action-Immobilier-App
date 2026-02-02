import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'primary' | 'secondary';
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    onClick
}) => {
    const variants = {
        default: 'border-gray-700 hover:border-gray-600',
        primary: 'border-blue-500/50 hover:border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]',
        secondary: 'border-violet-500/50 hover:border-violet-400 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
    };

    const Component = onClick ? motion.div : 'div';
    const motionProps = onClick ? {
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
    } : {};

    return (
        <Component
            className={`glass-card ${variants[variant]} transition-all duration-300 cursor-${onClick ? 'pointer' : 'default'} ${className}`}
            onClick={onClick}
            {...motionProps}
        >
            {children}
        </Component>
    );
};

export default Card;
