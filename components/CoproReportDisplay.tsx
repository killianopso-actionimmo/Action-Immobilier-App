import React from 'react';
import { CoproReport } from '../types';
import { Building, AlertTriangle, Wallet, Hammer, ShieldCheck } from 'lucide-react';

const CoproReportDisplay: React.FC<{ data: CoproReport }> = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      <div className="bg-white border-l-4 border-blue-600 shadow-sm p-6 rounded-r-sm">
        <h3 className="flex items-center gap-2 text-xl font-serif text-zinc-900 mb-4">
          <Building className="text-blue-600" /> Synthèse Copropriété
        </h3>
        <p className="text-zinc-700 leading-relaxed">{data.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded border border-zinc-200">
          <h4 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider mb-4 text-sm">
            <Hammer size={16} className="text-zinc-500" /> Travaux
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">VOTÉS (Vendeur)</span>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-zinc-600">
                {data.works_voted.length > 0 ? data.works_voted.map((w, i) => <li key={i}>{w}</li>) : <li>Aucun travaux votés majeurs.</li>}
              </ul>
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">À L'ÉTUDE (Futur Acheteur)</span>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-zinc-600">
                {data.works_planned.length > 0 ? data.works_planned.map((w, i) => <li key={i}>{w}</li>) : <li>Rien à signaler à l'étude.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded border border-zinc-200">
          <h4 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider mb-4 text-sm">
            <Wallet size={16} className="text-zinc-500" /> Vigilance Financière
          </h4>
          <ul className="space-y-2">
            {data.financial_alerts.map((alert, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" /> {alert}
              </li>
            ))}
            {data.legal_alerts.map((alert, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 bg-zinc-50 p-2 rounded">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" /> {alert}
              </li>
            ))}
            {data.financial_alerts.length === 0 && data.legal_alerts.length === 0 && (
              <li className="text-sm text-emerald-600 flex items-center gap-2"><ShieldCheck size={16}/> Comptes sains.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded text-blue-900 text-sm italic font-medium">
        💡 Argument Vente : "{data.sales_argument}"
      </div>
    </div>
  );
};

export default CoproReportDisplay;