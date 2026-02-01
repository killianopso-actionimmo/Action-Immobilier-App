import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="glass-card p-6 m-4">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Paramètres</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Dark Mode Toggle */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <div className="flex items-center gap-3">
                                        {theme === 'dark' ? (
                                            <Moon className="w-5 h-5 text-blue-400" />
                                        ) : (
                                            <Sun className="w-5 h-5 text-yellow-400" />
                                        )}
                                        <div>
                                            <p className="font-medium text-white">Mode Sombre</p>
                                            <p className="text-sm text-gray-400">
                                                {theme === 'dark' ? 'Activé' : 'Désactivé'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={toggleTheme}
                                        className={`relative w-14 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-600'
                                            }`}
                                    >
                                        <motion.div
                                            layout
                                            className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                            animate={{
                                                x: theme === 'dark' ? 28 : 0
                                            }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>

                                {/* Info */}
                                <p className="text-xs text-gray-500 text-center">
                                    Le mode sombre réduit la fatigue oculaire
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
