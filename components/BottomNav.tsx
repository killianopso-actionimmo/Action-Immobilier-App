import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Scale } from 'lucide-react';

interface BottomNavProps {
    currentSection: 'ia' | 'objectifs' | 'juridique';
    onSectionChange: (section: 'ia' | 'objectifs' | 'juridique') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentSection, onSectionChange }) => {
    const navItems = [
        { id: 'ia' as const, icon: Brain, label: 'IA' },
        { id: 'objectifs' as const, icon: Target, label: 'Objectifs' },
        { id: 'juridique' as const, icon: Scale, label: 'Juridique' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bottom-nav">
            <div className="glass-card mx-2 mb-2 px-3 py-1.5 border-t border-blue-500/30 shadow-[0_-2px_10px_rgba(37,99,235,0.1)]">
                <div className="flex justify-around items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all"
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSection"
                                        className="absolute inset-0 bg-blue-500/10 border border-blue-500/50 rounded-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Icon */}
                                <Icon
                                    className={`w-4 h-4 relative z-10 transition-all ${isActive
                                        ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]'
                                        : 'text-gray-500'
                                        }`}
                                />

                                {/* Label */}
                                <span
                                    className={`text-[10px] font-medium relative z-10 transition-all ${isActive ? 'text-blue-400' : 'text-gray-500'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNav;
