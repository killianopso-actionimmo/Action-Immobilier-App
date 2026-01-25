import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProspectionLog, ProspectionArchive } from '../types';
import { Archive, Calendar, Box, User, Mail, Trash2, FolderOpen, Search, PlusCircle, X, ChevronRight, History } from 'lucide-react';

interface Props {
  history: ProspectionLog[];
  archives: ProspectionArchive[];
  onArchiveAndReset: () => void;
  onDeleteMonth: (month: string) => void;
  onStartMonth: () => void;
  onDeleteItem: (id: number) => void;
  onDeleteArchive: (index: number) => void;
}

const ProspectionDashboard: React.FC<Props> = ({
  history, archives, onArchiveAndReset, onDeleteMonth,
  onStartMonth, onDeleteItem, onDeleteArchive
}) => {
  const [showArchives, setShowArchives] = useState(false);
  // State for search terms per column
  const [filters, setFilters] = useState<{
    boitage: string;
    porte_a_porte: string;
    courrier: string;
  }>({
    boitage: '',
    porte_a_porte: '',
    courrier: ''
  });

  // Group history by Month
  const groupedByMonth = history.reduce((acc, log) => {
    const month = log.mois || "Mois inconnu";
    if (!acc[month]) acc[month] = [];
    acc[month].push(log);
    return acc;
  }, {} as Record<string, ProspectionLog[]>);

  // Extract month keys using Set to keep the unique months ordered by their appearance
  const orderedMonths = Array.from(new Set(history.map(log => log.mois || "Mois inconnu")));

  const handleFilterChange = (type: 'boitage' | 'porte_a_porte' | 'courrier', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const isColdZone = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    // diff in ms
    const diffTime = Math.abs(now.getTime() - date.getTime());
    // diff in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 120;
  };

  const renderColumn = (
    title: string,
    icon: React.ReactNode,
    logs: ProspectionLog[],
    color: string,
    badgeColor: string,
    filterKey: 'boitage' | 'porte_a_porte' | 'courrier'
  ) => {
    // 1. Filter out System logs (used for initializing month)
    const validLogs = logs.filter(l => l.zone !== 'SYSTEM_INIT_MONTH');

    // 2. Filter by search term
    const searchTerm = filters[filterKey].toLowerCase();
    const filteredLogs = validLogs.filter(log =>
      log.zone.toLowerCase().includes(searchTerm)
    );

    return (
      <div className={`flex flex-col h-full bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden`}>
        {/* Column Header */}
        <div className={`p-4 ${color} border-b border-zinc-100`}>
          <div className="flex items-center gap-2 mb-3">
            {icon}
            <span className="font-bold uppercase tracking-wider text-sm text-zinc-900">{title}</span>
            <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm text-zinc-600">
              {validLogs.length}
            </span>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={`Chercher rue...`}
              value={filters[filterKey]}
              onChange={(e) => handleFilterChange(filterKey, e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-zinc-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none bg-white/80 transition-shadow"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="p-4 space-y-2 bg-zinc-50/50 flex-grow min-h-[150px] max-h-[400px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-300 py-4">
              <span className="text-xs italic">
                {searchTerm ? "Aucun résultat" : "Aucune donnée"}
              </span>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className={`p-2 rounded border border-zinc-200 shadow-sm text-sm font-medium ${badgeColor} flex justify-between items-center group relative pr-8`}>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  {isColdZone(log.date) && (
                    <span title="Zone froide (> 120 jours)" className="flex-shrink-0 cursor-help">❄️</span>
                  )}
                  <span className="truncate">{log.zone}</span>
                </div>
                <span className="text-[10px] opacity-70 whitespace-nowrap hidden md:inline-block">{log.date.split('-').slice(1).join('/')}</span>

                {/* Delete Button (X) - SECURED */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevents clicking the row
                    onDeleteItem(log.id);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all z-10 cursor-pointer"
                  title="Supprimer cette ligne définitivement"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 animate-in fade-in duration-500">

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h2 className="text-3xl font-serif text-zinc-900 mb-2">Tableau de Bord Prospection</h2>
          <p className="text-zinc-500 text-sm">Vue consolidée de l'activité terrain par mois.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onStartMonth}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded shadow-lg shadow-pink-200 transition-all text-sm font-medium"
          >
            <PlusCircle size={16} />
            Démarrer un nouveau mois
          </button>
          <button
            type="button"
            onClick={onArchiveAndReset}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded shadow-lg transition-all text-sm font-medium"
          >
            <Archive size={16} />
            Archiver tout
          </button>
        </div>
      </div>

      {/* Content */}
      {orderedMonths.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
          <FolderOpen size={64} className="mx-auto text-zinc-300 mb-6" />
          <h3 className="text-xl font-medium text-zinc-900 mb-2">Tableau de bord vide</h3>
          <p className="text-zinc-500 max-w-md mx-auto mb-6">
            Aucune campagne en cours. Cliquez sur "Démarrer un nouveau mois" ou enregistrez des actions via l'IA.
          </p>
          <button
            type="button"
            onClick={onStartMonth}
            className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-700 px-4 py-2 rounded hover:bg-zinc-50 transition-colors font-medium text-sm"
          >
            <PlusCircle size={16} /> Créer section mois actuel
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {orderedMonths.map((month) => (
            <div key={month} className="relative">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-6 group">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-600 text-white p-2 rounded-lg shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900">{month}</h3>
                </div>

                <div className="h-px bg-zinc-200 flex-grow mx-4"></div>

                <button
                  type="button"
                  onClick={() => onDeleteMonth(month)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-red-600 px-3 py-1.5 rounded hover:bg-red-50 transition-colors text-xs font-medium border border-transparent hover:border-red-100"
                  title="Supprimer toutes les données de ce mois"
                >
                  <Trash2 size={14} />
                  Réinitialiser ce mois
                </button>
              </div>

              {/* Columns Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {renderColumn(
                  "Boîtage",
                  <Box size={18} className="text-blue-600" />,
                  groupedByMonth[month].filter(l => l.type === 'boitage'),
                  "bg-blue-50",
                  "bg-white text-blue-900",
                  "boitage"
                )}
                {renderColumn(
                  "Porte-à-porte",
                  <User size={18} className="text-emerald-600" />,
                  groupedByMonth[month].filter(l => l.type === 'porte_a_porte'),
                  "bg-emerald-50",
                  "bg-white text-emerald-900",
                  "porte_a_porte"
                )}
                {renderColumn(
                  "Courrier",
                  <Mail size={18} className="text-amber-600" />,
                  groupedByMonth[month].filter(l => l.type === 'courrier'),
                  "bg-amber-50",
                  "bg-white text-amber-900",
                  "courrier"
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archives Section */}
      <div className="mt-20 border-t border-zinc-200 pt-10">
        <button
          onClick={() => setShowArchives(!showArchives)}
          className="flex items-center gap-3 text-zinc-400 hover:text-zinc-600 transition-colors group mb-6"
        >
          <History size={20} className="group-hover:rotate-[-30deg] transition-transform" />
          <span className="font-bold uppercase tracking-[0.2em] text-xs">Consulter les archives ({archives?.length || 0})</span>
          <ChevronRight size={16} className={`transition-transform duration-300 ${showArchives ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showArchives && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {archives.length === 0 ? (
                <p className="text-zinc-400 italic text-sm text-center py-10 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                  Aucune archive pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {archives.map((archive, arcIdx) => (
                    <div key={arcIdx} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                      <div className="p-4 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Archive size={14} className="text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-600">
                            {new Date(archive.archivedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteArchive(arcIdx)}
                          className="text-zinc-300 hover:text-red-500 transition-colors"
                          title="Supprimer l'archive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-[11px] font-medium text-zinc-500">
                            <span>TOTAL ACTIONS</span>
                            <span className="text-zinc-900 font-bold">{archive.data.length}</span>
                          </div>
                          {/* Mini breakdown */}
                          <div className="flex gap-2 h-1.5 rounded-full overflow-hidden bg-zinc-100">
                            <div
                              className="bg-blue-400 h-full"
                              style={{ width: `${(archive.data.filter(d => d.type === 'boitage').length / archive.data.length) * 100}%` }}
                            />
                            <div
                              className="bg-emerald-400 h-full"
                              style={{ width: `${(archive.data.filter(d => d.type === 'porte_a_porte').length / archive.data.length) * 100}%` }}
                            />
                            <div
                              className="bg-amber-400 h-full"
                              style={{ width: `${(archive.data.filter(d => d.type === 'courrier').length / archive.data.length) * 100}%` }}
                            />
                          </div>

                          {/* Sample of streets */}
                          <div className="pt-2">
                            <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Rues principales :</div>
                            <p className="text-xs text-zinc-600 line-clamp-2 italic">
                              {Array.from(new Set(archive.data.map(d => d.zone))).slice(0, 3).join(', ')}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProspectionDashboard;