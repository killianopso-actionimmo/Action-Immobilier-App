import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Mail, DoorOpen, Home, Plus, Minus, Check, RotateCcw } from 'lucide-react';
import NavigationButtons from './NavigationButtons';

interface GoalsTrackerProps {
    onGoBack: () => void;
    onGoHome: () => void;
}

interface MonthlyGoals {
    mandats: number;
    courriers: number;
    porteAPorte: number;
    boitageValidated: boolean;
    month: string; // Format: "2026-01"
}

const GOALS = {
    mandats: 2,
    courriers: 100,
    porteAPorte: 50,
};

const GoalsTracker: React.FC<GoalsTrackerProps> = ({ onGoBack, onGoHome }) => {
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const [goals, setGoals] = useState<MonthlyGoals>({
        mandats: 0,
        courriers: 0,
        porteAPorte: 0,
        boitageValidated: false,
        month: getCurrentMonth(),
    });

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('monthly_goals');
        if (saved) {
            const parsed: MonthlyGoals = JSON.parse(saved);

            // Check if it's a new month - reset if so
            if (parsed.month !== getCurrentMonth()) {
                const resetGoals = {
                    mandats: 0,
                    courriers: 0,
                    porteAPorte: 0,
                    boitageValidated: false,
                    month: getCurrentMonth(),
                };
                setGoals(resetGoals);
                localStorage.setItem('monthly_goals', JSON.stringify(resetGoals));
            } else {
                setGoals(parsed);
            }
        }
    }, []);

    // Save to localStorage on every change
    useEffect(() => {
        localStorage.setItem('monthly_goals', JSON.stringify(goals));
    }, [goals]);

    const updateGoal = (key: keyof Omit<MonthlyGoals, 'month' | 'boitageValidated'>, delta: number) => {
        setGoals(prev => ({
            ...prev,
            [key]: Math.max(0, prev[key] + delta),
        }));
    };

    const toggleBoitage = () => {
        setGoals(prev => ({
            ...prev,
            boitageValidated: !prev.boitageValidated,
        }));
    };

    const resetMonth = () => {
        if (window.confirm('Réinitialiser tous les objectifs du mois ?')) {
            const resetGoals = {
                mandats: 0,
                courriers: 0,
                porteAPorte: 0,
                boitageValidated: false,
                month: getCurrentMonth(),
            };
            setGoals(resetGoals);
        }
    };

    const getProgress = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    const CircularProgress = ({
        progress,
        current,
        target,
        label,
        icon: Icon,
        color = 'blue'
    }: {
        progress: number;
        current: number;
        target: number;
        label: string;
        icon: any;
        color?: 'blue' | 'green';
    }) => {
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (progress / 100) * circumference;
        const isComplete = current >= target;

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                    {/* Background circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke="rgba(100, 116, 139, 0.2)"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke={isComplete ? '#10b981' : color === 'green' ? '#10b981' : '#3b82f6'}
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={isComplete ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : color === 'green' ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'}
                        />
                    </svg>

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Icon className={`w-8 h-8 mb-2 ${isComplete ? 'text-green-400' : color === 'green' ? 'text-green-400' : 'text-blue-400'}`} />
                        <div className={`text-3xl font-bold ${isComplete ? 'text-green-400' : color === 'green' ? 'text-green-400' : 'text-blue-400'}`}>
                            {current}
                        </div>
                        <div className="text-sm text-gray-400">/ {target}</div>
                        <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</div>
                    </div>
                </div>

                <p className="text-sm font-semibold text-gray-300 mt-4">{label}</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <NavigationButtons onBack={onGoBack} onHome={onGoHome} />

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Target className="w-12 h-12 text-blue-400" />
                        <h1 className="text-5xl font-bold text-white">
                            Objectifs du Mois
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400">
                        {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </p>
                    <button
                        onClick={resetMonth}
                        className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm flex items-center gap-2 mx-auto transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Réinitialiser le mois
                    </button>
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Mandats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                    >
                        <CircularProgress
                            progress={getProgress(goals.mandats, GOALS.mandats)}
                            current={goals.mandats}
                            target={GOALS.mandats}
                            label="Mandats"
                            icon={Target}
                            color="blue"
                        />
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => updateGoal('mandats', -1)}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-lg transition-colors border border-red-500/30"
                            >
                                <Minus className="w-5 h-5 mx-auto" />
                            </button>
                            <button
                                onClick={() => updateGoal('mandats', 1)}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-3 rounded-lg transition-colors border border-blue-500/30"
                            >
                                <Plus className="w-5 h-5 mx-auto" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Courriers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                    >
                        <CircularProgress
                            progress={getProgress(goals.courriers, GOALS.courriers)}
                            current={goals.courriers}
                            target={GOALS.courriers}
                            label="Courriers"
                            icon={Mail}
                            color="blue"
                        />
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => updateGoal('courriers', -1)}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-lg transition-colors border border-red-500/30"
                            >
                                <Minus className="w-5 h-5 mx-auto" />
                            </button>
                            <button
                                onClick={() => updateGoal('courriers', 1)}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-3 rounded-lg transition-colors border border-blue-500/30"
                            >
                                <Plus className="w-5 h-5 mx-auto" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Porte-à-porte */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                    >
                        <CircularProgress
                            progress={getProgress(goals.porteAPorte, GOALS.porteAPorte)}
                            current={goals.porteAPorte}
                            target={GOALS.porteAPorte}
                            label="Porte-à-porte"
                            icon={DoorOpen}
                            color="blue"
                        />
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => updateGoal('porteAPorte', -1)}
                                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-lg transition-colors border border-red-500/30"
                            >
                                <Minus className="w-5 h-5 mx-auto" />
                            </button>
                            <button
                                onClick={() => updateGoal('porteAPorte', 1)}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-3 rounded-lg transition-colors border border-blue-500/30"
                            >
                                <Plus className="w-5 h-5 mx-auto" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Boitage */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border shadow-lg transition-all ${goals.boitageValidated
                            ? 'border-green-500/50 shadow-green-500/20'
                            : 'border-slate-600/30 shadow-slate-500/10'
                            }`}
                    >
                        <div className="flex flex-col items-center">
                            <div className={`w-48 h-48 rounded-full flex items-center justify-center border-8 transition-all ${goals.boitageValidated
                                ? 'border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                                : 'border-slate-600 bg-slate-700/30'
                                }`}>
                                <Home className={`w-16 h-16 ${goals.boitageValidated ? 'text-green-400' : 'text-gray-500'}`} />
                            </div>
                            <p className="text-sm font-semibold text-gray-300 mt-6">Boitage du Mois</p>
                        </div>

                        <button
                            onClick={toggleBoitage}
                            className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${goals.boitageValidated
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                : 'bg-slate-700 text-gray-300 border border-slate-600 hover:bg-slate-600'
                                }`}
                        >
                            {goals.boitageValidated ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Validé
                                </>
                            ) : (
                                'Valider le Boitage'
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Récapitulatif</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">{goals.mandats}/{GOALS.mandats}</div>
                            <div className="text-sm text-gray-400 mt-1">Mandats</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">{goals.courriers}/{GOALS.courriers}</div>
                            <div className="text-sm text-gray-400 mt-1">Courriers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">{goals.porteAPorte}/{GOALS.porteAPorte}</div>
                            <div className="text-sm text-gray-400 mt-1">Réponses PAP</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${goals.boitageValidated ? 'text-green-400' : 'text-gray-500'}`}>
                                {goals.boitageValidated ? '✓' : '○'}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">Boitage</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GoalsTracker;
