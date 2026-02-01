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
        <div className="fixed bottom-0 left-0 right-0 z-50 bottom-nav">
            <div className="glass-card mx-4 mb-4 p-2 border-t-2 border-cyan-400/30">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className="relative flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all"
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSection"
                                        className="absolute inset-0 bg-cyan-400/10 border border-cyan-400/50 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Icon */}
                                <Icon
                                    className={`w-6 h-6 relative z-10 transition-all ${isActive
                                            ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]'
                                            : 'text-gray-500'
                                        }`}
                                />

                                {/* Label */}
                                <span
                                    className={`text-xs font-medium relative z-10 transition-all ${isActive ? 'text-cyan-400' : 'text-gray-500'
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
