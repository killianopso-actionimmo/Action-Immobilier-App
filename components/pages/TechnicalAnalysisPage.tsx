import React, { useState } from 'react';
import { Zap, Wrench, Loader2 } from 'lucide-react';
import { LoadingState } from '../../types';
import NavigationButtons from '../NavigationButtons';

interface TechnicalAnalysisPageProps {
    onGenerate: (input: string) => void;
    loadingState: LoadingState;
    onGoBack: () => void;
    onGoHome: () => void;
}

const TechnicalAnalysisPage: React.FC<TechnicalAnalysisPageProps> = ({
    onGenerate,
    loadingState,
    onGoBack,
    onGoHome
}) => {
    const [equipment, setEquipment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (equipment.trim()) {
            onGenerate(equipment);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-500 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <NavigationButtons onBack={onGoBack} onHome={onGoHome} />

                <div className="text-center py-12">
                    <Zap className="w-20 h-20 mx-auto text-white mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-md">
                        Audit Technique
                    </h1>
                    <p className="text-xl text-white/90">
                        Évaluez l'état des équipements du bien
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔧 Liste des équipements
                            </label>
                            <textarea
                                value={equipment}
                                onChange={(e) => setEquipment(e.target.value)}
                                placeholder="Ex: Tableau électrique, VMC, Isolation, Plomberie, Fenêtres..."
                                className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all min-h-[150px] resize-none"
                                disabled={loadingState === LoadingState.LOADING}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingState === LoadingState.LOADING || !equipment.trim()}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loadingState === LoadingState.LOADING ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyse en cours...
                                </>
                            ) : (
                                <>
                                    <Wrench className="w-6 h-6" />
                                    Générer l'Audit
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TechnicalAnalysisPage;
