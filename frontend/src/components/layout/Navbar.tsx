import React from 'react';
import {
  Sun,
  Moon,
  Menu,
  Server,
  PlusCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NvidiaIcon } from '../icons/NvidiaIcon';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  isBackendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onNavigate,
  isBackendOnline,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* NVIDIA Symbol Brand Container */}
          <div
            className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-black border border-[#76B900]/50 flex items-center justify-center text-[#76B900] shadow-md shadow-[#76B900]/25 transition-transform hover:scale-105"
            title="NVIDIA"
          >
            <NvidiaIcon className="w-5 h-5 fill-[#76B900]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Student Academic
              </h1>
              {/* NVIDIA Symbol & Name Badge */}
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#76B900]/15 dark:bg-[#76B900]/25 text-[#426c00] dark:text-[#76B900] border border-[#76B900]/40 shadow-xs"
                title="NVIDIA Accelerated Architecture"
              >
                <NvidiaIcon className="w-3.5 h-3.5 fill-[#76B900]" />
                <span>NVIDIA</span>
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                3D WebGL Engine
              </span>
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Linear Algebra • Mathematical Analysis
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Linear Algebra & Vector Calculus
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* NVIDIA Architecture Pill */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 dark:bg-black text-white border border-[#76B900]/40 shadow-xs"
          title="Powered by NVIDIA Architecture"
        >
          <NvidiaIcon className="w-3.5 h-3.5 fill-[#76B900]" />
          <span className="text-[11px] tracking-wider font-mono text-slate-200">
            NVIDIA <span className="text-[#76B900] font-bold">CUDA</span>
          </span>
        </div>
        {/* Backend Connectivity Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
            isBackendOnline
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          }`}
          title={isBackendOnline ? 'FastAPI Backend Online' : 'Running in Offline / Client Math Demo Mode'}
        >
          <Server className="w-3 h-3" />
          <span className="hidden sm:inline">
            {isBackendOnline ? 'FastAPI Engine' : 'Demo Mode'}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
        </div>

        {/* Quick New Analysis CTA */}
        <button
          onClick={() => onNavigate('new-analysis')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          New Analysis
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
