import React from 'react';
import { Loader2 } from 'lucide-react';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const STEPS = [
  'Creating Feature Matrix',
  'Calculating Matrix Rank',
  'Checking Linear Dependence',
  'Extracting Performance Basis',
  'Performing Gram-Schmidt',
  'Projecting Performance Vector',
  'Generating Final Report',
];

export const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({
  currentStep,
  totalSteps = 7,
}) => {
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl max-w-md mx-auto my-8 text-center animate-in fade-in duration-300">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
        Mathematical Analysis in Progress
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-mono">
        Step {currentStep}/{totalSteps}: {STEPS[currentStep - 1] || 'Processing'}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
        {STEPS.map((_, idx) => (
          <span
            key={idx}
            className={`truncate ${
              idx + 1 <= currentStep
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-300 dark:text-slate-700'
            }`}
          >
            S{idx + 1}
          </span>
        ))}
      </div>
    </div>
  );
};
