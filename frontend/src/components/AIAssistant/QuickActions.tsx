import React from 'react';
import { Sparkles, HelpCircle, Compass, LifeBuoy } from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (prompt: string) => void;
  currentPage?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction, currentPage }) => {
  const baseActions = [
    { label: 'What can you do?', icon: Sparkles },
    { label: 'Explain this website', icon: Compass },
    { label: 'Help me get started', icon: HelpCircle },
    { label: 'Contact support', icon: LifeBuoy },
  ];

  // Optional contextual pill based on current page
  const getContextAction = () => {
    switch (currentPage) {
      case 'new-analysis':
        return 'How do I input marks and run analysis?';
      case 'results':
        return 'Explain Matrix Rank and Nullity';
      case 'math-steps':
        return 'Explain Singular Value Decomposition (SVD)';
      case 'visualization':
        return 'How do I interact with the 3D Vector Space?';
      case 'history':
        return 'How is history stored and managed?';
      default:
        return null;
    }
  };

  const contextAction = getContextAction();

  return (
    <div className="py-2 px-1">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
        Suggested quick questions:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {contextAction && (
          <button
            onClick={() => onSelectAction(contextAction)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shadow-sm text-left"
          >
            <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
            <span>{contextAction}</span>
          </button>
        )}
        {baseActions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => onSelectAction(item.label)}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm text-left"
            >
              <Icon className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
