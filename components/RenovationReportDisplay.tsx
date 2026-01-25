import React from 'react';
import { RenovationReport } from '../types';
import {
  PaintRoller,
  Lightbulb,
  Hammer,
  Euro,
  Sparkles,
  TrendingUp,
  Brush,
  Eye,
  ArrowRight
} from 'lucide-react';

interface RenovationReportDisplayProps {
  data: RenovationReport;
}

const RenovationReportDisplay: React.FC<RenovationReportDisplayProps> = ({ data }) => {
  if (!data) return null;

  // Defensive fallbacks
  const analysis = data.analysis || { visual_diagnosis: "Analyse visuelle terminée.", light_strategy: "Optimisation de la luminosité conseillée." };
  const expert_secret = data.expert_secret || "Valorisation par home-staging suggérée.";
  const sales_arguments = Array.isArray(data.sales_arguments) ? data.sales_arguments : [];
  const smart_renovation = Array.isArray(data.smart_renovation) ? data.smart_renovation : [];
  const estimates = Array.isArray(data.estimates) ? data.estimates : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">

      {/* 1. Header & Diagnosis */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-zinc-900 text-white p-6 md:p-8 rounded-sm shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-32 bg-orange-500 rounded-full blur-[90px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="flex items-center gap-3 text-2xl font-serif text-white mb-6 relative z-10">
            <Eye className="text-orange-400" size={28} />
            Diagnostic Visuel
          </h3>
          <div className="space-y-4 relative z-10">
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Les "Poids Lourds" identifiés</h4>
              <p className="text-zinc-200 leading-relaxed italic border-l-2 border-orange-500 pl-4">
                "{analysis.visual_diagnosis}"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <h4 className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">
                <Lightbulb size={14} /> Stratégie Lumière
              </h4>
              <p className="text-sm text-zinc-300">
                {analysis.light_strategy}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50/50 border border-orange-100 p-6 md:p-8 rounded-sm">
          <h3 className="flex items-center gap-3 text-xl font-serif text-zinc-900 mb-6">
            <Sparkles className="text-orange-600" size={24} />
            La Touche Expert
          </h3>
          <p className="text-lg font-medium text-zinc-800 leading-relaxed mb-6">
            {expert_secret}
          </p>
          <div className="bg-white p-4 rounded border border-orange-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Argumentaire Acheteur</h4>
            <ul className="space-y-2">
              {sales_arguments.length > 0 ? (
                sales_arguments.map((arg, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
                    <TrendingUp size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{arg}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-400 italic">Analyse des atouts en cours...</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Smart Renovation (80/20) */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 uppercase tracking-wider mb-6">
          <Brush className="text-pink-600" size={20} />
          Solutions "Impact Immédiat" (Règle du 80/20)
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {smart_renovation.length > 0 ? (
            smart_renovation.map((item, index) => (
              <div key={index} className="bg-white border border-zinc-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase rounded">{item.area}</span>
                  <span className="text-pink-600 text-xs font-medium flex items-center gap-1">
                    Valorisation Rapide <ArrowRight size={12} />
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-zinc-900 mb-2">{item.suggestion}</h4>
                <p className="text-sm text-zinc-500 italic">
                  Objectif : {item.impact}
                </p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 italic text-sm">Suggestions de valorisation non disponibles.</p>
          )}
        </div>
      </div>

      {/* 3. Estimates Table */}
      <div className="bg-white border-t-4 border-zinc-900 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-100 rounded-full">
            <Euro size={20} className="text-zinc-700" />
          </div>
          <h3 className="font-serif text-xl font-bold text-zinc-900">Estimation Budgétaire Rapide</h3>
        </div>

        <div className="overflow-hidden rounded-sm border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Poste de travaux</th>
                <th className="px-4 py-3 text-right">Budget Estimé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {estimates.length > 0 ? (
                estimates.map((est, i) => (
                  <tr key={i} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3 font-medium text-zinc-800 flex items-center gap-2">
                      <Hammer size={14} className="text-zinc-400" />
                      {est.work}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-pink-600">{est.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-center text-zinc-400 italic">Données budgétaires en cours d'évaluation.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-zinc-400 text-center italic">
          *Estimations indicatives moyennes constatées (hors main d'œuvre spécialisée complexe). Ne remplace pas un devis artisan.
        </p>
      </div>

    </div>
  );
};

export default RenovationReportDisplay;