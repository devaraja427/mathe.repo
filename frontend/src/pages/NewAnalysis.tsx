import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AcademicComponent, AnalysisResponse } from '../types/analysis';
import { analyzePerformance } from '../services/api';
import { StepProgressIndicator } from '../components/steps/StepProgressIndicator';

interface NewAnalysisProps {
  onAnalysisSuccess: (analysis: AnalysisResponse) => void;
}

const DEFAULT_COMPONENTS: AcademicComponent[] = [
  { name: 'Mathematics', marks: 88 },
  { name: 'Physics', marks: 76 },
  { name: 'Programming', marks: 92 },
  { name: 'Data Structures', marks: 85 },
  { name: 'Database Systems', marks: 80 },
  { name: 'Computer Networks', marks: 74 },
  { name: 'Operating Systems', marks: 78 },
  { name: 'Communication Skills', marks: 82 },
];

const SAMPLE_DATASETS = [
  {
    name: 'Computer Science Scholar (8 Subjects)',
    student: 'Aarav Sharma',
    components: [
      { name: 'Mathematics', marks: 94 },
      { name: 'Physics', marks: 82 },
      { name: 'Programming', marks: 95 },
      { name: 'Data Structures', marks: 91 },
      { name: 'Database Systems', marks: 86 },
      { name: 'Computer Networks', marks: 80 },
      { name: 'Operating Systems', marks: 84 },
      { name: 'Communication Skills', marks: 88 },
    ],
  },
  {
    name: 'Core Systems Focus (6 Subjects)',
    student: 'Diya Patel',
    components: [
      { name: 'Mathematics', marks: 85 },
      { name: 'Programming', marks: 90 },
      { name: 'Data Structures', marks: 88 },
      { name: 'Operating Systems', marks: 92 },
      { name: 'Computer Networks', marks: 87 },
      { name: 'Communication Skills', marks: 78 },
    ],
  },
  {
    name: 'Foundational Theory (5 Subjects)',
    student: 'Vikram Sengupta',
    components: [
      { name: 'Mathematics', marks: 92 },
      { name: 'Physics', marks: 88 },
      { name: 'Programming', marks: 74 },
      { name: 'Database Systems', marks: 70 },
      { name: 'Communication Skills', marks: 85 },
    ],
  },
];

export const NewAnalysis: React.FC<NewAnalysisProps> = ({ onAnalysisSuccess }) => {
  const [studentName, setStudentName] = useState('Manishankar Reddy');
  const [components, setComponents] = useState<AcademicComponent[]>(DEFAULT_COMPONENTS);
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddComponent = () => {
    if (components.length >= 8) {
      setErrorMsg('Maximum 8 academic components are permitted per analysis.');
      return;
    }
    setErrorMsg(null);
    setComponents([
      ...components,
      { name: `Component ${components.length + 1}`, marks: 75 },
    ]);
  };

  const handleRemoveComponent = (idx: number) => {
    if (components.length <= 5) {
      setErrorMsg('A minimum of 5 academic components is required for valid subspace rank analysis.');
      return;
    }
    setErrorMsg(null);
    setComponents(components.filter((_, i) => i !== idx));
  };

  const handleNameChange = (idx: number, name: string) => {
    const updated = [...components];
    updated[idx].name = name;
    setComponents(updated);
  };

  const handleMarksChange = (idx: number, marksStr: string) => {
    const num = marksStr === '' ? 0 : Number(marksStr);
    const updated = [...components];
    updated[idx].marks = Math.max(0, Math.min(100, isNaN(num) ? 0 : num));
    setComponents(updated);
  };

  const handleReset = () => {
    setComponents(DEFAULT_COMPONENTS);
    setErrorMsg(null);
  };

  const loadDataset = (idx: number) => {
    const d = SAMPLE_DATASETS[idx];
    setStudentName(d.student);
    setComponents(d.components);
    setErrorMsg(null);
  };

  const validate = (): boolean => {
    if (!studentName.trim()) {
      setErrorMsg('Please specify student name.');
      return false;
    }
    if (components.length < 5 || components.length > 8) {
      setErrorMsg(`Component count must be between 5 and 8 (currently ${components.length}).`);
      return false;
    }
    const names = new Set<string>();
    for (const c of components) {
      const trimmed = c.name.trim();
      if (!trimmed) {
        setErrorMsg('Academic component names cannot be blank.');
        return false;
      }
      if (names.has(trimmed.toLowerCase())) {
        setErrorMsg(`Duplicate component name detected: "${trimmed}". All subjects must be unique.`);
        return false;
      }
      names.add(trimmed.toLowerCase());
      if (c.marks < 0 || c.marks > 100) {
        setErrorMsg(`Marks for "${trimmed}" must be between 0 and 100.`);
        return false;
      }
    }
    setErrorMsg(null);
    return true;
  };

  const handleAnalyze = async () => {
    if (!validate()) return;

    // Run stepped progress animation
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev === null || prev >= 6) return prev;
        return prev + 1;
      });
    }, 250);

    try {
      const { result } = await analyzePerformance(components, studentName.trim());

      clearInterval(stepInterval);
      setLoadingStep(7);

      setTimeout(() => {
        setLoadingStep(null);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        onAnalysisSuccess(result);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setLoadingStep(null);
      setErrorMsg(err.message || 'Failed to complete mathematical analysis.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          New Academic Dependency Analysis
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure 5 to 8 academic components and marks (0–100) to compute the linear algebraic decomposition.
        </p>
      </div>

      {/* Preset Dataset Badges */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
          Quick Load Curricular Presets:
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_DATASETS.map((d, idx) => (
            <button
              key={idx}
              onClick={() => loadDataset(idx)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Student Name Input */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
          Student Identification / Academic Profile
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Manishankar Reddy"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Component Marks Editor Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Academic Components & Marks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current count: <span className="font-semibold text-blue-600">{components.length}</span> (Allowed: 5 to 8)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleAddComponent}
              disabled={components.length >= 8}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                components.length >= 8
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Component
            </button>
          </div>
        </div>

        {/* Rows List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {components.map((c, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>

              {/* Component Name */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder="Subject / Component Name"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Marks Range & Input */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={c.marks}
                  onChange={(e) => handleMarksChange(idx, e.target.value)}
                  className="w-28 sm:w-36 accent-blue-600 cursor-pointer"
                />
                <div className="relative shrink-0 w-20">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={c.marks}
                    onChange={(e) => handleMarksChange(idx, e.target.value)}
                    className="w-full px-2.5 py-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                    /100
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveComponent(idx)}
                  disabled={components.length <= 5}
                  className={`p-2 rounded-xl text-xs transition-colors shrink-0 ${
                    components.length <= 5
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'
                  }`}
                  title={components.length <= 5 ? 'Minimum 5 components required' : 'Remove component'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Execution Progress */}
      {loadingStep !== null && (
        <StepProgressIndicator currentStep={loadingStep} totalSteps={7} />
      )}

      {/* Analyze CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleAnalyze}
          disabled={loadingStep !== null}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Analyze Academic Performance
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
