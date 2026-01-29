import React, { useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { LoadingState } from '../../types';
import NavigationButtons from '../NavigationButtons';

interface StreetAnalysisPageProps {
    onGenerate: (input: string) => void;
    loadingState: LoadingState;
    onGoBack: () => void;
    onGoHome: () => void;
}

const StreetAnalysisPage: React.FC<StreetAnalysisPageProps> = ({
    onGenerate,
    loadingState,
    onGoBack,
    onGoHome
}) => {
    const [address, setAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address.trim()) {
            onGenerate(address);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <NavigationButtons onBack={onGoBack} onHome={onGoHome} />

                {/* Header */}
                <div className="text-center py-12">
                    <MapPin className="w-20 h-20 mx-auto text-white mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-md">
                        Expertise Quartier
                    </h1>
                    <p className="text-xl text-white/90">
                        Analysez n'importe quel quartier en 30 secondes
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📍 Adresse du bien
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ex: 15 Rue de la Paix, Paris"
                                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                disabled={loadingState === LoadingState.LOADING}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingState === LoadingState.LOADING || !address.trim()}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loadingState === LoadingState.LOADING ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyse en cours...
                                </>
                            ) : (
                                <>
                                    <Search className="w-6 h-6" />
                                    Analyser le Quartier
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StreetAnalysisPage;
