import React, { useState, useEffect } from 'react';
import { Mandate } from '../types';
import { fetchMandates, analyzeOpportunity, OpportunityAnalysis } from '../services/marketService';
import { ExternalLink, RefreshCw, TrendingUp, AlertCircle, Search, Home, Phone, User, Calendar, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MandateWatchDisplay: React.FC = () => {
    const [mandates, setMandates] = useState<Mandate[]>([]);
    const [filteredMandates, setFilteredMandates] = useState<Mandate[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzedId, setAnalyzedId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<OpportunityAnalysis | null>(null);
    const [hoveredPrice, setHoveredPrice] = useState<string | null>(null);

    // Filters
    const [cityFilter, setCityFilter] = useState('');
    const [maxBudget, setMaxBudget] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [mandates, cityFilter, maxBudget]);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchMandates();
        setTimeout(() => {
            setMandates(data);
            setLoading(false);
        }, 800);
    };

    const applyFilters = () => {
        let filtered = [...mandates];

        // Strict city filter
        if (cityFilter.trim()) {
            filtered = filtered.filter(m =>
                m.location.toLowerCase() === cityFilter.toLowerCase().trim()
            );
        }

        // Budget filter
        if (maxBudget.trim()) {
            const budget = parseInt(maxBudget);
            if (!isNaN(budget)) {
                filtered = filtered.filter(m => m.price <= budget);
            }
        }

        setFilteredMandates(filtered);
    };

    const handleAnalyze = (mandate: Mandate) => {
        setAnalyzedId(mandate.id);
        const result = analyzeOpportunity(mandate);
        setAnalysisResult(result);
    };

    const getDPEColor = (dpe?: string) => {
        if (!dpe) return 'bg-slate-100 text-slate-600';
        const colors: Record<string, string> = {
            'A': 'bg-emerald-500 text-white',
            'B': 'bg-green-500 text-white',
            'C': 'bg-lime-500 text-white',
            'D': 'bg-yellow-500 text-white',
            'E': 'bg-orange-500 text-white',
            'F': 'bg-red-500 text-white',
            'G': 'bg-red-700 text-white'
        };
        return colors[dpe] || 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-premium p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Search size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Mandats détectés</p>
                            <h3 className="text-3xl font-bold text-slate-900">{filteredMandates.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="card-premium p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Prix Moyen / m²</p>
                            <h3 className="text-3xl font-bold text-slate-900">
                                {filteredMandates.length > 0
                                    ? Math.round(filteredMandates.reduce((acc, m) => acc + m.priceSqm, 0) / filteredMandates.length).toLocaleString('fr-FR')
                                    : '0'} €
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="card-premium p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Dernière mise à jour</p>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">Aujourd'hui</h3>
                    </div>
                    <button
                        onClick={loadData}
                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:rotate-180 duration-700"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card-premium p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ville (exacte)</label>
                        <input
                            type="text"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            placeholder="Ex: Lille, Ronchin, Faches-Thumesnil"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Budget maximum (€)</label>
                        <input
                            type="number"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            placeholder="Ex: 500000"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                    </div>
                    {(cityFilter || maxBudget) && (
                        <button
                            onClick={() => { setCityFilter(''); setMaxBudget(''); }}
                            className="self-end px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>

            {/* Main Table */}
            <div className="card-premium overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-serif text-xl font-bold text-slate-900">Annonces Détectées</h3>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredMandates.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Search size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="font-medium">Aucune annonce ne correspond à vos critères</p>
                        <p className="text-sm mt-2">Essayez d'ajuster vos filtres</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/50 text-slate-900 font-semibold uppercase text-xs tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Bien</th>
                                    <th className="px-6 py-4">Prix</th>
                                    <th className="px-6 py-4">Surface</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredMandates.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-16 rounded-lg bg-slate-200 overflow-hidden shadow-sm">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <Home size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="max-w-xs">
                                                        <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{item.location}</p>
                                                        {item.publishedDate && (
                                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                                                <Calendar size={12} />
                                                                {item.publishedDate}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    className="relative inline-block"
                                                    onMouseEnter={() => setHoveredPrice(item.id)}
                                                    onMouseLeave={() => setHoveredPrice(null)}
                                                >
                                                    <div className="font-bold text-slate-900 cursor-help">
                                                        {item.price.toLocaleString('fr-FR')} €
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        {item.priceSqm.toLocaleString('fr-FR')} €/m²
                                                    </div>

                                                    {/* Tooltip with DPE and Date */}
                                                    <AnimatePresence>
                                                        {hoveredPrice === item.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
                                                            >
                                                                <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl min-w-[200px]">
                                                                    <div className="flex items-center justify-between gap-4 mb-2">
                                                                        <span className="text-xs font-medium text-slate-300">DPE</span>
                                                                        <span className={`px-3 py-1 rounded-md text-xs font-bold ${getDPEColor(item.dpe)}`}>
                                                                            {item.dpe || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                                                        <Calendar size={12} />
                                                                        {item.publishedDate || 'Date inconnue'}
                                                                    </div>
                                                                    {/* Arrow */}
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                                                        <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{item.surface} m²</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {item.contactName && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                                            <User size={12} className="text-slate-400" />
                                                            <span className="font-medium">{item.contactName}</span>
                                                        </div>
                                                    )}
                                                    {item.contactPhone && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                                            <Phone size={12} className="text-slate-400" />
                                                            <span>{item.contactPhone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                                                    >
                                                        <ExternalLink size={14} />
                                                        Leboncoin
                                                    </a>
                                                    <button
                                                        onClick={() => handleAnalyze(item)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-primary-300 hover:text-primary-600 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                                                    >
                                                        <AlertCircle size={14} />
                                                        Analyser
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>

                                        {/* Analysis Expansion */}
                                        <AnimatePresence>
                                            {analyzedId === item.id && analysisResult && (
                                                <tr>
                                                    <td colSpan={5} className="px-0 py-0 border-none">
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden bg-slate-50/50 border-b border-slate-200 shadow-inner"
                                                        >
                                                            <div className="p-6 flex items-start gap-4 mx-6 my-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                                                <div className={`p-3 rounded-lg ${analysisResult.color.split(' ')[1]}`}>
                                                                    <Zap className={analysisResult.color.split(' ')[0]} size={24} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h4 className="font-bold text-slate-900">Analyse d'opportunité</h4>
                                                                            <p className="text-slate-600 mt-1">{analysisResult.details}</p>
                                                                        </div>
                                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${analysisResult.color}`}>
                                                                            {analysisResult.rating}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MandateWatchDisplay;
