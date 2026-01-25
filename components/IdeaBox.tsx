import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, PenTool, History, PlusCircle, Trash2, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Idea } from '../types';

interface IdeaBoxProps {
    ideas: Idea[];
    onSubmit: (content: string) => void;
    onDelete: (id: string) => void;
}

const IdeaBox: React.FC<IdeaBoxProps> = ({ ideas, onSubmit, onDelete }) => {
    const [view, setView] = useState<'selection' | 'form' | 'list'>('selection');
    const [newIdea, setNewIdea] = useState('');

    // Images
    const submitImg = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"; // Writing/Laptop
    const listImg = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"; // Lightbulb/Collaboration

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdea.trim()) return;
        onSubmit(newIdea.trim());
        setNewIdea('');
        setView('list');
    };

    return (
        <div className="mt-16 space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-200 group">
                    <Lightbulb className="text-white group-hover:rotate-12 transition-transform" size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">Boîte à Idées</h2>
            </div>

            <AnimatePresence mode="wait">
                {view === 'selection' && (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* SUBMIT CARD */}
                        <motion.div
                            onClick={() => setView('form')}
                            className="relative group cursor-pointer h-[250px] rounded-2xl overflow-hidden shadow-xl"
                            whileHover={{ y: -5 }}
                        >
                            <div className="absolute inset-0 z-10 overflow-hidden">
                                <motion.div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${submitImg})` }}
                                    whileHover={{ scale: 1.1 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                            </div>
                            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                    <PenTool className="text-amber-500" /> Soumettre une Idée
                                </h3>
                                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Une nouvelle pensée ? Notez-la ici.</p>
                            </div>
                        </motion.div>

                        {/* LIST CARD */}
                        <motion.div
                            onClick={() => setView('list')}
                            className="relative group cursor-pointer h-[250px] rounded-2xl overflow-hidden shadow-xl"
                            whileHover={{ y: -5 }}
                        >
                            <div className="absolute inset-0 z-10 overflow-hidden">
                                <motion.div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${listImg})` }}
                                    whileHover={{ scale: 1.1 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                            </div>
                            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                    <History className="text-amber-500" /> Mur des Pépites
                                </h3>
                                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Consultez les idées déjà partagées ({ideas.length}).</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {view === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="card-premium p-8 space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-800">Nouvelle Idée</h3>
                            <button onClick={() => setView('selection')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <ArrowLeft size={16} /> Retour
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <textarea
                                value={newIdea}
                                onChange={(e) => setNewIdea(e.target.value)}
                                placeholder="Écrivez librement votre idée ici..."
                                className="w-full p-6 bg-white border border-slate-200 rounded-2xl h-48 outline-none focus:ring-2 focus:ring-amber-500 transition-all text-lg shadow-inner"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!newIdea.trim()}
                                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <Send size={20} /> Partager la pépite
                            </button>
                        </form>
                    </motion.div>
                )}

                {view === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-800">Le Mur des Pépites ({ideas.length})</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setView('form')} className="flex items-center gap-2 text-amber-600 font-bold hover:underline">
                                    <PlusCircle size={18} /> Ajouter une idée
                                </button>
                                <button onClick={() => setView('selection')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <ArrowLeft size={16} /> Retour
                                </button>
                            </div>
                        </div>

                        {ideas.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <Sparkles className="mx-auto text-amber-300 mb-4" size={48} />
                                <p className="text-slate-400 italic">Aucune idée pour le moment. Soyez le premier !</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {ideas.map((idea) => (
                                    <motion.div
                                        key={idea.id}
                                        layout
                                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group"
                                    >
                                        <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                                            {idea.content}
                                        </p>
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => onDelete(idea.id)}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IdeaBox;
