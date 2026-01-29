import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationButtonsProps {
    onBack?: () => void;
    onHome: () => void;
    showBackButton?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    onBack,
    onHome,
    showBackButton = true
}) => {
    return (
        <div className="flex gap-3 mb-6">
            {showBackButton && onBack && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all shadow-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                </motion.button>
            )}

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onHome}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-md font-medium"
            >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
            </motion.button>
        </div>
    );
};

export default NavigationButtons;
