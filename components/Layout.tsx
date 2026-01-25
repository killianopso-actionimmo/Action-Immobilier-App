import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { AnalysisMode } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    currentMode: AnalysisMode;
    onModeChange: (mode: AnalysisMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentMode, onModeChange }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">
            <Sidebar currentMode={currentMode} onModeChange={onModeChange} />

            {/* Main Content Area with Smooth Transitions */}
            <main className="ml-64 min-h-screen transition-all duration-300">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMode}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1] // Custom easing for premium feel
                        }}
                        className="max-w-7xl mx-auto p-8"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
