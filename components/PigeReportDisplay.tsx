import React from 'react';
import { PigeReport } from '../types';
import { PhoneCall, Search, Target, MessageSquare } from 'lucide-react';

const PigeReportDisplay: React.FC<{ data: PigeReport }> = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      
      {/* Script Section */}
      <div className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] p-6 md:p-8 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <PhoneCall size={120} />
        </div>
        <h3 className="flex items-center gap-2 text-2xl font-serif text-zinc-900 mb-6 relative z-10">
          <PhoneCall className="text-pink-600" /> Script d'Approche
        </h3>
        <div className="space-y-6 relative z-10">
          <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-pink-500">
             <span className="text-xs font-bold text-pink-500 uppercase tracking-wide">L'Accroche</span>
             <p className="text-lg font-medium text-zinc-900 mt-1">"{data.call_script.hook}"</p>
          </div>
          <div className="pl-4 border-l-2 border-dashed border-zinc-300">
             <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">La Question Expert (Le Piège)</span>
             <p className="text-zinc-700 mt-1 italic">"{data.call_script.technical_question}"</p>
          </div>
           <div className="pl-4 border-l-2 border-dashed border-zinc-300">
             <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Le Closing</span>
             <p className="text-zinc-700 mt-1 font-medium">"{data.call_script.closing}"</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Analysis */}
        <div className="bg-white p-6 rounded border border-zinc-200">
          <h4 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider mb-4 text-sm">
            <Search size={16} /> Analyse de l'annonce
          </h4>
          <ul className="space-y-2">
            {data.ad_analysis.flaws.map((flaw, i) => (
              <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                 <span className="font-bold">-</span> {flaw}
              </li>
            ))}
             {data.ad_analysis.missing_info.map((info, i) => (
              <li key={i} className="text-sm text-amber-600 flex items-start gap-2">
                 <span className="font-bold">?</span> Manque : {info}
              </li>
            ))}
          </ul>
        </div>

        {/* Argument Massue */}
        <div className="bg-zinc-900 text-white p-6 rounded shadow-lg flex flex-col justify-center">
           <h4 className="flex items-center gap-2 font-bold text-pink-500 uppercase tracking-wider mb-4 text-sm">
            <Target size={16} /> Argument Massue
          </h4>
          <p className="font-serif text-xl leading-relaxed">
            "{data.expert_argument}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default PigeReportDisplay;