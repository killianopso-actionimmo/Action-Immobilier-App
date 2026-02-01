import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Scale, BookOpen, X } from 'lucide-react';
import { juridicalData, JuridicalItem } from '../data/juridique';

const JuridicalBase: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedItem, setSelectedItem] = useState<JuridicalItem | null>(null);

    const categories = ['all', 'Loi Hoguet', 'Loi Alur', 'Diagnostics', 'Copropriété', 'Bail'];

    // Filtrage local (zéro API)
    const filteredData = useMemo(() => {
        return juridicalData.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-black p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Scale className="w-12 h-12 mx-auto text-cyan-400 mb-4 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
                    <h1 className="text-3xl font-bold text-white mb-2">Base Juridique</h1>
                    <p className="text-gray-400">Recherche locale instantanée</p>
                </div>

                {/* Search Bar */}
                <div className="glass-card p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher une loi, un diagnostic..."
                            className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto mb-6 pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400'
                                    : 'bg-gray-900/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            {cat === 'all' ? 'Tout' : cat}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <p className="text-gray-500 text-sm mb-4">
                    {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''}
                </p>

                {/* Results List */}
                <div className="space-y-4">
                    {filteredData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedItem(item)}
                            className="glass-card-hover p-4 cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <span className="text-xs text-cyan-400 font-medium">{item.category}</span>
                                    <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                                </div>
                                <BookOpen className="w-5 h-5 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">{item.content}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {item.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-900/50 border border-gray-700 rounded text-xs text-gray-400"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Aucun résultat trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedItem(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="text-xs text-cyan-400 font-medium">{selectedItem.category}</span>
                                <h2 className="text-2xl font-bold text-white mt-1">{selectedItem.title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 hover:bg-gray-900/50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <p className="text-gray-300 leading-relaxed mb-4">{selectedItem.content}</p>

                        <div className="flex flex-wrap gap-2">
                            {selectedItem.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-sm text-cyan-400"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default JuridicalBase;
