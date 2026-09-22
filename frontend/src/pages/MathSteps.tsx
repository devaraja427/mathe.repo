import React from 'react';
import { Binary, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { AnalysisResponse } from '../types/analysis';
import { MathBlock } from '../components/math/MathBlock';

interface MathStepsProps {
  analysis: AnalysisResponse;
}

export const MathSteps: React.FC<MathStepsProps> = ({ analysis }) => {
  const explanations = Object.values(analysis.explanations || {});

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <Binary className="w-4 h-4" />
          Rigorous Linear Algebra Breakdown
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Mathematical Steps & Concept Explanations
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Detailed mathematical formulation for academic defense and viva voce examination. Every step
          traces how raw marks are mapped, factored, orthogonalized, and reconstructed.
        </p>
      </div>

      {/* Concept Steps List */}
      <div className="space-y-6">
        {explanations.map((exp, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            {/* Step Title Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {exp.concept}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Linear Algebra Concept 0{idx + 1} of 0{explanations.length}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Verified
              </span>
            </div>

            {/* Formula Block */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center overflow-x-auto">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Governing Equation
              </span>
              <MathBlock math={exp.formula} block />
            </div>

            {/* Step Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  Input Description:
                </span>
                <p className="text-slate-600 dark:text-slate-400 pl-5">
                  {exp.input_description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  Calculation Details:
                </span>
                <p className="text-slate-600 dark:text-slate-400 pl-5">
                  {exp.calculation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Computed Result:
                </span>
                <p className="text-blue-800 dark:text-blue-200 pl-5 font-mono text-[11px] font-semibold">
                  {exp.result}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  Academic Interpretation:
                </span>
                <p className="text-slate-600 dark:text-slate-400 pl-5">
                  {exp.interpretation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
