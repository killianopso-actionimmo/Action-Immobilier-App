import React from 'react';
import { TechnicalReport, TechnicalItem } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Flame,
  Thermometer,
  Wrench,
  ThumbsUp,
  Euro,
  Lightbulb
} from 'lucide-react';

interface TechnicalReportDisplayProps {
  data: TechnicalReport;
}

const VerdictBadge = ({ verdict }: { verdict: string }) => {
  let color = "bg-zinc-100 text-zinc-600 border-zinc-200";
  let Icon = Wrench;

  switch (verdict) {
    case 'Excellent':
      color = "bg-emerald-50 text-emerald-700 border-emerald-200";
      Icon = CheckCircle2;
      break;
    case 'Correct':
      color = "bg-blue-50 text-blue-700 border-blue-200";
      Icon = ThumbsUp;
      break;
    case 'Vieillissant':
      color = "bg-amber-50 text-amber-700 border-amber-200";
      Icon = AlertTriangle;
      break;
    case 'À remplacer':
      color = "bg-red-50 text-red-700 border-red-200";
      Icon = XCircle;
      break;
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs md:text-sm font-bold uppercase tracking-wider ${color}`}>
      <Icon size={14} />
      {verdict}
    </div>
  );
};

const EquipmentCard: React.FC<{ item: TechnicalItem }> = ({ item }) => {
  // Determine icon based on equipment name (simple heuristic)
  const lowerName = item.equipment_name.toLowerCase();
  let MainIcon = Wrench;
  if (lowerName.includes('elec') || lowerName.includes('tableau')) MainIcon = Zap;
  else if (lowerName.includes('gaz') || lowerName.includes('chaudière')) MainIcon = Flame;
  else if (lowerName.includes('pac') || lowerName.includes('pompe') || lowerName.includes('clim')) MainIcon = Thermometer;

  return (
    <div className="bg-white border border-zinc-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-zinc-50 p-4 md:p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full border border-zinc-200 shadow-sm text-pink-600">
            <MainIcon size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-zinc-900">{item.equipment_name}</h3>
        </div>
        <VerdictBadge verdict={item.verdict} />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6">

        {/* Technical & Consumption */}
        <div className="space-y-4">
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <Wrench size={14} /> Avis Technique
            </h4>
            <p className="text-zinc-700 text-sm leading-relaxed">{item.technical_opinion}</p>
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <Lightbulb size={14} /> Projection Conso
            </h4>
            <p className="text-zinc-700 text-sm leading-relaxed">{item.consumption_projection}</p>
          </div>
        </div>

        {/* Sales & Negociation */}
        <div className="space-y-4 bg-pink-50/30 p-4 rounded-lg border border-pink-100/50">
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold text-pink-700 uppercase tracking-wider mb-2">
              <CheckCircle2 size={14} /> Argumentaire Vente
            </h4>
            <p className="text-zinc-800 text-sm font-medium italic">"{item.sales_argument}"</p>
          </div>

          {item.verdict === 'Vieillissant' || item.verdict === 'À remplacer' ? (
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                <Euro size={14} /> Point Négociation
              </h4>
              <p className="text-zinc-700 text-sm">{item.negotiation_point}</p>
            </div>
          ) : (
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <Euro size={14} /> Valeur Ajoutée
              </h4>
              <p className="text-zinc-700 text-sm">{item.negotiation_point}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const TechnicalReportDisplay: React.FC<TechnicalReportDisplayProps> = ({ data }) => {
  if (!data) return null;
  const items = Array.isArray(data.items) ? data.items : [];
  const summary = data.global_summary || "Analyse technique complétée.";

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">

      {/* Header Summary */}
      <div className="bg-zinc-900 text-white p-6 md:p-10 rounded-sm shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif mb-4 flex items-center gap-3">
            <Zap className="text-pink-500 fill-pink-500" />
            Bilan Énergie & Flux
          </h2>
          <p className="text-zinc-300 text-lg font-light leading-relaxed max-w-3xl border-l-4 border-pink-600 pl-4">
            {summary}
          </p>
        </div>
      </div>

      {/* Equipment List */}
      <div className="space-y-6">
        {items.length > 0 ? (
          items.map((item, index) => (
            <EquipmentCard key={index} item={item} />
          ))
        ) : (
          <div className="bg-white p-10 text-center rounded-lg border border-zinc-100 text-zinc-400 italic">
            Aucun équipement technique détaillé.
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-zinc-50 p-4 rounded text-center border border-zinc-100">
        <p className="text-xs text-zinc-500 italic">
          Analyse basée sur les éléments déclaratifs fournis. Ce document ne remplace pas un diagnostic technique officiel (DPE, Gaz, Élec).
        </p>
      </div>

    </div>
  );
};

export default TechnicalReportDisplay;