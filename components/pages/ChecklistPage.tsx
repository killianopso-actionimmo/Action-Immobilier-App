import React, { useState } from 'react';
import { ClipboardList, CheckCircle, Loader2 } from 'lucide-react';
import { LoadingState } from '../../types';
import NavigationButtons from '../NavigationButtons';

interface ChecklistPageProps {
    onGenerate: (input: string) => void;
    loadingState: LoadingState;
    onGoBack: () => void;
    onGoHome: () => void;
}

const ChecklistPage: React.FC<ChecklistPageProps> = ({
    onGenerate,
    loadingState,
    onGoBack,
    onGoHome
}) => {
    const [propertyType, setPropertyType] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (propertyType.trim()) {
            onGenerate(propertyType);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <NavigationButtons onBack={onGoBack} onHome={onGoHome} />

                <div className="text-center py-12">
                    <ClipboardList className="w-20 h-20 mx-auto text-white mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-md">
                        Checklist Visite
                    </h1>
                    <p className="text-xl text-white/90">
                        Ne ratez aucun détail lors de vos visites
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🏡 Type de bien
                            </label>
                            <textarea
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                placeholder="Ex: Maison 1970 avec jardin, Appartement Haussmannien, Studio moderne..."
                                className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all min-h-[120px] resize-none"
                                disabled={loadingState === LoadingState.LOADING}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingState === LoadingState.LOADING || !propertyType.trim()}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loadingState === LoadingState.LOADING ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Génération en cours...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-6 h-6" />
                                    Générer la Checklist
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChecklistPage;
