import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { AnalysisMode } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    currentMode: AnalysisMode;
    onModeChange: (mode: AnalysisMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentMode, onModeChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-slate-900 text-lg">ACTION</span>
                    <span className="font-serif italic text-primary-600 text-lg">IMMO</span>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <Sidebar
                currentMode={currentMode}
                onModeChange={onModeChange}
                isOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
            />

            {/* Main Content Area with Responsive Margin + Bottom Nav Padding */}
            <main className="lg:ml-64 min-h-screen transition-all duration-300 pt-16 lg:pt-0 pb-32">
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
                        className="max-w-7xl mx-auto p-4 md:p-8"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
