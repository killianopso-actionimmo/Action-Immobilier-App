import React from 'react';
import { DpeReport } from '../types';
import { Leaf, TrendingUp, Hammer, Info } from 'lucide-react';

const DPEReportDisplay: React.FC<{ data: DpeReport }> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      <div className="bg-emerald-50 border border-emerald-100 p-6 md:p-8 rounded-lg text-center">
         <Leaf size={40} className="text-emerald-600 mx-auto mb-4" />
         <h3 className="font-serif text-2xl text-emerald-900 mb-2">DPE Booster</h3>
         <p className="text-emerald-700 max-w-2xl mx-auto">{data.current_analysis}</p>
      </div>

      <div>
        <h4 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider mb-6">
          <TrendingUp className="text-emerald-600" size={20} /> Plan d'Amélioration (Lettre par lettre)
        </h4>
        <div className="grid gap-4">
          {data.improvements.map((item, index) => (
            <div key={index} className="bg-white border border-zinc-200 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                 <div className="bg-zinc-100 p-2 rounded text-zinc-600 mt-1">
                   <Hammer size={18} />
                 </div>
                 <div>
                   <h5 className="font-bold text-zinc-900">{item.work}</h5>
                   <p className="text-sm text-zinc-500">{item.gain}</p>
                 </div>
              </div>
              <div className="text-right">
                 <span className="inline-block bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                   {item.cost_estimate}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-l-4 border-emerald-500 p-6 rounded shadow-sm">
         <h4 className="flex items-center gap-2 font-bold text-zinc-500 uppercase tracking-wider mb-2 text-xs">
           <Info size={14} /> Argument Valeur Verte
         </h4>
         <p className="text-lg font-serif italic text-zinc-800">"{data.green_value_argument}"</p>
      </div>

    </div>
  );
};

export default DPEReportDisplay;