import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface OrthogonalityMatrixProps {
  matrix: number[][];
  basisNames: string[];
  verified: boolean;
}

export const OrthogonalityMatrix: React.FC<OrthogonalityMatrixProps> = ({
  matrix,
  basisNames,
  verified,
}) => {
  if (!matrix || matrix.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-base">
            Orthogonality Verification Matrix ($E^T E$)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Inner products between all pairs of normalized basis vectors $\langle e_i, e_j \rangle = e_i \cdot e_j$.
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            verified
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}
        >
          {verified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Orthogonality verified successfully
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Approximate Orthogonality
            </>
          )}
        </div>
      </div>

      {/* Verification Matrix Table */}
      <div className="overflow-x-auto py-2">
        <table className="border-collapse mx-auto">
          <thead>
            <tr>
              <th className="p-2 text-xs font-mono text-slate-400 text-left">·</th>
              {basisNames.map((name, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 text-center text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold"
                >
                  e_{idx + 1}
                  <span className="block text-[10px] font-normal text-slate-400 max-w-[70px] truncate">
                    {name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap">
                  e_{rIdx + 1}
                </td>
                {row.map((val, cIdx) => {
                  const isDiag = rIdx === cIdx;
                  const displayVal = Math.abs(val) < 1e-9 ? 0 : Number(val.toFixed(3));
                  return (
                    <td
                      key={cIdx}
                      className={`px-3 py-2 text-center font-mono text-xs border border-slate-100 dark:border-slate-800/80 ${
                        isDiag
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                          : displayVal === 0
                          ? 'bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500'
                          : 'bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {displayVal === 0 ? '0' : displayVal === 1 ? '1' : displayVal}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center">
        Note: Minor floating-point residuals (&lt; 10^-9) produced by binary rounding are simplified to strictly 0.
      </p>
    </div>
  );
};
