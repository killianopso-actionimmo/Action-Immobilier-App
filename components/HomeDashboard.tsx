import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Compass, FileText, PhoneCall, Search, Leaf,
    Building2, MapPin, Zap, Flame, PaintRoller, ClipboardList,
    Calculator, ChevronLeft, Sparkles, ArrowRight, Lightbulb, Target
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

    const CategoryCard = ({ title, desc, icon: Icon, image, onClick, variant = "primary" }: any) => (
        <motion.div
            onClick={onClick}
            className="relative group cursor-pointer h-[350px] md:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
            whileHover="hover"
            initial="rest"
        >
            {/* Glow Effect - Bleu ou Violet */}
            <div className={`absolute inset-0 ${variant === 'primary' ? 'bg-blue-600/20' : 'bg-violet-600/20'} blur-2xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-0`} />

            {/* Border - Bleu ou Violet */}
            <div className={`absolute inset-0 border-2 border-transparent ${variant === 'primary' ? 'md:group-hover:border-blue-500/50' : 'md:group-hover:border-violet-500/50'} rounded-2xl md:rounded-3xl z-30 transition-colors duration-300`} />

            <div className="absolute inset-0 z-10 overflow-hidden">
                <motion.div
                    className="w-full h-full"
                    variants={{
                        rest: { scale: 1 },
                        hover: { scale: 1.1 }
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-20" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-30">
                <motion.div
                    className={`inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl ${variant === 'primary' ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-violet-500/20 border border-violet-400/30'} backdrop-blur-sm mb-4 md:mb-6`}
                    variants={{
                        rest: { scale: 1, rotate: 0 },
                        hover: { scale: 1.1, rotate: 5 }
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 ${variant === 'primary' ? 'text-blue-400' : 'text-violet-400'}`} />
                </motion.div>
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 md:mb-3 leading-tight">
                    {title}
                </h3>
                <p className="text-slate-300 text-sm md:text-lg font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-y-4 md:group-hover:translate-y-0">
                    {desc}
                </p>
                <div className="mt-4 md:mt-6 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700">
                    Explorer <ArrowRight size={14} />
                </div>
            </div>

            {/* Fragmentation Particles - Desktop only for performance */}
            <div className="hidden lg:block">
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
            </div>
        </motion.div>
    );

    const ServiceCard = ({ title, icon: Icon, image, onClick }: any) => (
        <motion.div
            onClick={onClick}
            className="relative group cursor-pointer h-[200px] md:h-[280px] rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="absolute inset-0 border-2 border-transparent md:group-hover:border-blue-500/50 rounded-xl md:rounded-2xl z-30 transition-all" />

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

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 md:p-2 bg-blue-600 rounded-lg">
                        <Icon size={18} className="text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-white leading-tight">
                        {title}
                    </h4>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto py-6 md:py-12 px-4 space-y-10 md:space-y-16">
            <AnimatePresence mode="wait">
                {view === 'categories' && (
                    <motion.div
                        key="categories"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-8 md:space-y-12"
                    >
                        <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-pink-100 text-pink-700 rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase mb-2 md:mb-4"
                            >
                                <Sparkles size={14} /> Centre de Pilotage IA
                            </motion.div>
                            <h1 className="text-3xl md:text-7xl font-serif font-bold text-slate-900 leading-tight">
                                Bienvenue chez <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Action Immobilier</span>
                            </h1>
                            <p className="text-slate-500 text-base md:text-xl font-medium italic">Votre expertise augmentée par l'Intelligence Artificielle.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto">
                            <CategoryCard
                                title="Cerveau IA"
                                desc="Analyse prédictive, rédaction automatisée et veille de marché en temps réel."
                                icon={Brain}
                                image={IMAGES.cerveau_hub}
                                onClick={() => setView('cerveau')}
                                variant="primary"
                            />
                            <CategoryCard
                                title="Méthode Agence"
                                desc="Outils terrain, checklists expertes et calculatrices financières."
                                icon={Compass}
                                image={IMAGES.methode_hub}
                                onClick={() => setView('methode')}
                                variant="secondary"
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
                        className="space-y-8 md:space-y-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 md:pb-8 gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setView('categories')}
                                    className="p-2 md:p-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <ChevronLeft size={24} className="text-slate-600" />
                                </button>
                                <div>
                                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900">
                                        {view === 'cerveau' ? 'Services Cerveau IA' : 'Outils Méthode Agence'}
                                    </h2>
                                    <p className="text-slate-500 text-sm md:text-base font-medium">Sélectionnez un module pour démarrer</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                                    <ServiceCard
                                        title="Objectifs du Mois"
                                        icon={Target}
                                        image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=600"
                                        onClick={() => onNavigate('goals')}
                                    />
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
