import React, { useState, useRef } from 'react';
import { PhoneCall, Search, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { LoadingState } from '../../types';
import NavigationButtons from '../NavigationButtons';

interface PigeAnalysisPageProps {
    onGenerate: (input: string, file?: { data: string, mimeType: string }) => void;
    loadingState: LoadingState;
    onGoBack: () => void;
    onGoHome: () => void;
}

const PigeAnalysisPage: React.FC<PigeAnalysisPageProps> = ({
    onGenerate,
    loadingState,
    onGoBack,
    onGoHome
}) => {
    const [notes, setNotes] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!notes.trim() && !selectedFile) return;

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                onGenerate(notes, { data: base64Data, mimeType: selectedFile.type });
            };
            reader.readAsDataURL(selectedFile);
        } else {
            onGenerate(notes);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <NavigationButtons onBack={onGoBack} onHome={onGoHome} />

                <div className="text-center py-12">
                    <PhoneCall className="w-20 h-20 mx-auto text-white mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-md">
                        Pige Concurrentielle
                    </h1>
                    <p className="text-xl text-white/90">
                        Analysez les annonces de vos concurrents
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Upload Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📸 Capture d'écran de l'annonce
                            </label>
                            {!selectedFile ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                                >
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">
                                        Glissez une image ou <span className="text-green-600 underline">cliquez pour importer</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG supportés</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded">
                                            <ImageIcon size={20} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={clearFile} className="p-1 hover:bg-gray-200 rounded-full">
                                        <X size={16} className="text-gray-400" />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔗 Lien ou texte de l'annonce
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Collez le lien ou le texte de l'annonce..."
                                className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all min-h-[120px] resize-none"
                                disabled={loadingState === LoadingState.LOADING}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingState === LoadingState.LOADING || (!notes.trim() && !selectedFile)}
                            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loadingState === LoadingState.LOADING ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyse en cours...
                                </>
                            ) : (
                                <>
                                    <Search className="w-6 h-6" />
                                    Analyser l'Annonce
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PigeAnalysisPage;
