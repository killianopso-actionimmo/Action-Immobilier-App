import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building, CheckCircle2, Sparkles, ArrowRight, FileText, Building2, StickyNote, AlertCircle, Copy } from 'lucide-react';
import { generateEstimationSummary } from '../services/openaiService';
import ReactMarkdown from 'react-markdown';

type PropertyType = 'maison' | 'appartement' | null;
type WorkflowStep = 'selection' | 'checklist' | 'generation';

interface ChecklistSection {
    id: string;
    title: string;
    items: { id: string; label: string; checked: boolean }[];
}

interface CoproDetails {
    syndic: string;
    lots: string;
    charges: string;
    procedures: string;
    works: string;
}

const EstimationWorkflow: React.FC = () => {
    const [step, setStep] = useState<WorkflowStep>('selection');
    const [propertyType, setPropertyType] = useState<PropertyType>(null);
    const [generating, setGenerating] = useState(false);
    const [generatedReport, setGeneratedReport] = useState<string | null>(null);

    // Initial Sections Data
    const initialSections: ChecklistSection[] = [
        {
            id: 'ext',
            title: 'Extérieur',
            items: [
                { id: 'ext1', label: 'Toiture (état, matériau)', checked: false },
                { id: 'ext2', label: 'Façade (fissures, ravalement)', checked: false },
                { id: 'ext3', label: 'Jardin / Terrain / Clôture', checked: false },
                { id: 'ext4', label: 'Assainissement', checked: false }
            ]
        },
        {
            id: 'int',
            title: 'Intérieur',
            items: [
                { id: 'int1', label: 'État des sols', checked: false },
                { id: 'int2', label: 'Électricité (tableau, prises)', checked: false },
                { id: 'int3', label: 'Chauffage & Eau Chaude', checked: false },
                { id: 'int4', label: 'Isolation & Fenêtres', checked: false },
                { id: 'int5', label: 'Cuisine & Sanitaires', checked: false }
            ]
        },
        {
            id: 'tech',
            title: 'Technique & Dossier',
            items: [
                { id: 'tech1', label: 'Servitudes & Urbanisme', checked: false },
                { id: 'tech2', label: 'DPE & Diagnostics', checked: false },
                { id: 'tech3', label: 'Taxe Foncière', checked: false },
                { id: 'tech4', label: 'Titre de propriété', checked: false }
            ]
        }
    ];

    // State
    const [sections, setSections] = useState<ChecklistSection[]>(initialSections);
    const [notes, setNotes] = useState({
        remarques: '',
        vrac: ''
    });

    // Apartment Specific State
    const [coproDetails, setCoproDetails] = useState<CoproDetails>({
        syndic: '',
        lots: '',
        charges: '',
        procedures: '',
        works: ''
    });

    // Load from LocalStorage
    useEffect(() => {
        const savedData = localStorage.getItem('estimation_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.sections) setSections(parsed.sections);
                if (parsed.notes) setNotes(parsed.notes);
                if (parsed.coproDetails) setCoproDetails(parsed.coproDetails);
                if (parsed.propertyType) setPropertyType(parsed.propertyType);
                if (parsed.step) setStep(parsed.step);
            } catch (e) {
                console.error("Failed to load saved estimation data");
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        const dataToSave = {
            sections,
            notes,
            coproDetails,
            propertyType,
            step
        };
        localStorage.setItem('estimation_data', JSON.stringify(dataToSave));
    }, [sections, notes, coproDetails, propertyType, step]);


    const handlePropertySelect = (type: PropertyType) => {
        setPropertyType(type);
        setTimeout(() => setStep('checklist'), 400); // Allow animation to play
    };

    const toggleChecklistItem = (sectionIndex: number, itemId: string) => {
        setSections(prev => prev.map((section, idx) =>
            idx === sectionIndex
                ? {
                    ...section,
                    items: section.items.map(item =>
                        item.id === itemId ? { ...item, checked: !item.checked } : item
                    )
                }
                : section
        ));
    };

    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        setGenerating(true);
        setError(null);
        try {
            console.log("Starting generation...");
            const data = {
                propertyType,
                sections,
                notes,
                coproDetails: propertyType === 'appartement' ? coproDetails : null
            };

            console.log("Calling Gemini service with data:", data);
            const report = await generateEstimationSummary(data);
            console.log("Report received:", report ? report.substring(0, 50) + "..." : "null");

            if (!report) {
                throw new Error("Le rapport reçu est vide.");
            }

            setGeneratedReport(report);
            setStep('generation');
        } catch (err: any) {
            console.error("Generation failed:", err);
            setError(err.message || "Erreur inconnue lors de la génération. Vérifiez la clé API.");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyReport = () => {
        if (generatedReport) {
            navigator.clipboard.writeText(generatedReport);
            // Optional: Show toast
        }
    };

    // Images
    const maisonImg = "/luxury_house.png";
    const appartImg = "/modern_apartment.png";

    return (
        <div className="space-y-8 min-h-screen bg-slate-50 p-4 md:p-8 rounded-2xl">
            <AnimatePresence mode="wait">
                {step === 'selection' && (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="space-y-12 py-12"
                    >
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
                                Type de Bien
                            </h2>
                            <p className="text-slate-500 text-lg uppercase tracking-widest">Sélectionnez pour commencer l'expertise</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
                            {/* MAISON CARD */}
                            <motion.div
                                onClick={() => handlePropertySelect('maison')}
                                className="relative group cursor-pointer h-[400px] rounded-2xl overflow-hidden shadow-xl"
                                whileHover="hover"
                                initial="rest"
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0" />

                                {/* Border Effect */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500 rounded-2xl z-30 transition-colors duration-300" />

                                {/* Image with Fragmentation Effect */}
                                <div className="absolute inset-0 z-10 overflow-hidden">
                                    <motion.div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${maisonImg})` }}
                                        variants={{
                                            rest: { scale: 1, filter: 'brightness(0.9)' },
                                            hover: { scale: 1.1, filter: 'brightness(1.1)' }
                                        }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <Home className="text-pink-500" size={32} />
                                        MAISON
                                    </h3>
                                    <p className="text-slate-300 font-medium text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Expertise complète : Terrain, Façade, Toiture
                                    </p>
                                </div>

                                {/* Fragmentation Particles (Simulated visual flair) */}
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute z-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-lg"
                                        variants={{
                                            rest: { opacity: 0, x: 0, y: 0, rotate: 0 },
                                            hover: {
                                                opacity: [0, 1, 0],
                                                x: Math.random() * 100 - 50,
                                                y: Math.random() * -100 - 20,
                                                rotate: Math.random() * 90
                                            }
                                        }}
                                        transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
                                        style={{
                                            left: `${30 + i * 20}%`,
                                            top: '60%'
                                        }}
                                    />
                                ))}
                            </motion.div>

                            {/* APPARTEMENT CARD */}
                            <motion.div
                                onClick={() => handlePropertySelect('appartement')}
                                className="relative group cursor-pointer h-[400px] rounded-2xl overflow-hidden shadow-xl"
                                whileHover="hover"
                                initial="rest"
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0" />

                                {/* Border Effect */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500 rounded-2xl z-30 transition-colors duration-300" />

                                {/* Image */}
                                <div className="absolute inset-0 z-10 overflow-hidden">
                                    <motion.div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${appartImg})` }}
                                        variants={{
                                            rest: { scale: 1, filter: 'brightness(0.9)' },
                                            hover: { scale: 1.1, filter: 'brightness(1.1)' }
                                        }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <Building2 className="text-pink-500" size={32} />
                                        APPARTEMENT
                                    </h3>
                                    <p className="text-slate-300 font-medium text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Inclus : Analyse Copropriété & Charges
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {step === 'checklist' && (
                    <motion.div
                        key="checklist"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-6xl mx-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
                                    {propertyType === 'maison' ? <Home className="text-pink-600" /> : <Building2 className="text-pink-600" />}
                                    Expertise {propertyType === 'maison' ? 'Maison' : 'Appartement'}
                                </h2>
                                <p className="text-slate-500 mt-1">Complétez la fiche terrain</p>
                            </div>
                            <button
                                onClick={() => setStep('selection')}
                                className="text-sm font-medium text-slate-400 hover:text-pink-600 transition-colors underline"
                            >
                                Changer de type
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* LEFT COLUMN: Checklist */}
                            <div className="lg:col-span-2 space-y-8">
                                {sections.map((section, idx) => (
                                    <div key={section.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                                            {section.title}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {section.items.map(item => (
                                                <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                                    <div className="relative mt-1">
                                                        <input
                                                            type="checkbox"
                                                            className="peer sr-only"
                                                            checked={item.checked}
                                                            onChange={() => toggleChecklistItem(idx, item.id)}
                                                        />
                                                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-pink-600 peer-checked:border-pink-600 transition-all flex items-center justify-center">
                                                            <CheckCircle2 size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                                                        </div>
                                                    </div>
                                                    <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors select-none">
                                                        {item.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* APPARTEMENT SPECIFIC: COPRO */}
                                {propertyType === 'appartement' && (
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">4</span>
                                            Expertise Copropriété
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Nom du Syndic</label>
                                                <input
                                                    type="text"
                                                    value={coproDetails.syndic}
                                                    onChange={e => setCoproDetails({ ...coproDetails, syndic: e.target.value })}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                                    placeholder="Ex: Foncia, Matera..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Nombre de lots</label>
                                                <input
                                                    type="text"
                                                    value={coproDetails.lots}
                                                    onChange={e => setCoproDetails({ ...coproDetails, lots: e.target.value })}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                                    placeholder="Ex: 12 principaux"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Charges Mensuelles</label>
                                                <input
                                                    type="text"
                                                    value={coproDetails.charges}
                                                    onChange={e => setCoproDetails({ ...coproDetails, charges: e.target.value })}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                                    placeholder="Ex: 150€ (Eau froide incluse)"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Travaux Votés / Procédures</label>
                                                <input
                                                    type="text"
                                                    value={coproDetails.works}
                                                    onChange={e => setCoproDetails({ ...coproDetails, works: e.target.value })}
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                                    placeholder="Ex: Ravalement 2026..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Notes */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <StickyNote className="text-pink-600" />
                                        Notes Expert
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Remarques Générales</label>
                                            <textarea
                                                value={notes.remarques}
                                                onChange={(e) => setNotes(prev => ({ ...prev, remarques: e.target.value }))}
                                                className="w-full p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none resize-none text-slate-700"
                                                rows={6}
                                                placeholder="Impressions, ambiance, atouts majeurs, points noirs..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Notes en vrac</label>
                                            <textarea
                                                value={notes.vrac}
                                                onChange={(e) => setNotes(prev => ({ ...prev, vrac: e.target.value }))}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none resize-none text-slate-700"
                                                rows={8}
                                                placeholder="Infos vendeur, dates clés, conditions..."
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                                                <p className="text-sm text-red-700 font-medium">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleGenerateReport}
                                            disabled={generating}
                                            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
                                        >
                                            {generating ? (
                                                <>
                                                    <Sparkles className="animate-spin" />
                                                    IA au travail...
                                                </>
                                            ) : (
                                                <>
                                                    <FileText />
                                                    Générer le rapport de synthèse
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-center text-slate-400">
                                            L'IA analysera l'ensemble de vos notes et coches.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'generation' && generatedReport && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto space-y-6"
                    >
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Rapport Prêt !</h2>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                    <Sparkles size={16} className="text-pink-600" />
                                    Synthèse IA
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopyReport}
                                        className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-pink-600 flex items-center gap-1 transition-colors"
                                    >
                                        <Copy size={14} /> Copier
                                    </button>
                                </div>
                            </div>
                            <div className="p-8 prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
                                <ReactMarkdown>{generatedReport}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 pt-4">
                            <button
                                onClick={() => setStep('checklist')}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Retour aux notes
                            </button>
                            <button
                                onClick={handleCopyReport}
                                className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium flex items-center gap-2 shadow-lg transition-colors"
                            >
                                <Copy size={18} />
                                Copier le rapport
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EstimationWorkflow;
