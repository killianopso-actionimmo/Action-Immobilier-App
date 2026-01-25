import React from 'react';
import { HeatingReport } from '../types';
import {
  Flame,
  Droplets,
  Zap,
  ThermometerSun,
  ShieldCheck,
  Info,
  AlertTriangle,
  Leaf,
  Settings
} from 'lucide-react';

interface HeatingReportDisplayProps {
  data: HeatingReport;
}

const PositioningBadge = ({ position }: { position: string }) => {
  let color = "bg-zinc-100 text-zinc-600";
  if (position.includes('Haut')) color = "bg-emerald-100 text-emerald-800";
  if (position.includes('Rapport')) color = "bg-blue-100 text-blue-800";
  if (position.includes('Entrée')) color = "bg-amber-100 text-amber-800";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${color}`}>
      {position}
    </span>
  );
};

const EconomyBadge = ({ rating }: { rating: string }) => {
  let color = "bg-zinc-100 text-zinc-600";
  let Icon = Leaf;
  if (rating === 'Économique') {
    color = "bg-emerald-50 text-emerald-700 border border-emerald-200";
  } else if (rating === 'Standard') {
    color = "bg-blue-50 text-blue-700 border border-blue-200";
  } else {
    color = "bg-red-50 text-red-700 border border-red-200";
    Icon = AlertTriangle;
  }

  return (
    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${color}`}>
      <Icon size={14} />
      {rating}
    </span>
  );
};

const HeatingReportDisplay: React.FC<HeatingReportDisplayProps> = ({ data }) => {
  if (!data) return null;

  // Defensive fallbacks
  const config = data.configuration || { type: "Inconnu", description: "Détails non définis", pros_cons: "Analyse en attente" };
  const brand = data.brand_analysis || { positioning: "N/A", details: "Information non disponible" };
  const economic = data.economic_analysis || { rating: "Standard", dpe_impact: "Impact DPE modéré" };
  const vigilance = Array.isArray(data.vigilance_points) ? data.vigilance_points : [];
  const clarification = data.agent_clarification || "Solution technique standard pour ce type de bien.";

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-1000">

      {/* 1. Header & Configuration */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Configuration Card */}
        <div className="bg-white border-l-4 border-pink-600 shadow-sm p-6 rounded-r-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 rounded-full text-pink-600">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Configuration</h3>
              <p className="font-serif text-xl font-bold text-zinc-900">{config.type}</p>
            </div>
          </div>
          <p className="text-zinc-600 text-sm mb-4 leading-relaxed">{config.description}</p>
          <div className="text-xs font-medium text-pink-700 bg-pink-50/50 p-3 rounded">
            💡 {config.pros_cons}
          </div>
        </div>

        {/* Brand & Market Position */}
        <div className="bg-white border border-zinc-100 shadow-sm p-6 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900">Analyse Marque</h3>
              </div>
              <PositioningBadge position={brand.positioning} />
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {brand.details}
            </p>
          </div>
        </div>

      </div>

      {/* 2. Economic Analysis & DPE */}
      <div className="bg-zinc-900 text-white p-6 md:p-8 rounded-sm shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 mb-6 border-b border-zinc-700 pb-6">
          <div className="flex items-center gap-3">
            <Leaf className="text-emerald-400" size={28} />
            <h3 className="font-serif text-2xl">Performance & DPE</h3>
          </div>
          <EconomyBadge rating={economic.rating} />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-zinc-300 font-light italic leading-relaxed text-lg">
              "{economic.dpe_impact}"
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded border-l-2 border-emerald-500">
            <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <Info size={14} /> Le mot de l'expert
            </h4>
            <p className="text-sm text-zinc-300">
              Le système de chauffage et de production d'eau chaude représente souvent 60% à 70% de la consommation énergétique d'un logement.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Agent Clarification & Vigilance */}
      <div className="grid md:grid-cols-12 gap-6">

        {/* Agent Talk */}
        <div className="md:col-span-7 bg-pink-50 border border-pink-100 p-6 md:p-8 rounded-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-full shadow-sm text-pink-600">
              <ThermometerSun size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-900">Pour rassurer le client</h3>
          </div>
          <p className="text-lg text-zinc-800 italic font-medium leading-relaxed">
            "{clarification}"
          </p>
        </div>

        {/* Vigilance Points */}
        <div className="md:col-span-5 bg-white border border-zinc-200 p-6 rounded-sm">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider text-sm mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            Points de Vigilance
          </h3>
          <ul className="space-y-3">
            {vigilance.length > 0 ? (
              vigilance.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  {point}
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-400 italic">Aucun point critique identifié.</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default HeatingReportDisplay;