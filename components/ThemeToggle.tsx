import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all hover:bg-gray-800/50 group"
        >
            {/* Icon Container */}
            <div className="relative w-10 h-6 bg-gray-700 rounded-full p-1 transition-colors group-hover:bg-gray-600">
                <motion.div
                    className="absolute top-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center"
                    animate={{
                        left: isDark ? '4px' : '20px'
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    {isDark ? (
                        <Moon className="w-3 h-3 text-white" />
                    ) : (
                        <Sun className="w-3 h-3 text-white" />
                    )}
                </motion.div>
            </div>

            {/* Label */}
            <div className="flex-1 text-left">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {isDark ? 'Mode Sombre' : 'Mode Clair'}
                </span>
            </div>
        </button>
    );
};

export default ThemeToggle;
