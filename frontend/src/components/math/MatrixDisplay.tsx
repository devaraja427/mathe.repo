import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface MatrixDisplayProps {
  title?: string;
  matrix: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  symbol?: string;
  subtitle?: string;
  highlightPivots?: number[]; // column indices
}

export const MatrixDisplay: React.FC<MatrixDisplayProps> = ({
  title = 'Feature Matrix',
  matrix,
  rowLabels,
  colLabels,
  symbol = 'A',
  subtitle,
  highlightPivots = [],
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!matrix || matrix.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400">
        No matrix data available
      </div>
    );
  }

  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-base">
              {title}
            </h4>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {rows} × {cols}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            {showDetails ? (
              <>
                Hide Details <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Calculation Details <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Matrix Mathematical Display */}
      <div className="flex items-center gap-3 overflow-x-auto py-2">
        <span className="font-serif italic text-lg font-semibold text-slate-800 dark:text-slate-200">
          {symbol} =
        </span>

        {/* Matrix Brackets */}
        <div className="relative inline-flex flex-col px-3 py-2 border-l-2 border-r-2 border-slate-800 dark:border-slate-300 rounded-lg">
          {/* Top and bottom bracket ticks */}
          <div className="absolute top-0 left-0 w-2 h-1 border-t-2 border-slate-800 dark:border-slate-300" />
          <div className="absolute top-0 right-0 w-2 h-1 border-t-2 border-slate-800 dark:border-slate-300" />
          <div className="absolute bottom-0 left-0 w-2 h-1 border-b-2 border-slate-800 dark:border-slate-300" />
          <div className="absolute bottom-0 right-0 w-2 h-1 border-b-2 border-slate-800 dark:border-slate-300" />

          {/* Matrix Table */}
          <table className="border-collapse">
            {colLabels && (
              <thead>
                <tr>
                  {rowLabels && <th className="p-1"></th>}
                  {colLabels.map((lbl, cIdx) => (
                    <th
                      key={cIdx}
                      className={`px-3 py-1 text-[11px] font-mono font-normal truncate max-w-[90px] ${
                        highlightPivots.includes(cIdx)
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                      title={lbl}
                    >
                      {lbl.length > 10 ? lbl.slice(0, 8) + '..' : lbl}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {matrix.map((row, rIdx) => (
                <tr key={rIdx}>
                  {rowLabels && (
                    <td
                      className="pr-2 py-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 text-right whitespace-nowrap"
                      title={rowLabels[rIdx]}
                    >
                      {rowLabels[rIdx].length > 15
                        ? rowLabels[rIdx].slice(0, 14) + '..'
                        : rowLabels[rIdx]}
                    </td>
                  )}
                  {row.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-3 py-1.5 text-center font-mono text-xs ${
                        highlightPivots.includes(cIdx)
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold rounded'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
          <p>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Dimension:</span>{' '}
            {rows} rows × {cols} columns (Space: R^{rows}).
          </p>
          <p>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Column Meaning:</span>{' '}
            Each column represents an academic factor vector scaled by student performance marks.
          </p>
          <p>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Row Meaning:</span>{' '}
            Foundational curricular evaluation axes (Analytical, Algorithmic, Applied, Theoretical, Synthesis).
          </p>
          {highlightPivots.length > 0 && (
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
              Highlighted columns indicate extracted linearly independent pivot basis vectors.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
