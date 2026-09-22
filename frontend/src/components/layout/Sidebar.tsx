import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileCheck2,
  Binary,
  BarChart3,
  History,
  Info,
  HelpCircle,
  X,
} from 'lucide-react';
import { NvidiaIcon } from '../icons/NvidiaIcon';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  hasCurrentAnalysis: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiresAnalysis?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new-analysis', label: 'New Analysis', icon: PlusCircle, badge: '5-8' },
  { id: 'results', label: 'Analysis Results', icon: FileCheck2, requiresAnalysis: true },
  { id: 'math-steps', label: 'Mathematical Steps', icon: Binary, requiresAnalysis: true },
  { id: 'visualization', label: '3D Visualizations', icon: BarChart3, badge: '3D WebGL', requiresAnalysis: true },
  { id: 'history', label: 'Analysis History', icon: History },
  { id: 'about', label: 'About Project', icon: Info },
  { id: 'help', label: 'Help / Methodology', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  hasCurrentAnalysis,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand in Sidebar */}
        <div className="flex flex-col items-center p-5 pb-4 border-b border-slate-100 dark:border-slate-800 relative">
          {/* Close button - absolute positioned for mobile */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* NVIDIA Icon — above, centered, slightly bigger */}
          <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-black border border-[#76B900]/40 flex items-center justify-center text-[#76B900] shadow-sm mb-2.5">
            <NvidiaIcon className="w-6 h-6 fill-[#76B900]" />
          </div>

          {/* Text below icon, centered */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                Academic Analyzer
              </span>
              <span className="text-[9px] font-bold text-[#76B900] bg-[#76B900]/10 px-1 py-0.5 rounded border border-[#76B900]/30 font-mono">
                NVIDIA
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Linear Algebra v1.0
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isDisabled = item.requiresAnalysis && !hasCurrentAnalysis;

            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                    : isDisabled
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : isDisabled
                        ? 'text-slate-300 dark:text-slate-700'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {item.badge}
                  </span>
                )}

                {item.requiresAnalysis && !hasCurrentAnalysis && (
                  <span className="text-[9px] text-slate-400 italic">pending</span>
                )}
              </button>
            );
          })}
        </nav>

      </aside>
    </>
  );
};
