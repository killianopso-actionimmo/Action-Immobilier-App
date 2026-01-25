import React from 'react';
import { ChecklistReport } from '../types';
import { 
  ClipboardList, 
  CheckSquare, 
  MessageCircle, 
  FileText, 
  Target, 
  ShieldAlert,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface ChecklistReportDisplayProps {
  data: ChecklistReport;
}

const ChecklistReportDisplay: React.FC<ChecklistReportDisplayProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000 print:space-y-6">
      
      {/* Internal Use Warning */}
      <div className="bg-amber-100 border-l-4 border-amber-500 p-4 text-amber-800 flex items-center justify-center gap-2 print:hidden">
        <ShieldAlert size={20} />
        <span className="font-bold uppercase tracking-wider text-xs md:text-sm">Usage Interne Uniquement - Aide-mémoire Agent</span>
      </div>

      <div className="bg-white border-2 border-zinc-200 rounded-lg p-6 md:p-10 shadow-sm relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-zinc-100 rounded-full blur-[60px] opacity-50 translate-x-1/3 -translate-y-1/3"></div>

        <div className="relative z-10 flex items-center gap-4 mb-8 border-b-2 border-zinc-100 pb-6">
           <div className="p-3 bg-zinc-900 text-white rounded shadow-md">
             <ClipboardList size={32} />
           </div>
           <div>
             <h2 className="font-serif text-3xl font-bold text-zinc-900">Fiche de Route</h2>
             <p className="text-zinc-500 font-medium uppercase tracking-wide text-xs">Vérifications Terrain & Prise de Mandat</p>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative z-10">
          
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* Physical Checks */}
            <div>
              <h3 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider mb-4 text-sm">
                <CheckSquare size={18} className="text-pink-600" />
                Le Tour Physique (Yeux ouverts)
              </h3>
              <ul className="space-y-3">
                {data.physical_checks.map((check, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-zinc-50 rounded border border-zinc-100 hover:bg-zinc-100 transition-colors cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-zinc-300 bg-white group-hover:border-pink-500 flex-shrink-0 mt-0.5"></div>
                    <span className="text-zinc-700 font-medium text-sm leading-relaxed">{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div>
              <h3 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider mb-4 text-sm">
                <FileText size={18} className="text-blue-600" />
                Documents à exiger (Preuves)
              </h3>
               <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-4">
                 <ul className="space-y-2">
                  {data.documents_needed.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 text-blue-900 text-sm font-medium">
                      <FileCheck size={16} className="text-blue-500" />
                      {doc}
                    </li>
                  ))}
                 </ul>
               </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* Shock Questions */}
            <div>
               <h3 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider mb-4 text-sm">
                <MessageCircle size={18} className="text-emerald-600" />
                Questions "Expert" (Au vendeur)
              </h3>
              <div className="space-y-3">
                {data.shock_questions.map((q, i) => (
                  <div key={i} className="bg-emerald-50/30 border-l-4 border-emerald-500 p-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle size={16} className="text-emerald-600 mt-1 flex-shrink-0" />
                      <p className="text-zinc-800 italic font-serif font-medium text-lg leading-snug">"{q}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy */}
            <div className="bg-zinc-900 text-white p-6 rounded shadow-lg mt-8">
               <h3 className="flex items-center gap-2 font-bold text-pink-400 uppercase tracking-wider mb-3 text-xs">
                <Target size={16} />
                Rappel Stratégique
              </h3>
              <p className="text-xl font-serif leading-relaxed text-center">
                "{data.strategic_reminder}"
              </p>
            </div>

          </div>

        </div>
      </div>
      
      <p className="text-center text-xs text-zinc-400 print:hidden">
        Imprimez cette fiche et prenez-la avec vous lors de la visite.
      </p>

    </div>
  );
};

export default ChecklistReportDisplay;