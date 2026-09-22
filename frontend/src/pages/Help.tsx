import React from 'react';
import { HelpCircle, FileCheck, ShieldCheck } from 'lucide-react';
import { MathBlock } from '../components/math/MathBlock';

const FAQS = [
  {
    q: 'How many components can I analyze at a time?',
    a: 'The system accepts between 5 and 8 academic components per run, ensuring well-posed matrix operations in 5-dimensional curricular space.',
  },
  {
    q: 'Can I use custom subjects other than the default list?',
    a: 'Yes! You can add, remove, and rename any academic subject. The engine automatically maps custom subject titles into consistent dimensional profiles using a deterministic hash.',
  },
  {
    q: 'Does the application work if the backend server is temporarily down?',
    a: 'Yes. The frontend includes an isomorphic client-side linear algebra engine that mirrors the Python NumPy backend, automatically switching to demo mode with local storage persistence when the server is offline.',
  },
  {
    q: 'Can I export the full academic report?',
    a: 'Yes. You can generate and download a multi-page academic PDF report, export raw analysis JSON data, or print the report directly from your browser.',
  },
];

export const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          Documentation & Methodology
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Help, Methodology & Glossary
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Guide to utilizing the analyzer, interpreting calculations, and understanding linear algebraic notation.
        </p>
      </div>

      {/* 4-Step Quickstart */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          How to Run an Academic Analysis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-blue-600 font-mono">Step 1: Input Setup</span>
            <p className="text-slate-600 dark:text-slate-400">
              Navigate to <strong>New Analysis</strong> and enter the student’s name. Select 5 to 8 academic components.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-blue-600 font-mono">Step 2: Enter Marks</span>
            <p className="text-slate-600 dark:text-slate-400">
              Use the sliders or numeric input fields to enter marks from 0 to 100 for each course.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-blue-600 font-mono">Step 3: Execute Decomposition</span>
            <p className="text-slate-600 dark:text-slate-400">
              Click <strong>Analyze Academic Performance</strong>. Watch the 7-stage computation indicator complete in real time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-blue-600 font-mono">Step 4: Review & Export</span>
            <p className="text-slate-600 dark:text-slate-400">
              Inspect matrices, Gram-Schmidt steps, and 7 interactive charts. Download the official PDF report.
            </p>
          </div>
        </div>
      </section>

      {/* Formula Glossary */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Mathematical Formula Reference
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Vector Dot Product</span>
              <p className="text-slate-500">Measures directional alignment between two vectors.</p>
            </div>
            <MathBlock math="\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^n u_i v_i" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Euclidean Norm</span>
              <p className="text-slate-500">Magnitude or length of an academic capability vector.</p>
            </div>
            <MathBlock math="\|\mathbf{v}\| = \sqrt{\mathbf{v} \cdot \mathbf{v}}" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Vector Projection</span>
              <p className="text-slate-500">Parallel shadow of vector v onto direction u.</p>
            </div>
            <MathBlock math="\text{proj}_{\mathbf{u}}(\mathbf{v}) = \frac{\mathbf{v} \cdot \mathbf{u}}{\mathbf{u} \cdot \mathbf{u}} \mathbf{u}" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Gram-Schmidt Orthogonalization</span>
              <p className="text-slate-500">General formula for k-th orthogonal vector.</p>
            </div>
            <MathBlock math="\mathbf{u}_k = \mathbf{v}_k - \sum_{j=1}^{k-1} \text{proj}_{\mathbf{u}_j}(\mathbf{v}_k)" />
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          Frequently Asked Questions (FAQ)
        </h3>

        <div className="space-y-3">
          {FAQS.map((f, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1"
            >
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{f.q}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
