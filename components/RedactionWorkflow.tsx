import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Share2, Sparkles, Copy, RefreshCw, Smartphone, Laptop, Send } from 'lucide-react';
import { generateDynamicRedaction } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

type MessageType = 'mail' | 'sms' | 'social' | null;

const RedactionWorkflow: React.FC = () => {
    const [step, setStep] = useState<'selection' | 'input' | 'result'>('selection');
    const [messageType, setMessageType] = useState<MessageType>(null);
    const [description, setDescription] = useState('');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<{ subject: string, content: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Images
    const mailImg = "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=600&h=400"; // Laptop/Coffee
    const smsImg = "/sms_smartphone.png"; // High-quality generated asset
    const socialImg = "/social_media.png"; // High-quality generated asset

    const handleSelect = (type: MessageType) => {
        setMessageType(type);
        setStep('input');
        setError(null);
    };

    const handleGenerate = async (isVariant: boolean = false) => {
        if (!description.trim() || !messageType) return;

        setGenerating(true);
        setError(null);
        try {
            const res = await generateDynamicRedaction(messageType, description, isVariant);
            setResult(res);
            setStep('result');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erreur de génération");
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        const textToCopy = result.subject ? `Subject: ${result.subject}\n\n${result.content}` : result.content;
        navigator.clipboard.writeText(textToCopy);
    };

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
                                Rédaction Intelligente
                            </h2>
                            <p className="text-slate-500 text-lg uppercase tracking-widest">Choisissez votre canal de communication</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">

                            {/* EMAIL CARD */}
                            <motion.div
                                onClick={() => handleSelect('mail')}
                                className="relative group cursor-pointer h-[400px] rounded-2xl overflow-hidden shadow-xl"
                                whileHover="hover"
                                initial="rest"
                            >
                                <div className="absolute inset-0 bg-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500 rounded-2xl z-30 transition-colors duration-300" />
                                <div className="absolute inset-0 z-10 overflow-hidden">
                                    <motion.div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${mailImg})` }}
                                        variants={{
                                            rest: { scale: 1, filter: 'brightness(0.9)' },
                                            hover: { scale: 1.1, filter: 'brightness(1.1)' }
                                        }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <Laptop className="text-pink-500" size={32} />
                                        EMAIL PRO
                                    </h3>
                                    <p className="text-slate-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Structuré, formel, efficace
                                    </p>
                                </div>
                            </motion.div>

                            {/* SMS CARD */}
                            <motion.div
                                onClick={() => handleSelect('sms')}
                                className="relative group cursor-pointer h-[400px] rounded-2xl overflow-hidden shadow-xl"
                                whileHover="hover"
                                initial="rest"
                            >
                                <div className="absolute inset-0 bg-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500 rounded-2xl z-30 transition-colors duration-300" />
                                <div className="absolute inset-0 z-10 overflow-hidden">
                                    <motion.div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${smsImg})` }}
                                        variants={{
                                            rest: { scale: 1, filter: 'brightness(0.9)' },
                                            hover: { scale: 1.1, filter: 'brightness(1.1)' }
                                        }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <Smartphone className="text-pink-500" size={32} />
                                        SMS / TEXTO
                                    </h3>
                                    <p className="text-slate-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Court, direct, réactif
                                    </p>
                                </div>
                            </motion.div>

                            {/* SOCIAL CARD */}
                            <motion.div
                                onClick={() => handleSelect('social')}
                                className="relative group cursor-pointer h-[400px] rounded-2xl overflow-hidden shadow-xl"
                                whileHover="hover"
                                initial="rest"
                            >
                                <div className="absolute inset-0 bg-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500 rounded-2xl z-30 transition-colors duration-300" />
                                <div className="absolute inset-0 z-10 overflow-hidden">
                                    <motion.div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${socialImg})` }}
                                        variants={{
                                            rest: { scale: 1, filter: 'brightness(0.9)' },
                                            hover: { scale: 1.1, filter: 'brightness(1.1)' }
                                        }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <Share2 className="text-pink-500" size={32} />
                                        RÉSEAUX
                                    </h3>
                                    <p className="text-slate-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Engageant, viral, visuel
                                    </p>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>
                )}

                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
                                {messageType === 'mail' ? <Mail className="text-pink-600" /> : messageType === 'sms' ? <Smartphone className="text-pink-600" /> : <Share2 className="text-pink-600" />}
                                Rédaction {messageType === 'mail' ? 'Email' : messageType === 'sms' ? 'SMS' : 'Réseaux'}
                            </h2>
                            <button onClick={() => setStep('selection')} className="text-slate-400 hover:text-pink-600 underline">Changer</button>
                        </div>

                        <div className="card-premium p-8 space-y-6">
                            <label className="block">
                                <span className="text-lg font-bold text-slate-800 mb-2 block">Décrivez votre besoin</span>
                                <p className="text-slate-500 text-sm mb-3">
                                    Ex: "Je veux relancer le client M. Dupont suite à sa visite d'hier sur la maison de Lille, pour savoir s'il a une offre."
                                </p>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none h-40 resize-none text-slate-800 text-lg"
                                    placeholder="Allez-y, parlez naturellement..."
                                    autoFocus
                                />
                            </label>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={() => handleGenerate(false)}
                                disabled={generating || !description.trim()}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating ? <Sparkles className="animate-spin" /> : <Send />}
                                Générer le message
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'result' && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-3xl mx-auto space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-serif font-bold text-slate-900">Résultat</h2>
                            <button onClick={() => setStep('input')} className="text-slate-400 hover:text-pink-600 underline">Modifier la demande</button>
                        </div>

                        <div className="card-premium overflow-hidden">
                            <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <button onClick={copyToClipboard} className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-pink-600 flex items-center gap-1">
                                    <Copy size={14} /> Copier
                                </button>
                            </div>

                            <div className="p-8 space-y-4">
                                {result.subject && (
                                    <div className="pb-4 border-b border-slate-100">
                                        <span className="text-slate-400 text-sm font-bold uppercase tracking-wider block mb-1">Objet</span>
                                        <div className="text-lg font-bold text-slate-800">{result.subject}</div>
                                    </div>
                                )}
                                <div>
                                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider block mb-2">Message</span>
                                    <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {result.content}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => handleGenerate(true)} // Request variant
                                disabled={generating}
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                {generating ? <RefreshCw className="animate-spin" /> : <RefreshCw />}
                                Une autre variante
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 py-3 bg-pink-600 text-white rounded-xl font-bold shadow-lg hover:bg-pink-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Copy />
                                Copier le texte
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RedactionWorkflow;
