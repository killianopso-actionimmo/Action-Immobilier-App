import React from 'react';
import {
  MapPin,
  Train, // Generic train
  TrainFront, // Metro
  Bus,
  Footprints,
  ShoppingBag,
  School,
  Trees,
  Building,
  Check,
  Quote,
  Star
} from 'lucide-react';
import { StreetReport, ConnectivityItem, SchoolItem } from '../types';

interface ReportDisplayProps {
  data: StreetReport;
}

const ScoreBar = ({ score, label }: { score: number; label: string }) => {
  const percentage = (score / 10) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-xs md:text-sm font-semibold text-zinc-900 uppercase tracking-wider">{label}</span>
        <span className="text-xl md:text-2xl font-serif font-bold text-pink-600">{score}<span className="text-xs md:text-sm text-zinc-400 font-sans font-normal">/10</span></span>
      </div>
      <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
        <div className="h-full bg-zinc-900" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const ConnectivityItemRow: React.FC<{ item: ConnectivityItem }> = ({ item }) => {
  let Icon = MapPin;
  let colorClass = "text-zinc-600";
  let bgClass = "bg-zinc-50";

  if (item.type === 'metro' || item.type === 'tram') {
    Icon = TrainFront;
    colorClass = "text-pink-600";
    bgClass = "bg-pink-50";
  } else if (item.type === 'bus') {
    Icon = Bus;
    colorClass = "text-amber-600";
    bgClass = "bg-amber-50";
  } else if (item.type === 'walk') {
    Icon = Footprints;
    colorClass = "text-emerald-600";
    bgClass = "bg-emerald-50";
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-full flex-shrink-0 ${bgClass} ${colorClass}`}>
          <Icon size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-zinc-800 text-sm md:text-base truncate">{item.name}</span>
          <span className="text-xs text-zinc-500 truncate">{item.details}</span>
        </div>
      </div>
      <div className="flex-shrink-0 font-semibold text-xs md:text-sm text-zinc-900 bg-zinc-50 px-2 py-1 rounded ml-2">
        {item.time}
      </div>
    </div>
  );
};

const SchoolItemRow: React.FC<{ school: SchoolItem }> = ({ school }) => (
  <div className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
    <div className="min-w-0 pr-2">
      <span className="text-[10px] md:text-xs font-semibold text-pink-600 uppercase tracking-wider block mb-0.5">{school.level}</span>
      <span className="font-serif text-base md:text-lg text-zinc-900 block truncate">{school.name}</span>
    </div>
    <span className="text-xs md:text-sm text-zinc-500 italic whitespace-nowrap">{school.time}</span>
  </div>
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ data }) => {
  if (!data) return null;

  // Defensive parsing with fallbacks
  const identity = data.identity || { ambiance: "N/A", keywords: [], accessibility_score: 0, services_score: 0 };
  const urbanism = data.urbanism || { building_type: "N/A", plu_note: "N/A", connectivity: [] };
  const lifestyle = data.lifestyle || { schools: [], leisure: [] };
  const highlights = data.highlights || [];
  const marketing_titles = data.marketing_titles || [];

  // Sort connectivity to group by type - handle empty connectivity
  const sortedConnectivity = Array.isArray(urbanism.connectivity)
    ? [...urbanism.connectivity].sort((a, b) => {
      const order: any = { metro: 1, tram: 2, bus: 3, walk: 4, car: 5 };
      return (order[a.type] || 99) - (order[b.type] || 99);
    })
    : [];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">

      {/* 1. Editorial Header */}
      <div className="relative bg-white border border-zinc-100 p-6 md:p-12 shadow-sm rounded-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-1 md:w-2 h-full bg-pink-600"></div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-3 md:mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              <MapPin className="w-3 h-3 text-pink-600" />
              Rapport d'environnement
            </div>
            <h2 className="text-3xl md:text-5xl font-serif leading-tight text-zinc-900 mb-4 md:mb-6">
              <span className="block text-lg md:text-xl text-zinc-500 font-sans font-light mb-1 md:mb-2">Analyse du quartier</span>
              {identity.ambiance}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(identity.keywords) && identity.keywords.map((kw, i) => (
                <span key={i} className="text-xs md:text-sm border-b border-pink-200 text-zinc-600 pb-0.5 px-1">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-zinc-50 p-6 md:p-8 rounded-sm space-y-4 md:space-y-6 border border-zinc-100">
            <h3 className="font-serif text-lg md:text-xl italic text-zinc-900 mb-2 md:mb-4">Indices de vie</h3>
            <ScoreBar score={identity.accessibility_score || 0} label="Transports & Mobilité" />
            <ScoreBar score={identity.services_score || 0} label="Commerces & Santé" />
          </div>
        </div>
      </div>

      {/* 2. Content Grid - Magazine Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 print-break-inside-avoid">

        {/* Left Column: Technical & Schools */}
        <div className="col-span-1 md:col-span-7 space-y-6 md:space-y-8">

          <div className="bg-white p-6 md:p-8 border-t-4 border-zinc-900 shadow-sm">
            <h3 className="flex items-center gap-3 text-xl md:text-2xl font-serif text-zinc-900 mb-6 md:mb-8">
              <Building className="w-5 h-5 md:w-6 md:h-6 text-pink-600 stroke-[1.5]" />
              Urbanisme & Connectivité
            </h3>

            <div className="prose prose-zinc mb-6">
              <p className="text-zinc-600 leading-relaxed text-base md:text-lg">{urbanism.building_type}</p>
            </div>

            <div className="bg-pink-50/50 p-4 md:p-6 rounded-sm border border-pink-100 mb-6 md:mb-8">
              <h4 className="text-xs md:text-sm font-bold text-pink-800 uppercase tracking-wider mb-2">Potentiel & PLU</h4>
              <p className="text-zinc-800 italic font-serif text-sm md:text-base">{urbanism.plu_note}</p>
            </div>

            <div>
              <h4 className="text-xs md:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-100 pb-2">Transports & Proximité</h4>
              <div className="space-y-1">
                {sortedConnectivity.length > 0 ? (
                  sortedConnectivity.map((item, i) => (
                    <ConnectivityItemRow key={i} item={item} />
                  ))
                ) : (
                  <p className="text-zinc-400 italic text-sm">Données non disponibles</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 border-t-4 border-zinc-900 shadow-sm">
            <h3 className="flex items-center gap-3 text-xl md:text-2xl font-serif text-zinc-900 mb-6 md:mb-8">
              <School className="w-5 h-5 md:w-6 md:h-6 text-pink-600 stroke-[1.5]" />
              Carte Scolaire
            </h3>
            <div className="flex flex-col">
              {Array.isArray(lifestyle.schools) && lifestyle.schools.length > 0 ? (
                lifestyle.schools.map((school, i) => (
                  <SchoolItemRow key={i} school={school} />
                ))
              ) : (
                <p className="text-zinc-400 italic text-sm">Aucune donnée scolaire</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Lifestyle & Highlights */}
        <div className="col-span-1 md:col-span-5 space-y-6 md:space-y-8">

          <div className="bg-zinc-900 text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 bg-pink-600 rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="flex items-center gap-3 text-xl md:text-2xl font-serif text-white mb-6 relative z-10">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-pink-500 fill-pink-500" />
              Les Pépites
            </h3>

            <div className="space-y-6 relative z-10">
              {highlights.length > 0 ? (
                highlights.map((highlight, i) => (
                  <div key={i} className="group">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-pink-500 font-serif font-bold text-lg md:text-xl">0{i + 1}.</span>
                      <h4 className="font-bold text-base md:text-lg leading-tight group-hover:text-pink-400 transition-colors uppercase">{highlight.title}</h4>
                    </div>
                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed pl-8 border-l border-zinc-700 ml-2.5">
                      {highlight.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 italic text-sm">Précisions en cours...</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 border border-zinc-100 shadow-sm">
            <h3 className="flex items-center gap-3 text-lg md:text-xl font-serif text-zinc-900 mb-4 md:mb-6">
              <Trees className="w-5 h-5 text-pink-600 stroke-[1.5]" />
              Vie de Quartier
            </h3>
            <ul className="space-y-4">
              {Array.isArray(lifestyle.leisure) && lifestyle.leisure.length > 0 ? (
                lifestyle.leisure.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600 text-sm md:text-base">
                    <Check className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-zinc-400 italic text-sm">Recherche d'activités...</p>
              )}
            </ul>
          </div>

          {/* Agent Note / Marketing Hook */}
          <div className="bg-pink-50 p-6 md:p-8 border-l-4 border-pink-600">
            <Quote className="w-6 h-6 md:w-8 md:h-8 text-pink-300 mb-4" />
            <div className="space-y-4">
              {marketing_titles.length > 0 ? (
                marketing_titles.map((title, i) => (
                  <p key={i} className="text-base md:text-lg font-serif italic text-zinc-800 leading-relaxed">
                    "{title}"
                  </p>
                ))
              ) : (
                <p className="text-zinc-500 italic text-sm font-serif">"Expertise Action Immobilier"</p>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-pink-200 flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 font-serif font-bold text-sm md:text-base">A</div>
              <div>
                <p className="text-xs md:text-sm font-bold text-zinc-900 uppercase">L'avis de l'expert</p>
                <p className="text-[10px] md:text-xs text-pink-700">Action Immobilier</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportDisplay;