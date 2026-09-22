import React from 'react';
import { ArrowDown, Check, Sparkles } from 'lucide-react';
import { GramSchmidtStep } from '../../types/analysis';
import { MathBlock } from '../math/MathBlock';

interface GramSchmidtStepCardProps {
  step: GramSchmidtStep;
  dimensionNames: string[];
}

export const GramSchmidtStepCard: React.FC<GramSchmidtStepCardProps> = ({
  step,
  dimensionNames,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center">
            {step.step_index}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-base">
              Orthogonalizing Vector {step.step_index}: <span className="text-blue-600 dark:text-blue-400">{step.component_name}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Input vector: v_{step.step_index} ∈ R^5
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
          ||u_{step.step_index}|| = {step.norm.toFixed(3)}
        </div>
      </div>

      {/* Formula */}
      <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 overflow-x-auto text-center">
        <MathBlock math={step.formula_latex} block />
      </div>

      {/* Pipeline: Original -> Projection -> Orthogonal -> Normalized */}
      <div className="space-y-3">
        {/* Stage 1: Original Vector */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            1. Original Academic Vector (v_{step.step_index}):
          </div>
          <div className="font-mono text-xs text-slate-600 dark:text-slate-300 flex flex-wrap gap-2">
            {step.original_vector.map((val, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                title={dimensionNames[idx] || `Dim ${idx + 1}`}
              >
                {val.toFixed(2)}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center text-slate-400 dark:text-slate-600 my-1">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Stage 2: Subtracted Projections */}
        <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
          <div className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1.5">
            2. Subtracted Projection Components:
          </div>
          {step.projection_components.length === 0 ? (
            <p className="text-xs text-slate-500 italic font-mono">
              None (first basis vector: u_1 = v_1, no prior vectors to subtract)
            </p>
          ) : (
            <div className="space-y-2">
              {step.projection_components.map((p, pIdx) => (
                <div
                  key={pIdx}
                  className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-amber-200/50 dark:border-amber-900/40 space-y-1"
                >
                  <div className="text-slate-700 dark:text-slate-300 font-sans font-medium flex justify-between">
                    <span>
                      Onto u_{p.onto_basis_index} ({p.onto_basis_name}):
                    </span>
                    <span className="font-mono text-amber-700 dark:text-amber-400">
                      Scalar factor = {p.scalar_factor.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {p.proj_vector.map((val, vIdx) => (
                      <span
                        key={vIdx}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]"
                      >
                        {val.toFixed(2)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center text-slate-400 dark:text-slate-600 my-1">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Stage 3: Orthogonal Vector u_k */}
        <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
          <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1.5 flex items-center justify-between">
            <span>3. Orthogonal Vector (u_{step.step_index}):</span>
            <span className="font-mono text-xs font-normal">
              Length ||u_{step.step_index}|| = {step.norm.toFixed(4)}
            </span>
          </div>
          <div className="font-mono text-xs text-blue-900 dark:text-blue-200 flex flex-wrap gap-2">
            {step.orthogonal_vector.map((val, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-semibold"
              >
                {val.toFixed(2)}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center text-slate-400 dark:text-slate-600 my-1">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Stage 4: Normalized Unit Vector e_k */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              4. Normalized Basis Vector (e_{step.step_index} = u_{step.step_index} / ||u_{step.step_index}||):
            </span>
            <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Unit length = 1.000
            </span>
          </div>
          <div className="font-mono text-xs text-emerald-950 dark:text-emerald-100 flex flex-wrap gap-2">
            {step.normalized_vector.map((val, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 font-bold"
              >
                {val.toFixed(4)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
