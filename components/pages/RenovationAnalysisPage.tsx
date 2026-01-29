import React, { useState } from 'react';
import { PaintRoller, Sparkles, Loader2 } from 'lucide-react';
import { LoadingState } from '../../types';
import NavigationButtons from '../NavigationButtons';

interface RenovationAnalysisPageProps {
    onGenerate: (input: string) => void;
    loadingState: LoadingState;
    onGoBack: () => void;
    onGoHome: () => void;
}

const RenovationAnalysisPage: React.FC<RenovationAnalysisPageProps> = ({
    onGenerate,
    loadingState,
    onGoBack,
    onGoHome
}) => {
    const [condition, setCondition] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (condition.trim()) {
            onGenerate(condition);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <NavigationButtons onBack={onGoBack} onHome={onGoHome} />

                <div className="text-center py-12">
                    <PaintRoller className="w-20 h-20 mx-auto text-white mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-md">
                        Conseils Travaux
                    </h1>
                    <p className="text-xl text-white/90">
                        Optimisez le potentiel du bien
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🏠 État actuel du bien
                            </label>
                            <textarea
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                placeholder="Ex: Salon sombre, moquette murale, cuisine chêne rustique, salle de bain vieillotte..."
                                className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all min-h-[150px] resize-none"
                                disabled={loadingState === LoadingState.LOADING}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingState === LoadingState.LOADING || !condition.trim()}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loadingState === LoadingState.LOADING ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyse en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    Générer les Conseils
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RenovationAnalysisPage;
