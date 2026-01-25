import React, { useState, useRef } from 'react';
import { Search, Loader2, ArrowRight, Zap, MapPin, Flame, PaintRoller, ClipboardList, Building, PhoneCall, Leaf, PenTool, Upload, X, FileText, Image as ImageIcon, Map, LayoutDashboard, PlusCircle, Trash2 } from 'lucide-react';
import { LoadingState, AnalysisMode, MainTab } from '../types';

interface InputSectionProps {
  onGenerate: (input: string, file?: { data: string, mimeType: string }) => void;
  loadingState: LoadingState;
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, loadingState, mode, onModeChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine current main tab based on mode
  const getMainTab = (): MainTab => {
    if (['street', 'technical', 'heating', 'renovation', 'checklist'].includes(mode)) return 'estimation';
    if (mode === 'copro') return 'copro';
    if (mode === 'pige') return 'pige';
    if (mode === 'dpe') return 'dpe';
    if (mode === 'redaction') return 'redaction';
    if (mode === 'prospection') return 'prospection';
    if (mode === 'mandate_watch') return 'mandate_watch';
    if (mode === 'dashboard') return 'dashboard';
    return 'estimation';
  };

  const currentMainTab = getMainTab();
  const allowFileUpload = ['copro', 'pige', 'dpe'].includes(mode);

  const handleMainTabChange = (tab: MainTab) => {
    if (tab === 'estimation') onModeChange('street');
    else if (tab === 'copro') onModeChange('copro');
    else if (tab === 'pige') onModeChange('pige');
    else if (tab === 'dpe') onModeChange('dpe');
    else if (tab === 'redaction') onModeChange('redaction');
    else if (tab === 'prospection') onModeChange('prospection');
    else if (tab === 'mandate_watch') onModeChange('mandate_watch');
    else if (tab === 'dashboard') onModeChange('dashboard');

    // Reset inputs on tab change
    setInputValue('');
    setDeleteValue('');
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (allowFileUpload && e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const mimeType = selectedFile.type;
        onGenerate(inputValue, { data: base64Data, mimeType });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // PROSPECTION ADD LOGIC
      if (mode === 'prospection') {
        onGenerate(`[ADD] ${inputValue}`);
      } else {
        onGenerate(inputValue);
      }
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteValue.trim()) return;
    onGenerate(`[DELETE] ${deleteValue}`);
  };

  const getPlaceholder = () => {
    switch (mode) {
      case 'street': return "Adresse du bien (ex: 15 Rue de la Paix, Paris)...";
      case 'technical': return "Listez les équipements : Tableau électrique, VMC, Isolation...";
      case 'heating': return "Décrivez l'installation : Chaudière Saunier Duval gaz, Cumulus Atlantic 200L...";
      case 'renovation': return "Décrivez l'état : Salon sombre, moquette murale, cuisine chêne rustique...";
      case 'checklist': return "Type de bien (ex: Maison 1970 avec jardin, Appartement Haussmannien...)";
      case 'copro': return "Collez des notes ou importez le PDF du PV d'AG...";
      case 'pige': return "Collez le lien/texte ou importez une capture d'écran...";
      case 'dpe': return "Décrivez les travaux ou importez le rapport DPE (PDF/Photo)...";
      case 'redaction': return "Instructions (ex: Email de compte rendu de visite pour Mr Dupont, maison très lumineuse mais travaux à prévoir)...";
      case 'prospection': return ""; // Handled separately
      default: return "";
    }
  };

  const getAcceptTypes = () => {
    if (mode === 'pige') return "image/*";
    return ".pdf,image/*";
  };

  return (
    <div className="bg-white text-zinc-900 py-8 md:py-12 px-4 print-hide border-b border-zinc-100 shadow-sm">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Logo */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-zinc-900">
            <span className="font-medium">ACTION</span> <span className="text-pink-600 italic">IMMOBILIER</span>
          </h1>
          <p className="mt-1 text-zinc-400 font-light text-xs uppercase tracking-widest">
            Assistant Stratégique IA
          </p>
          <div className="space-y-6 mt-8">
            {/* Main Category Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-zinc-100 -mx-6 px-6 no-scrollbar">
              {[
                { id: 'estimation', label: 'Estimation', icon: ClipboardList },
                { id: 'copro', label: 'Copro', icon: Building },
                { id: 'pige', label: 'Pige', icon: PhoneCall },
                { id: 'dpe', label: 'DPE', icon: Leaf },
                { id: 'redaction', label: 'Rédaction', icon: PenTool },
                { id: 'prospection', label: 'Zone', icon: Map },
                { id: 'mandate_watch', label: 'Veille', icon: Search },
                { id: 'dashboard', label: 'Stats', icon: LayoutDashboard },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleMainTabChange(tab.id as MainTab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm md:text-base font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap shrink-0 ${currentMainTab === tab.id
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                    }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Level 2 Navigation (Only for Estimation) */}
            {currentMainTab === 'estimation' && (
              <div className="flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                {[
                  { id: 'street', label: 'Quartier' },
                  { id: 'technical', label: 'Technique' },
                  { id: 'heating', label: 'Chauffage' },
                  { id: 'renovation', label: 'Travaux' },
                  { id: 'checklist', label: 'Terrain' },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onModeChange(sub.id as AnalysisMode)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${mode === sub.id
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {/* --- PROSPECTION MODE DUAL INPUT --- */}
            {mode === 'prospection' ? (
              <div className="grid md:grid-cols-2 gap-4">
                {/* ADD BAR */}
                <form onSubmit={handleSubmit} className="relative group shadow-lg shadow-emerald-100/50 rounded-xl bg-white border border-emerald-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ajouter une action..."
                    className="w-full pl-5 pr-12 py-4 bg-transparent outline-none text-emerald-900"
                    disabled={loadingState === LoadingState.LOADING}
                  />
                  <button
                    type="submit"
                    disabled={loadingState === LoadingState.LOADING || !inputValue.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loadingState === LoadingState.LOADING ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                  </button>
                </form>

                {/* DELETE BAR */}
                <form onSubmit={handleDeleteSubmit} className="relative group shadow-lg shadow-red-100/50 rounded-xl bg-white border border-red-200 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-50 transition-all">
                  <input
                    type="text"
                    value={deleteValue}
                    onChange={(e) => setDeleteValue(e.target.value)}
                    placeholder="Supprimer..."
                    className="w-full pl-5 pr-12 py-4 bg-transparent outline-none text-red-900"
                    disabled={loadingState === LoadingState.LOADING}
                  />
                  <button
                    type="submit"
                    disabled={loadingState === LoadingState.LOADING || !deleteValue.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loadingState === LoadingState.LOADING ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </form>

              </div>
            ) : mode !== 'dashboard' && (
              // --- STANDARD INPUT FORM ---
              <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
                <div className={`relative group shadow-xl shadow-zinc-200/50 rounded-2xl transition-shadow hover:shadow-lg bg-white overflow-hidden border border-zinc-200 focus-within:border-pink-300 focus-within:ring-4 focus-within:ring-pink-50 flex flex-col`}>

                  {allowFileUpload && (
                    <div
                      className={`p-4 border-b border-zinc-100 transition-colors ${selectedFile ? 'bg-zinc-50' : 'bg-white hover:bg-zinc-50'}`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {!selectedFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-zinc-200 rounded-lg p-6 text-center cursor-pointer hover:border-pink-300 transition-colors flex flex-col items-center gap-2"
                        >
                          <Upload className="text-zinc-400" size={20} />
                          <p className="text-sm text-zinc-500 font-medium">
                            Glissez un fichier ou <span className="text-pink-600 underline">cliquez pour importer</span>
                          </p>
                          <p className="text-xs text-zinc-400">PDF, PNG, JPG supportés</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-white border border-zinc-200 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="bg-pink-100 p-2 rounded">
                              {selectedFile.type.includes('image') ? <ImageIcon size={20} className="text-pink-600" /> : <FileText size={20} className="text-pink-600" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">{selectedFile.name}</p>
                              <p className="text-xs text-zinc-500">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                            </div>
                          </div>
                          <button type="button" onClick={clearFile} className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-600">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept={getAcceptTypes()}
                      />
                    </div>
                  )}

                  {mode === 'street' ? (
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={getPlaceholder()}
                      className="w-full pl-6 pr-20 py-4 bg-transparent outline-none text-zinc-800 placeholder-zinc-400 text-lg"
                      disabled={loadingState === LoadingState.LOADING}
                    />
                  ) : (
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={selectedFile ? "Ajoutez des notes complémentaires (optionnel)..." : getPlaceholder()}
                      className="w-full pl-6 pr-6 py-4 bg-transparent outline-none text-zinc-800 placeholder-zinc-400 text-base min-h-[100px] resize-none"
                      disabled={loadingState === LoadingState.LOADING}
                    />
                  )}

                  <div className={`${mode !== 'street' ? 'p-4 flex justify-end bg-zinc-50 border-t border-zinc-100' : 'absolute right-1.5 top-1.5 bottom-1.5'}`}>
                    <button
                      type="submit"
                      disabled={loadingState === LoadingState.LOADING || (!inputValue.trim() && !selectedFile)}
                      className={`${mode !== 'street' ? 'w-full md:w-auto px-8 py-2' : 'px-6 h-full'} bg-zinc-900 hover:bg-pink-600 text-white rounded-lg font-sans font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      {loadingState === LoadingState.LOADING ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{selectedFile ? 'Lecture...' : 'IA...'}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm">Générer</span>
                          {mode === 'street' && <Search className="w-4 h-4" />}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;