import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import {
  generateStreetReport, generateTechnicalReport, generateHeatingReport,
  generateRenovationReport, generateChecklistReport,
  generateCoproReport, generatePigeReport, generateDpeReport, generateRedactionReport,
  generateProspectionReport, getApiStatus
} from './services/geminiService';
import InputSection from './components/InputSection';
import ReportDisplay from './components/ReportDisplay';
import TechnicalReportDisplay from './components/TechnicalReportDisplay';
import HeatingReportDisplay from './components/HeatingReportDisplay';
import RenovationReportDisplay from './components/RenovationReportDisplay';
import ChecklistReportDisplay from './components/ChecklistReportDisplay';
import CoproReportDisplay from './components/CoproReportDisplay';
import PigeReportDisplay from './components/PigeReportDisplay';
import DPEReportDisplay from './components/DPEReportDisplay';
import RedactionReportDisplay from './components/RedactionReportDisplay';
import ProspectionReportDisplay from './components/ProspectionReportDisplay';
import ProspectionDashboard from './components/ProspectionDashboard';
import MandateWatchDisplay from './components/MandateWatchDisplay';
import EstimationWorkflow from './components/EstimationWorkflow';
import CalculatorTools from './components/CalculatorTools';
import RedactionWorkflow from './components/RedactionWorkflow';
import HomeDashboard from './components/HomeDashboard';
import IdeaBox from './components/IdeaBox';

import {
  LoadingState, StreetReport, TechnicalReport, HeatingReport,
  RenovationReport, ChecklistReport, CoproReport, PigeReport,
  DpeReport, RedactionReport, ProspectionReport, AnalysisMode, ProspectionLog, ProspectionArchive, Idea
} from './types';
import { Printer, MapPin, AlertCircle, Zap, Flame, PaintRoller, ClipboardList, Building, PhoneCall, Leaf, PenTool, Map, LayoutDashboard, Home } from 'lucide-react';

// Helper for robust parsing
const safeJsonParse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("Simple JSON parse failed, attempting fallback extraction...");
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const extracted = jsonString.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted);
      } catch (e2) {
        throw new Error("Échec du parsing JSON même après extraction.");
      }
    }
    throw e;
  }
};

function App() {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [mode, setMode] = useState<AnalysisMode>('home');

  // Data States
  const [streetData, setStreetData] = useState<StreetReport | null>(null);
  const [techData, setTechData] = useState<TechnicalReport | null>(null);
  const [heatingData, setHeatingData] = useState<HeatingReport | null>(null);
  const [renovationData, setRenovationData] = useState<RenovationReport | null>(null);
  const [checklistData, setChecklistData] = useState<ChecklistReport | null>(null);
  const [coproData, setCoproData] = useState<CoproReport | null>(null);
  const [pigeData, setPigeData] = useState<PigeReport | null>(null);
  const [dpeData, setDpeData] = useState<DpeReport | null>(null);
  const [redactionData, setRedactionData] = useState<RedactionReport | null>(null);
  const [prospectionData, setProspectionData] = useState<ProspectionReport | null>(null);

  // Prospection History State (Local Database)
  const [prospectionHistory, setProspectionHistory] = useState<ProspectionLog[]>([]);
  const [prospectionArchives, setProspectionArchives] = useState<ProspectionArchive[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // 1. Load data & archives & ideas on mount
  useEffect(() => {
    // ... prospection history loading ...
    const saved = localStorage.getItem('prospection_data');
    if (saved) {
      try {
        const rawData = JSON.parse(saved);
        if (Array.isArray(rawData)) {
          const cleanData = rawData.map((item: any, index: number) => ({
            ...item,
            id: item.id || (Date.now() + index),
            mois: item.mois ? item.mois.trim() : "Mois Inconnu",
            zone: item.zone || "Zone Inconnue"
          }));
          setProspectionHistory(cleanData);
        }
      } catch (e) { }
    }

    const savedArchives = localStorage.getItem('prospection_archives');
    if (savedArchives) {
      try { setProspectionArchives(JSON.parse(savedArchives)); } catch (e) { }
    }

    const savedIdeas = localStorage.getItem('idea_box_data');
    if (savedIdeas) {
      try { setIdeas(JSON.parse(savedIdeas)); } catch (e) { }
    }
    const status = getApiStatus();
    console.log("--- Action Immobilier IA Diagnostic ---");
    console.log("API Status:", status);
    console.log("---------------------------------------");
  }, []);

  // 2. Auto-save history whenever it changes
  useEffect(() => {
    if (prospectionHistory.length > 0) {
      localStorage.setItem('prospection_data', JSON.stringify(prospectionHistory));
    } else {
      const saved = localStorage.getItem('prospection_data');
      if (saved && JSON.parse(saved).length > 0 && prospectionHistory.length === 0) {
        // Prevent accidental wipe on very first render
      } else {
        localStorage.setItem('prospection_data', JSON.stringify(prospectionHistory));
      }
    }
  }, [prospectionHistory]);

  // Input Memory (to retry)
  const [lastInput, setLastInput] = useState<string>('');
  const [lastFile, setLastFile] = useState<{ data: string, mimeType: string } | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    setLoadingState(LoadingState.IDLE);
    setError(null);
  };

  const getCurrentMonthName = () => {
    const today = new Date();
    const monthName = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  // --- DASHBOARD FUNCTIONS ---

  const handleStartMonth = () => {
    const capitalizedMonth = getCurrentMonthName();

    setProspectionHistory(prev => {
      const alreadyExists = prev.some(log => log.mois === capitalizedMonth && log.zone === 'SYSTEM_INIT_MONTH');
      if (alreadyExists) return prev;

      const initLog: ProspectionLog = {
        id: Date.now(),
        zone: 'SYSTEM_INIT_MONTH',
        type: 'boitage',
        date: new Date().toISOString().split('T')[0],
        mois: capitalizedMonth
      };
      return [initLog, ...prev];
    });
  };

  const handleDeleteMonth = (monthToDelete: string) => {
    // Trim keys to avoid mismatch
    const cleanMonthToDelete = monthToDelete.trim();
    if (window.confirm(`Voulez-vous vraiment vider toutes les données pour : ${cleanMonthToDelete} ?`)) {
      setProspectionHistory(prev => prev.filter(log => {
        const logMonth = (log.mois || '').trim();
        if (logMonth !== cleanMonthToDelete) return true;
        // Keep the header
        if (log.zone === 'SYSTEM_INIT_MONTH') return true;
        return false;
      }));
    }
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm("Supprimer cette entrée définitivement ?")) {
      setProspectionHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleResetCampaign = () => {
    if (window.confirm("Attention : Cela va effacer TOUT l'historique. Continuer ?")) {
      setProspectionHistory([]);
    }
  };

  const handleArchiveAndReset = () => {
    if (window.confirm("Confirmer la clôture de la campagne ? Les données actuelles seront archivées.")) {
      const newArchive: ProspectionArchive = {
        archivedAt: new Date().toISOString(),
        data: prospectionHistory
      };
      const updatedArchives = [newArchive, ...prospectionArchives];
      setProspectionArchives(updatedArchives);
      localStorage.setItem('prospection_archives', JSON.stringify(updatedArchives));
      setProspectionHistory([]);
    }
  };

  const handleDeleteArchive = (index: number) => {
    if (window.confirm("Supprimer cette archive définitivement ?")) {
      const updated = prospectionArchives.filter((_, i) => i !== index);
      setProspectionArchives(updated);
      localStorage.setItem('prospection_archives', JSON.stringify(updated));
    }
  };

  // --- END DASHBOARD FUNCTIONS ---

  const handleAddIdea = (content: string) => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString()
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    localStorage.setItem('idea_box_data', JSON.stringify(updated));
  };

  const handleDeleteIdea = (id: string) => {
    if (!window.confirm("Supprimer cette pépite ?")) return;
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    localStorage.setItem('idea_box_data', JSON.stringify(updated));
  };

  const handleGenerate = async (input: string, file?: { data: string, mimeType: string }) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setLastInput(input);
    setLastFile(file);

    try {
      let res = "{}";

      if (mode === 'street') {
        res = await generateStreetReport(input);
        setStreetData(safeJsonParse(res));
      } else if (mode === 'technical') {
        res = await generateTechnicalReport(input);
        setTechData(safeJsonParse(res));
      } else if (mode === 'heating') {
        res = await generateHeatingReport(input);
        setHeatingData(safeJsonParse(res));
      } else if (mode === 'renovation') {
        res = await generateRenovationReport(input);
        setRenovationData(safeJsonParse(res));
      } else if (mode === 'checklist') {
        res = await generateChecklistReport(input);
        setChecklistData(safeJsonParse(res));
      } else if (mode === 'copro') {
        res = await generateCoproReport(input, file);
        setCoproData(safeJsonParse(res));
      } else if (mode === 'pige') {
        res = await generatePigeReport(input, file);
        setPigeData(safeJsonParse(res));
      } else if (mode === 'dpe') {
        res = await generateDpeReport(input, file);
        setDpeData(safeJsonParse(res));
      } else if (mode === 'redaction') {
        res = await generateRedactionReport(input);
        setRedactionData(safeJsonParse(res));
      } else if (mode === 'prospection') {
        res = await generateProspectionReport(input);
        const parsed: any = safeJsonParse(res); // Use any for intermediate parsing to check intent
        setProspectionData(parsed);

        // --- INTELLIGENT DATA SAVING ---
        if (parsed.intent === 'log_prospection' && parsed.data && parsed.data.zone) {

          // Use the normalized data from AI (it handles date and month deduction now)
          const newEntry: ProspectionLog = {
            id: Date.now(),
            zone: parsed.data.zone, // Normalized address
            type: parsed.data.type || 'boitage',
            date: parsed.data.date || new Date().toISOString().split('T')[0],
            mois: parsed.data.mois || getCurrentMonthName() // Fallback if AI fails, but AI should provide it
          };

          // Capitalize first letter of month just in case
          if (newEntry.mois) {
            newEntry.mois = newEntry.mois.charAt(0).toUpperCase() + newEntry.mois.slice(1);
          }

          setProspectionHistory(prev => [newEntry, ...prev]);

        } else if (parsed.intent === 'delete_request' && parsed.target) {
          // *** NORMALIZED DELETION LOGIC ***
          const target = parsed.target.toLowerCase();
          const scope = parsed.scope; // 'single' or 'month'

          setProspectionHistory(prev => prev.filter(item => {
            // Always keep system headers
            if (item.zone === 'SYSTEM_INIT_MONTH') return true;

            if (scope === 'month') {
              // Check if normalized month matches target
              return !item.mois.toLowerCase().includes(target);
            } else {
              // Check if normalized zone/street matches target
              return !item.zone.toLowerCase().includes(target);
            }
          }));

        } else if (parsed.intent === 'reset_campaign') {
          setProspectionHistory([]);
        }
      }

      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error("ERROR GENERATING/PARSING REPORT:", err);
      const errorMessage = err.message || "Erreur inconnue";
      const isJsonError = errorMessage.toLowerCase().includes('json');
      setError(
        isJsonError
          ? `Format IA incorrect (JSON invalide). Reçu : ${errorMessage}`
          : `Une erreur technique est survenue : ${errorMessage}`
      );
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handlePrint = () => window.print();

  const getHeaderIcon = () => {
    switch (mode) {
      case 'street': return <MapPin className="w-3 h-3" />;
      case 'technical': return <Zap className="w-3 h-3" />;
      case 'heating': return <Flame className="w-3 h-3" />;
      case 'renovation': return <PaintRoller className="w-3 h-3" />;
      case 'checklist': return <ClipboardList className="w-3 h-3" />;
      case 'copro': return <Building className="w-3 h-3" />;
      case 'pige': return <PhoneCall className="w-3 h-3" />;
      case 'dpe': return <Leaf className="w-3 h-3" />;
      case 'redaction': return <PenTool className="w-3 h-3" />;
      case 'prospection': return <Map className="w-3 h-3" />;
      case 'dashboard': return <LayoutDashboard className="w-3 h-3" />;
    }
  };

  const getMainTitle = () => {
    switch (mode) {
      case 'home': return "Accueil Expert";
      case 'street': return streetData?.address || "Dossier Quartier";
      case 'technical': return "Audit Technique";
      case 'heating': return "Analyse Thermique";
      case 'renovation': return "Projet Valorisation";
      case 'checklist': return "Vérifications Terrain";
      case 'copro': return "Analyse Copropriété";
      case 'pige': return "Stratégie Pige";
      case 'dpe': return "Amélioration DPE";
      case 'redaction': return "Contenus Rédigés";
      case 'prospection': return "Gestion de Zone";
      case 'estimation_workflow': return "Préparation Estimation";
      case 'calculator': return "Outils Financiers";
      case 'idea_box': return "Boîte à Idées";
      case 'dashboard': return "Tableau de Bord";
      default: return "Action Immobilier";
    }
  };

  return (
    <Layout currentMode={mode} onModeChange={handleModeChange}>
      {/* Only show InputSection for modes that use the chatbot */}
      {!['home', 'estimation_workflow', 'calculator', 'mandate_watch', 'dashboard', 'redaction', 'idea_box'].includes(mode) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <InputSection
            onGenerate={handleGenerate}
            loadingState={loadingState}
            mode={mode}
            onModeChange={handleModeChange}
          />
        </div>
      )}

      <div className="mt-8">
        {/* STANDALONE MODES (Priority) */}
        {mode === 'home' && (
          <div className="max-w-7xl mx-auto">
            <HomeDashboard onNavigate={handleModeChange} />
          </div>
        )}

        {mode === 'estimation_workflow' && (
          <div className="max-w-7xl mx-auto">
            <EstimationWorkflow />
          </div>
        )}

        {mode === 'calculator' && (
          <div className="max-w-7xl mx-auto">
            <CalculatorTools />
          </div>
        )}

        {mode === 'mandate_watch' && (
          <div className="max-w-7xl mx-auto">
            <MandateWatchDisplay />
          </div>
        )}

        {mode === 'redaction' && (
          <div className="max-w-7xl mx-auto">
            <RedactionWorkflow />
          </div>
        )}

        {mode === 'idea_box' && (
          <div className="max-w-7xl mx-auto">
            <IdeaBox
              ideas={ideas}
              onSubmit={handleAddIdea}
              onDelete={handleDeleteIdea}
            />
          </div>
        )}

        {mode === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-16">
            <ProspectionDashboard
              history={prospectionHistory}
              archives={prospectionArchives}
              onArchiveAndReset={handleArchiveAndReset}
              onDeleteMonth={handleDeleteMonth}
              onStartMonth={handleStartMonth}
              onDeleteItem={handleDeleteItem}
              onDeleteArchive={handleDeleteArchive}
            />
          </div>
        )}

        {/* GENERATOR MODES (Common Wrapper) */}
        {!['home', 'estimation_workflow', 'calculator', 'mandate_watch', 'dashboard', 'redaction', 'idea_box'].includes(mode) && (
          <>
            {loadingState === LoadingState.LOADING && (
              <div className="max-w-3xl mx-auto py-20 md:py-32 px-4 text-center">
                <div className="animate-pulse space-y-6 md:space-y-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce mx-2 [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-slate-800 italic">
                    Analyse du document et rédaction en cours...
                  </h3>
                </div>
              </div>
            )}

            {loadingState === LoadingState.ERROR && (
              <div className="max-w-3xl mx-auto py-12 px-4">
                <div className="bg-red-50 border border-red-100 rounded-lg p-8 text-center text-red-800">
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                  <h3 className="font-serif text-xl mb-2">Une erreur est survenue</h3>
                  <p className="text-red-600 mb-6">{error}</p>
                </div>
              </div>
            )}

            {loadingState === LoadingState.SUCCESS && (
              <div className="max-w-6xl mx-auto py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6 border-b border-slate-100 pb-6 md:pb-8">
                  <div>
                    <div className="flex items-center gap-2 text-primary-600 mb-2 md:mb-3 font-bold tracking-widest text-[10px] md:text-xs uppercase">
                      {getHeaderIcon()} RAPPORT GÉNÉRÉ
                    </div>
                    <h2 className="text-2xl md:text-5xl font-serif text-slate-900 leading-tight">
                      {getMainTitle()}
                    </h2>
                  </div>
                  <button onClick={handlePrint} className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg transition-colors font-medium text-sm shadow-lg print-hide">
                    <Printer className="w-4 h-4" /> Imprimer
                  </button>
                </div>

                {mode === 'street' && streetData && <ReportDisplay data={streetData} />}
                {mode === 'technical' && techData && <TechnicalReportDisplay data={techData} />}
                {mode === 'heating' && heatingData && <HeatingReportDisplay data={heatingData} />}
                {mode === 'renovation' && renovationData && <RenovationReportDisplay data={renovationData} />}
                {mode === 'checklist' && checklistData && <ChecklistReportDisplay data={checklistData} />}
                {mode === 'copro' && coproData && <CoproReportDisplay data={coproData} />}
                {mode === 'pige' && pigeData && <PigeReportDisplay data={pigeData} />}
                {mode === 'dpe' && dpeData && <DPEReportDisplay data={dpeData} />}
                {mode === 'prospection' && prospectionData && (
                  <ProspectionReportDisplay data={prospectionData} history={prospectionHistory} onReset={handleResetCampaign} />
                )}

                <div className="mt-12 md:mt-20 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
                  <div className="flex justify-center items-center gap-2 mb-2 opacity-50">
                    <span className="font-serif font-bold text-slate-900 uppercase">Action Immobilier</span>
                  </div>
                  <p>Document d'aide à la décision généré par IA.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default App;