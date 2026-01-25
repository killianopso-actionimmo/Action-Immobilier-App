import React from 'react';
import { ProspectionReport, ProspectionLog } from '../types';
import { Map, Save, Info, RefreshCw, CheckCircle2, Calendar, FolderOpen, Mail, User, Box, Trash2 } from 'lucide-react';

interface Props {
  data: ProspectionReport;
  history: ProspectionLog[];
  onReset: () => void;
}

const ProspectionReportDisplay: React.FC<Props> = ({ data, history, onReset }) => {
  const { intent } = data;
  const { zone, type, date, mois } = data.data || {};

  // Group history by Month
  const groupedByMonth = history.reduce((acc, log) => {
    const month = log.mois || "Date inconnue";
    if (!acc[month]) acc[month] = [];
    acc[month].push(log);
    return acc;
  }, {} as Record<string, ProspectionLog[]>);

  // Sort months implies we might need logic if 'mois' is just a string name. 
  // For now we rely on the insertion order (newest first in history, so recent months top) or string keys.

  const renderActionCard = () => {
    if (intent === 'log_prospection') {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Save size={32} />
          </div>
          <div className="flex-1">
            <h4 className="font-serif text-xl text-emerald-900 font-bold mb-1">Données Enregistrées</h4>
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div>
                 <span className="text-xs uppercase text-emerald-700 font-bold">Zone</span>
                 <p className="text-zinc-800 font-medium">{zone || "Non spécifié"}</p>
               </div>
               <div>
                 <span className="text-xs uppercase text-emerald-700 font-bold">Action</span>
                 <p className="text-zinc-800 font-medium capitalize flex items-center gap-2">
                   {type === 'courrier' && <Mail size={14} />}
                   {type === 'porte_a_porte' && "Porte à Porte"}
                   {type === 'boitage' && "Boîtage"}
                   {!type && "Prospection"}
                 </p>
               </div>
               <div>
                 <span className="text-xs uppercase text-emerald-700 font-bold">Date</span>
                 <p className="text-zinc-800 font-medium flex items-center gap-2">
                   <Calendar size={14}/> {date || new Date().toLocaleDateString()}
                 </p>
                 {mois && <p className="text-xs text-emerald-600">{mois}</p>}
               </div>
               <div>
                 <span className="text-xs uppercase text-emerald-700 font-bold">Statut</span>
                 <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                   <CheckCircle2 size={16}/> Complété
                 </div>
               </div>
            </div>
          </div>
        </div>
      );
    } 
    
    if (intent === 'reset_campaign') {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-center gap-6">
           <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <RefreshCw size={32} />
          </div>
          <div>
            <h4 className="font-serif text-xl text-blue-900 font-bold mb-1">Nouvelle Campagne</h4>
            <p className="text-blue-800">L'historique a été réinitialisé.</p>
          </div>
        </div>
      );
    }

    // Default Info / Chat
    return (
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 flex items-start gap-4">
         <Info size={24} className="text-zinc-400 mt-1" />
         <div>
           <h4 className="font-bold text-zinc-900 mb-2">Information Système</h4>
           <p className="text-zinc-600 italic">Aucune action d'écriture base de données requise.</p>
         </div>
      </div>
    );
  };

  const renderColumn = (title: string, icon: React.ReactNode, logs: ProspectionLog[], color: string) => (
    <div className={`flex flex-col h-full bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden`}>
      <div className={`p-3 ${color} border-b border-zinc-100 flex items-center gap-2`}>
        {icon}
        <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-zinc-800">{title}</span>
        <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
          {logs.length}
        </span>
      </div>
      <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto bg-zinc-50 flex-grow">
        {logs.length === 0 ? (
          <p className="text-center text-xs text-zinc-400 italic py-4">Aucune activité</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white p-2 rounded border border-zinc-200 shadow-sm text-sm">
              <p className="font-medium text-zinc-900">{log.zone}</p>
              <p className="text-xs text-zinc-500 text-right">{log.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-6xl mx-auto">
      
      {/* 1. Current Action Feedback */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Assistant Message Bubble */}
        <div className="flex gap-4 items-start">
           <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white flex-shrink-0">
             <Map size={20} />
           </div>
           <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-none p-6 shadow-sm">
             <p className="text-lg text-zinc-800 leading-relaxed font-medium">
               "{data.assistant_response}"
             </p>
           </div>
        </div>

        {/* Action Visualization */}
        {renderActionCard()}
      </div>

      {/* 2. Dashboard Section */}
      <div className="border-t border-zinc-200 pt-10">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-serif text-2xl md:text-3xl text-zinc-900">Tableau de Bord Campagne</h3>
           <button 
             onClick={onReset}
             className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-100"
           >
             <Trash2 size={16} />
             Réinitialiser Campagne
           </button>
        </div>

        {/* Render grouped by month */}
        {Object.keys(groupedByMonth).length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 rounded-lg border border-dashed border-zinc-300">
            <FolderOpen size={48} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500 font-medium">Aucun historique de prospection pour le moment.</p>
            <p className="text-xs text-zinc-400">Commencez par dire "J'ai fait la Rue X en boîtage".</p>
          </div>
        ) : (
          Object.keys(groupedByMonth).map((month) => (
            <div key={month} className="mb-10 last:mb-0">
              <h4 className="flex items-center gap-2 text-lg font-bold text-zinc-800 mb-4 pb-2 border-b border-zinc-100">
                <Calendar size={18} className="text-pink-600" />
                {month}
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                {renderColumn(
                  "Boîtage", 
                  <Box size={16} className="text-blue-600" />, 
                  groupedByMonth[month].filter(l => l.type === 'boitage'),
                  "bg-blue-50"
                )}
                {renderColumn(
                  "Porte-à-porte", 
                  <User size={16} className="text-emerald-600" />, 
                  groupedByMonth[month].filter(l => l.type === 'porte_a_porte'),
                  "bg-emerald-50"
                )}
                {renderColumn(
                  "Courrier", 
                  <Mail size={16} className="text-amber-600" />, 
                  groupedByMonth[month].filter(l => l.type === 'courrier'),
                  "bg-amber-50"
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ProspectionReportDisplay;