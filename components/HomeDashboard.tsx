import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Compass, FileText, PhoneCall, Search, Leaf,
    Building2, MapPin, Zap, Flame, PaintRoller, ClipboardList,
    Calculator, ChevronLeft, Sparkles, ArrowRight, Lightbulb
} from 'lucide-react';
import { AnalysisMode } from '../types';

interface HomeDashboardProps {
    onNavigate: (mode: AnalysisMode) => void;
}

type ViewLevel = 'categories' | 'cerveau' | 'methode';

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
    const [view, setView] = useState<ViewLevel>('categories');

    // --- IMAGES LINKS ---
    const IMAGES = {
        cerveau_hub: "/cerveau_ia.png",
        methode_hub: "/methode_agence.png",

        redaction: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=600",
        pige: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
        mandate_watch: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=600",
        dpe: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=600",
        copro: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
        street: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
        technical: "/audit_technique.png",
        heating: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
        renovation: "/conseils_travaux.png",
        estimation: "/luxury_house.png",
        checklist: "/modern_apartment.png",
        calculator: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=600",
        idea_box: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
    };

    const CategoryCard = ({ title, desc, icon: Icon, image, onClick, color = "pink" }: any) => (
        <motion.div
            onClick={onClick}
            className="relative group cursor-pointer h-[450px] rounded-3xl overflow-hidden shadow-2xl"
            whileHover="hover"
            initial="rest"
        >
            <div className={`absolute inset-0 bg-${color}-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`} />
            <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${color}-500/50 rounded-3xl z-30 transition-colors duration-300`} />

            <div className="absolute inset-0 z-10 overflow-hidden">
                <motion.div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                    variants={{
                        rest: { scale: 1, filter: 'brightness(0.8) contrast(1.1)' },
                        hover: { scale: 1.1, filter: 'brightness(1) contrast(1.2)' }
                    }}
                    transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-10 z-20 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                <div className={`w-14 h-14 bg-${color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300`}>
                    <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-4xl font-serif font-bold text-white mb-3">
                    {title}
                </h3>
                <p className="text-slate-300 text-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    Explorer <ArrowRight size={16} />
                </div>
            </div>

            {/* Fragmentation Particles */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute z-10 w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl"
                    variants={{
                        rest: { opacity: 0, x: 0, y: 0, rotate: 0 },
                        hover: {
                            opacity: [0, 0.8, 0],
                            x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 150 + 50),
                            y: -(Math.random() * 200 + 100),
                            rotate: Math.random() * 180 - 90
                        }
                    }}
                    transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.5 }}
                    style={{
                        left: `${20 + i * 20}%`,
                        bottom: '40%'
                    }}
                />
            ))}
        </motion.div>
    );

    const ServiceCard = ({ title, icon: Icon, image, onClick }: any) => (
        <motion.div
            onClick={onClick}
            className="relative group cursor-pointer h-[280px] rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ y: -8 }}
        >
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500/50 rounded-2xl z-30 transition-all" />

            <div className="absolute inset-0 z-10 overflow-hidden">
                <motion.div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-600 rounded-lg">
                        <Icon size={18} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white leading-tight">
                        {title}
                    </h4>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
            <AnimatePresence mode="wait">
                {view === 'categories' && (
                    <motion.div
                        key="categories"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-12"
                    >
                        <div className="text-center space-y-4 max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold tracking-widest uppercase mb-4"
                            >
                                <Sparkles size={14} /> Centre de Pilotage IA
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900">
                                Bienvenue chez <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Action Immobilier</span>
                            </h1>
                            <p className="text-slate-500 text-xl font-medium italic">Votre expertise augmentée par l'Intelligence Artificielle.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                            <CategoryCard
                                title="Cerveau IA"
                                desc="Analyse prédictive, rédaction automatisée et veille de marché en temps réel."
                                icon={Brain}
                                image={IMAGES.cerveau_hub}
                                onClick={() => setView('cerveau')}
                                color="pink"
                            />
                            <CategoryCard
                                title="Méthode Agence"
                                desc="Outils terrain, checklists expertes et calculatrices financières."
                                icon={Compass}
                                image={IMAGES.methode_hub}
                                onClick={() => setView('methode')}
                                color="purple"
                            />
                        </div>
                    </motion.div>
                )}

                {(view === 'cerveau' || view === 'methode') && (
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-8">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setView('categories')}
                                    className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <ChevronLeft size={24} className="text-slate-600" />
                                </button>
                                <div>
                                    <h2 className="text-4xl font-serif font-bold text-slate-900">
                                        {view === 'cerveau' ? 'Services Cerveau IA' : 'Outils Méthode Agence'}
                                    </h2>
                                    <p className="text-slate-500 font-medium">Sélectionnez un module pour démarrer</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {view === 'cerveau' ? (
                                <>
                                    <ServiceCard title="Rédaction Intelligente" icon={FileText} image={IMAGES.redaction} onClick={() => onNavigate('redaction')} />
                                    <ServiceCard title="Analyse de Leads" icon={PhoneCall} image={IMAGES.pige} onClick={() => onNavigate('pige')} />
                                    <ServiceCard title="Veille Mandats" icon={Search} image={IMAGES.mandate_watch} onClick={() => onNavigate('mandate_watch')} />
                                    <ServiceCard title="DPE Booster" icon={Leaf} image={IMAGES.dpe} onClick={() => onNavigate('dpe')} />
                                    <ServiceCard title="Analyse Copropriété" icon={Building2} image={IMAGES.copro} onClick={() => onNavigate('copro')} />
                                    <ServiceCard title="Expertise Quartier" icon={MapPin} image={IMAGES.street} onClick={() => onNavigate('street')} />
                                    <ServiceCard title="Audit Technique" icon={Zap} image={IMAGES.technical} onClick={() => onNavigate('technical')} />
                                    <ServiceCard title="Analyse Chauffage" icon={Flame} image={IMAGES.heating} onClick={() => onNavigate('heating')} />
                                    <ServiceCard title="Conseils Travaux" icon={PaintRoller} image={IMAGES.renovation} onClick={() => onNavigate('renovation')} />
                                </>
                            ) : (
                                <>
                                    <ServiceCard title="Préparation Estimation" icon={ClipboardList} image={IMAGES.estimation} onClick={() => onNavigate('estimation_workflow')} />
                                    <ServiceCard title="Checklist Visite" icon={Building2} image={IMAGES.checklist} onClick={() => onNavigate('checklist')} />
                                    <ServiceCard title="Calculatrice Express" icon={Calculator} image={IMAGES.calculator} onClick={() => onNavigate('calculator')} />
                                    <ServiceCard title="Boîte à Idées" icon={Lightbulb} image={IMAGES.idea_box} onClick={() => onNavigate('idea_box')} />
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomeDashboard;
