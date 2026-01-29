import React, { useState } from 'react';
import { Flame, Thermometer, Loader2 } from 'lucide-react';
import { LoadingState } from '../../types';
import NavigationButtons from '../NavigationButtons';

interface HeatingAnalysisPageProps {
    onGenerate: (input: string) => void;
    loadingState: LoadingState;
    onGoBack: () => void;
    onGoHome: () => void;
}

const HeatingAnalysisPage: React.FC<HeatingAnalysisPageProps> = ({
    onGenerate,
    loadingState,
    onGoBack,
    onGoHome
}) => {
    const [installation, setInstallation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (installation.trim()) {
            onGenerate(installation);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-600 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <NavigationButtons onBack={onGoBack} onHome={onGoHome} />

                <div className="text-center py-12">
                    <Flame className="w-20 h-20 mx-auto text-white mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-md">
                        Analyse Chauffage
                    </h1>
                    <p className="text-xl text-white/90">
                        Évaluez le système de chauffage
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔥 Description de l'installation
                            </label>
                            <textarea
                                value={installation}
                                onChange={(e) => setInstallation(e.target.value)}
                                placeholder="Ex: Chaudière Saunier Duval gaz, Cumulus Atlantic 200L, Radiateurs fonte..."
                                className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all min-h-[150px] resize-none"
                                disabled={loadingState === LoadingState.LOADING}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingState === LoadingState.LOADING || !installation.trim()}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loadingState === LoadingState.LOADING ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyse en cours...
                                </>
                            ) : (
                                <>
                                    <Thermometer className="w-6 h-6" />
                                    Analyser le Chauffage
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HeatingAnalysisPage;
