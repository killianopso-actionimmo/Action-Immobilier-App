import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, DoorOpen, FileText, Plus, Calendar } from 'lucide-react';
import { ProspectionLog } from '../types';

interface QuickProspectionFormProps {
    onAddProspection: (entry: ProspectionLog) => void;
}

type ProspectionType = 'boitage' | 'porte_a_porte' | 'courrier';

const QuickProspectionForm: React.FC<QuickProspectionFormProps> = ({ onAddProspection }) => {
    const [selectedType, setSelectedType] = useState<ProspectionType | null>(null);
    const [zone, setZone] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const getCurrentMonthName = () => {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return months[new Date().getMonth()];
    };

    const handleSubmit = () => {
        if (!selectedType || !zone.trim()) {
            alert('Veuillez sélectionner un type et renseigner une zone');
            return;
        }

        const newEntry: ProspectionLog = {
            id: Date.now(),
            zone: zone.trim(),
            type: selectedType,
            date: date,
            mois: getCurrentMonthName()
        };

        onAddProspection(newEntry);

        // Reset form
        setZone('');
        setSelectedType(null);
        setDate(new Date().toISOString().split('T')[0]);
    };

    const typeButtons = [
        { type: 'boitage' as ProspectionType, label: 'Boîtage', icon: Mail, color: 'from-blue-500 to-blue-600' },
        { type: 'porte_a_porte' as ProspectionType, label: 'Porte-à-porte', icon: DoorOpen, color: 'from-purple-500 to-purple-600' },
        { type: 'courrier' as ProspectionType, label: 'Courrier', icon: FileText, color: 'from-pink-500 to-pink-600' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-6 border border-blue-100"
        >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Ajout Rapide (sans IA)
            </h3>

            {/* Type Selection Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {typeButtons.map(({ type, label, icon: Icon, color }) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`
              relative p-4 rounded-xl transition-all duration-200
              ${selectedType === type
                                ? `bg-gradient-to-br ${color} text-white shadow-lg scale-105`
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                            }
            `}
                    >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${selectedType === type ? 'text-white' : 'text-slate-600'}`} />
                        <span className="text-sm font-medium">{label}</span>
                        {selectedType === type && (
                            <motion.div
                                layoutId="selected-indicator"
                                className="absolute inset-0 border-2 border-white rounded-xl"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Form Fields */}
            {selectedType && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                >
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            📍 Zone / Adresse
                        </label>
                        <input
                            type="text"
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                            placeholder="Ex: rue Victor Hugo, Lille"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter au Dashboard
                    </button>
                </motion.div>
            )}

            {!selectedType && (
                <p className="text-sm text-slate-500 text-center mt-2">
                    Sélectionnez un type d'action pour commencer
                </p>
            )}
        </motion.div>
    );
};

export default QuickProspectionForm;
