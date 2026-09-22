import React, { useEffect, useState } from 'react';
import {
  History as HistoryIcon,
  Trash2,
  Eye,
  Calendar,
  Layers,
  TrendingUp,
  Target,
  User,
} from 'lucide-react';
import { HistoryItem, AnalysisResponse } from '../types/analysis';
import { getAnalysesHistory, deleteAnalysisRecord, getAnalysisById } from '../services/api';

interface HistoryProps {
  onSelectAnalysis: (analysis: AnalysisResponse) => void;
  onNavigate: (page: string) => void;
}

export const History: React.FC<HistoryProps> = ({ onSelectAnalysis, onNavigate }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const items = await getAnalysesHistory();
      setHistory(items);
    } catch (err) {
      console.warn('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this analysis record from database?')) {
      await deleteAnalysisRecord(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleView = async (id: number) => {
    const full = await getAnalysisById(id);
    if (full) {
      onSelectAnalysis(full);
      onNavigate('results');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <HistoryIcon className="w-4 h-4" />
            Persistence & Archives
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analysis History Records
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Persistent archive stored in SQLite database. Review, reload, or export historical mathematical calculations.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
        >
          Refresh Archive
        </button>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading history records...</div>
      ) : history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center space-y-3">
          <HistoryIcon className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            No Historical Records Found
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Compute your first academic dependency analysis to populate the persistent database.
          </p>
          <button
            onClick={() => onNavigate('new-analysis')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-4">Components</th>
                  <th className="py-3 px-4">Matrix Rank</th>
                  <th className="py-3 px-4">Independent</th>
                  <th className="py-3 px-4">Projection Error</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => handleView(item.id)}
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        {item.student_name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-400" />
                        {item.components_count} subjects
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Rank {item.matrix_rank}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                        {item.independent_count} Basis Factors
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <Target className="w-3.5 h-3.5" />
                        {item.projection_error.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(item.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400"
                          title="View Analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
