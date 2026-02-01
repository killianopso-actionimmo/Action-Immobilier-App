import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Brain, Compass, ChevronDown, Building2, PhoneCall, Search,
    FileText, ClipboardList, Calculator, LayoutDashboard, Map, Users, Settings, Leaf, MapPin, Zap, Flame, PaintRoller, Lightbulb, Target
} from 'lucide-react';
import { AnalysisMode } from '../types';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
    currentMode: AnalysisMode;
    onModeChange: (mode: AnalysisMode) => void;
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    icon: any;
    label: string;
    mode: AnalysisMode;
}

interface Category {
    id: string;
    label: string;
    icon: any;
    items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, isOpen, onClose }) => {
    const [openCategories, setOpenCategories] = useState<string[]>(['cerveau']);

    const categories: Category[] = [
        {
            id: 'cerveau',
            label: 'Cerveau IA',
            icon: Brain,
            items: [
                { icon: FileText, label: 'Rédaction', mode: 'redaction' },
                { icon: PhoneCall, label: 'Analyse Leads', mode: 'pige' },
                { icon: Search, label: 'Veille Mandats', mode: 'mandate_watch' },
                { icon: Leaf, label: 'DPE Booster', mode: 'dpe' },
                { icon: Building2, label: 'Analyse Copro', mode: 'copro' },
                { icon: MapPin, label: 'Expertise Quartier', mode: 'street' },
                { icon: Zap, label: 'Audit Technique', mode: 'technical' },
                { icon: Flame, label: 'Analyse Chauffage', mode: 'heating' },
                { icon: PaintRoller, label: 'Conseils Travaux', mode: 'renovation' }
            ]
        },
        {
            id: 'methode',
            label: 'Méthode Agence',
            icon: Compass,
            items: [
                { icon: ClipboardList, label: 'Préparation Estimation', mode: 'estimation_workflow' },
                { icon: Building2, label: 'Checklist Visite', mode: 'checklist' },
                { icon: Calculator, label: 'Calculatrice Express', mode: 'calculator' },
                { icon: Lightbulb, label: 'Boîte à idées', mode: 'idea_box' },
                { icon: Target, label: 'Objectifs', mode: 'goals' }
            ]
        }
    ];

    const standaloneItems: MenuItem[] = [
        { icon: Map, label: 'Gestion Zone', mode: 'prospection' },
        { icon: LayoutDashboard, label: 'Tableau de Bord', mode: 'dashboard' }
    ];

    const toggleCategory = (categoryId: string) => {
        setOpenCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleItemClick = (mode: AnalysisMode) => {
        onModeChange(mode);
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    const isItemActive = (mode: AnalysisMode) => currentMode === mode;

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={`fixed left-0 top-0 h-screen bg-white/70 backdrop-blur-md border-r border-white/20 flex flex-col z-50 transition-all duration-300 shadow-xl ${isOpen ? 'translate-x-0 w-72 md:w-64' : '-translate-x-full lg:translate-x-0 w-64'
                }`}>
                {/* Logo Area */}
                <motion.div
                    className="h-24 flex items-center justify-between px-6 border-b border-slate-100/50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <img
                        src="/logo.png"
                        alt="Action Immobilier"
                        className="w-32 h-auto object-contain transition-all duration-300 hover:scale-105 drop-shadow-lg"
                        onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/150x50?text=Action+Immo';
                        }}
                    />
                </motion.div>

                {/* Navigation with Categories */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                    {/* Home Item */}
                    <motion.button
                        onClick={() => handleItemClick('home')}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 group relative mb-4 ${isItemActive('home')
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <Home size={18} className={isItemActive('home') ? 'text-white' : 'text-primary-600'} />
                        <span>Accueil</span>
                        {isItemActive('home') && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
                            />
                        )}
                    </motion.button>

                    {/* Categories */}
                    {categories.map((category, catIndex) => (
                        <div key={category.id} className="mb-2">
                            {/* Category Header */}
                            <motion.button
                                onClick={() => toggleCategory(category.id)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: catIndex * 0.1 }}
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-slate-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all group relative overflow-hidden"
                            >
                                {/* Illuminate effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary-400/10 via-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    initial={false}
                                />

                                <div className="flex items-center gap-2 relative z-10">
                                    <category.icon size={18} className="text-primary-600" />
                                    <span>{category.label}</span>
                                </div>

                                <motion.div
                                    animate={{ rotate: openCategories.includes(category.id) ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10"
                                >
                                    <ChevronDown size={16} className="text-slate-400" />
                                </motion.div>
                            </motion.button>

                            {/* Category Items */}
                            <AnimatePresence>
                                {openCategories.includes(category.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-4 pt-2 space-y-1">
                                            {category.items.map((item, itemIndex) => (
                                                <motion.button
                                                    key={item.mode}
                                                    onClick={() => handleItemClick(item.mode)}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: itemIndex * 0.05 }}
                                                    whileHover={{ x: 4, scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isItemActive(item.mode)
                                                        ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-lg'
                                                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 hover:shadow-md'
                                                        }`}
                                                >
                                                    {isItemActive(item.mode) && (
                                                        <motion.div
                                                            layoutId="activeIndicatorSub"
                                                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}

                                                    <item.icon
                                                        size={16}
                                                        className={`transition-all duration-200 ${isItemActive(item.mode)
                                                            ? 'text-primary-600'
                                                            : 'text-slate-400 group-hover:text-slate-600'
                                                            }`}
                                                    />
                                                    <span>{item.label}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    {/* Standalone Items */}
                    <div className="pt-4 border-t border-slate-100 mt-4 space-y-1">
                        {standaloneItems.map((item, index) => (
                            <motion.button
                                key={item.mode}
                                onClick={() => handleItemClick(item.mode)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (categories.length + index) * 0.05 }}
                                whileHover={{ x: 4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isItemActive(item.mode)
                                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-lg'
                                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 hover:shadow-md'
                                    }`}
                            >
                                {isItemActive(item.mode) && (
                                    <motion.div
                                        layoutId="activeIndicatorStandalone"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <item.icon
                                    size={18}
                                    className={`transition-all duration-200 ${isItemActive(item.mode)
                                        ? 'text-primary-600'
                                        : 'text-slate-400 group-hover:text-slate-600'
                                        }`}
                                />
                                <span>{item.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-100">
                    <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Paramètres</p>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
