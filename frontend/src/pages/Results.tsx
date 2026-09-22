import React from 'react';
import {
  FileDown,
  Printer,
  PlusCircle,
  CheckCircle2,
  Share2,
  TrendingUp,
  Layers,
  Compass,
  GitFork,
  Target,
  Sparkles,
  Info,
} from 'lucide-react';
import { AnalysisResponse } from '../types/analysis';
import { exportAnalysisPDF, exportAnalysisJSON } from '../services/pdfExport';
import { MatrixDisplay } from '../components/math/MatrixDisplay';
import { OrthogonalityMatrix } from '../components/math/OrthogonalityMatrix';
import { GramSchmidtStepCard } from '../components/steps/GramSchmidtStepCard';
import { MathBlock } from '../components/math/MathBlock';

interface ResultsProps {
  analysis: AnalysisResponse;
  onNavigate: (page: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ analysis, onNavigate }) => {
  const handlePrint = () => {
    window.print();
  };

  const indNames = new Set(analysis.independent_factors.map((f) => f.name));

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:p-0 print:space-y-6">
      {/* Top Completion Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-200">
              Analysis Completed Successfully
            </h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Candidate: <span className="font-semibold">{analysis.student_name}</span> | Model Rank: {analysis.rank} / {analysis.max_possible_rank} | Subspace Fidelity: {analysis.percentage_representation}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => exportAnalysisPDF(analysis)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            title="Download Academic PDF Report"
          >
            <FileDown className="w-3.5 h-3.5" />
            PDF Report
          </button>
          <button
            onClick={() => exportAnalysisJSON(analysis)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
            title="Export JSON"
          >
            <Share2 className="w-3.5 h-3.5" />
            JSON
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('new-analysis')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Components
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            {analysis.components.length}
          </div>
          <span className="text-[10px] text-slate-400">Total subjects</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Matrix Rank
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            {analysis.rank}
          </div>
          <span className="text-[10px] text-slate-400">Max {analysis.max_possible_rank}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Independent
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600" />
            {analysis.independent_factors.length}
          </div>
          <span className="text-[10px] text-slate-400">Basis factors</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Dependent
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <GitFork className="w-4 h-4 text-amber-600" />
            {analysis.dependent_factors.length}
          </div>
          <span className="text-[10px] text-slate-400">Synthesized</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Basis Dim
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            {analysis.basis_dimension}
          </div>
          <span className="text-[10px] text-slate-400">Span subspace</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Projection Error
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Target className="w-4 h-4 text-rose-600" />
            {analysis.projection_error.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400">||r||_2 residual</span>
        </div>
      </div>

      {/* SECTION A: Input Academic Data */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold flex items-center justify-center">
              A
            </span>
            Academic Input Data Table
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {analysis.components.length} Academic Components
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Component Name</th>
                <th className="py-2.5 px-3">Marks (0-100)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Performance Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {analysis.components.map((c, idx) => {
                const isInd = indNames.has(c.name);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {c.marks}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isInd
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {isInd ? 'Independent' : 'Dependent'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {isInd
                        ? 'Extracts a unique foundational coordinate axis'
                        : 'Derived as a combination of independent subjects'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION B & C: Feature Matrix & Rank */}
      <section className="space-y-4">
        <MatrixDisplay
          title="Feature Matrix (A)"
          matrix={analysis.matrix}
          rowLabels={analysis.dimension_names}
          colLabels={analysis.components.map((c) => c.name)}
          symbol="A"
          subtitle={`Size ${analysis.matrix_rows} × ${analysis.matrix_cols}. Columns represent academic competency vectors scaled by marks.`}
          highlightPivots={analysis.independent_factors.map((f) => f.index)}
        />

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Matrix Rank: r = rank(A) = {analysis.rank}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Singular Value Decomposition (SVD) confirms {analysis.rank} non-zero singular values, utilizing {analysis.rank_utilization}% of maximum potential dimensionality ({analysis.max_possible_rank}).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {analysis.is_full_rank ? 'Full Rank Matrix' : 'Rank Deficient (Contains Dependencies)'}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION D & E: Linear Dependence Analysis & Basis */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              Linearly Independent Factors ({analysis.independent_factors.length})
            </h4>
            <span className="text-xs font-mono text-blue-600 font-semibold">Basis Generator</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            These subjects span the student’s academic capability manifold. None can be synthesized from the others:
          </p>

          <div className="space-y-2">
            {analysis.independent_factors.map((f, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-200 mb-1">
                  <span>
                    v_{idx + 1}: {f.name}
                  </span>
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                    Col {f.index + 1}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {f.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <GitFork className="w-4 h-4 text-amber-600" />
              Linearly Dependent Factors ({analysis.dependent_factors.length})
            </h4>
            <span className="text-xs font-mono text-amber-600 font-semibold">Synthesized</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Performance in these subjects is a mathematical linear combination of the independent factors:
          </p>

          {analysis.dependent_factors.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-xs text-center text-slate-500">
              No dependent factors found. All input components are linearly independent!
            </div>
          ) : (
            <div className="space-y-2">
              {analysis.dependent_factors.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200 mb-1">
                    <span>{f.name}</span>
                    <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                      Col {f.index + 1}
                    </span>
                  </div>
                  {f.linear_combination && (
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-amber-800/60 font-mono text-[11px] text-amber-800 dark:text-amber-300 my-1 overflow-x-auto">
                      {f.linear_combination}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {f.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION F: Gram-Schmidt Step-by-Step Calculation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold flex items-center justify-center">
                F
              </span>
              Gram-Schmidt Orthogonalization Process
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Decoupling correlated vectors $v_k$ into mutually perpendicular directions $u_k$, then scaling to unit vectors $e_k$.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {analysis.gram_schmidt_steps.length} Vectors Processed
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {analysis.gram_schmidt_steps.map((step) => (
            <GramSchmidtStepCard
              key={step.step_index}
              step={step}
              dimensionNames={analysis.dimension_names}
            />
          ))}
        </div>
      </section>

      {/* SECTION G & H: Orthogonality Verification Matrix */}
      <section className="space-y-4">
        <OrthogonalityMatrix
          matrix={analysis.orthogonality_matrix}
          basisNames={analysis.basis_names}
          verified={analysis.orthogonality_verified}
        />
      </section>

      {/* SECTION I & J: Projection & Performance Representation */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Vector Projection onto Subspace Basis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Measuring the fidelity of representing overall student capability within the extracted orthogonal basis B.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
              {analysis.percentage_representation}%
            </span>
            <span className="block text-[10px] text-slate-400">Subspace Fidelity</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Projection Coordinates (c_i = p · e_i):
            </span>
            <div className="space-y-1 font-mono">
              {analysis.projection_coefficients.map((coeff, idx) => (
                <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>
                    Basis Component e_{idx + 1} ({analysis.basis_names[idx]}):
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{coeff.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Residual Error Vector (r = p - proj_B(p)):
            </span>
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap gap-1.5">
              {analysis.residual.map((rVal, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  {rVal.toFixed(2)}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold pt-1">
              Euclidean Residual Length: ||r||_2 = {analysis.projection_error.toFixed(4)}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION K: Academic Interpretation */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/60 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-bold">Comprehensive Academic Interpretation</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {analysis.interpretation}
        </p>
      </section>
    </div>
  );
};
