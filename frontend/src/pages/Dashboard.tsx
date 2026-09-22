import React, { useState } from 'react';
import {
  PlusCircle,
  History,
  ArrowRight,
  Sparkles,
  Layers,
  GitFork,
  Compass,
  CheckCircle2,
  TrendingUp,
  Award,
  Box,
  Image as ImageIcon,
  Activity,
  Cpu,
  Maximize2,
} from 'lucide-react';
import { AnalysisResponse } from '../types/analysis';
import { Card3DTilt } from '../components/3d/Card3DTilt';
import { VectorSpace3DViewer } from '../components/3d/VectorSpace3DViewer';
import { Ambient3DScene } from '../components/3d/Ambient3DScene';

interface DashboardProps {
  onNavigate: (page: string) => void;
  latestAnalysis: AnalysisResponse | null;
}

const WORKFLOW_STEPS = [
  { step: '01', title: 'Academic Data', desc: 'Marks across 5–8 subjects (0–100)' },
  { step: '02', title: 'Feature Matrix', desc: 'Multidimensional curricular mapping' },
  { step: '03', title: 'Matrix Rank', desc: 'Max independent dimensions via SVD' },
  { step: '04', title: 'Linear Dependence', desc: 'Identify standalone vs synthesized factors' },
  { step: '05', title: 'Subspace Basis', desc: 'Minimal generating set of performance vectors' },
  { step: '06', title: 'Gram-Schmidt', desc: 'Step-by-step orthogonalization and unit scaling' },
  { step: '07', title: 'Projection & Error', desc: 'Subspace decomposition and residual error' },
];

const CONCEPT_CARDS = [
  {
    title: 'Matrix & Vector Spaces',
    symbol: 'A ∈ R^{m×n}',
    desc: 'Represents the student’s marks as coordinate vectors in an inner product vector space, mapping academic criteria to foundational curricular dimensions.',
  },
  {
    title: 'Matrix Rank',
    symbol: 'rank(A) = r',
    desc: 'Determines the genuine degrees of freedom in academic achievement, distinguishing true multi-disciplinary capability from redundant score correlations.',
  },
  {
    title: 'Linear Dependence',
    symbol: 'c_1 v_1 + ... = 0',
    desc: 'Detects which subjects act as foundational competencies and which subjects synthesize knowledge from other academic domains.',
  },
  {
    title: 'Gram-Schmidt Orthogonalization',
    symbol: 'u_k = v_k - ∑ proj_{u_j}(v_k)',
    desc: 'Transforms correlated academic subjects into a mutually perpendicular orthonormal coordinate basis, isolating independent directions of excellence.',
  },
  {
    title: 'Vector Projection',
    symbol: 'proj_B(p) = ∑ (p · e_i) e_i',
    desc: 'Projects the student’s cumulative profile onto the orthogonal subspace to measure mathematical fidelity and reconstruction accuracy.',
  },
  {
    title: 'Orthogonality Verification',
    symbol: 'E^T E = I_r',
    desc: 'Numerically verifies that zero cross-factor interference exists among the decoupled academic achievement axes.',
  },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, latestAnalysis }) => {
  const [heroViewMode, setHeroViewMode] = useState<'3d-canvas' | '3d-render'>('3d-canvas');

  return (
    <div className="space-y-12">
      {/* 3D Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-blue-500/30">
        {/* Ambient 3D Polyhedral Constellation */}
        <Ambient3DScene className="opacity-60" />

        {/* Decorative ambient radial blurs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading & Call to Actions */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-cyan-300 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Full 3D Vector Calculus & Academic Subspace Analyzer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Explore Academic Performance in{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Full 3D Space
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Deconstruct student capabilities using real 3D vector coordinates, matrix rank,
              Gram-Schmidt orthogonalization, and subspace projections. Rotate, zoom, and inspect
              independent competency axes in hardware-accelerated WebGL.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('new-analysis')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                Start New Analysis
              </button>

              <button
                onClick={() => onNavigate('visualization')}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-semibold text-sm border border-cyan-500/30 backdrop-blur-md flex items-center gap-2 transition-all shadow-md"
              >
                <Box className="w-4 h-4 text-cyan-400" />
                Open 3D Subspace
              </button>

              <button
                onClick={() => onNavigate('history')}
                className="px-5 py-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 font-medium text-sm border border-slate-700/60 backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <History className="w-4 h-4 text-slate-400" />
                History
              </button>
            </div>

            {/* Micro Badge Row */}
            <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> WebGL 3D Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Gram-Schmidt Basis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> SVD Rank
              </span>
            </div>
          </div>

          {/* Right Column: 3D Interactive Stage / 3D Image Showcase */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Mode Switcher Tabs */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  3D Spatial Visualization
                </span>

                <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-700/80 backdrop-blur-md">
                  <button
                    onClick={() => setHeroViewMode('3d-canvas')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      heroViewMode === '3d-canvas'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    Live 3D WebGL
                  </button>
                  <button
                    onClick={() => setHeroViewMode('3d-render')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      heroViewMode === '3d-render'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    3D Render
                  </button>
                </div>
              </div>

              {heroViewMode === '3d-canvas' ? (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-900/20">
                  <VectorSpace3DViewer
                    analysis={latestAnalysis}
                    height="380px"
                    showControls={true}
                  />
                </div>
              ) : (
                <Card3DTilt maxTilt={14} scale={1.03}>
                  <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-900/30 group">
                    <img
                      src="/assets/math_3d_hero.jpg"
                      alt="3D Vector Space & Gram-Schmidt Coordinates"
                      className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/30 text-cyan-200 border border-cyan-400/40">
                          Gram-Schmidt Coordinate Frame
                        </span>
                        <h4 className="text-sm font-bold mt-1 text-white">
                          Multidimensional Vector Subspace
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        8K 3D Render
                      </span>
                    </div>
                  </div>
                </Card3DTilt>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3D Interactive Statistics Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card3DTilt maxTilt={10}>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Components</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestAnalysis ? latestAnalysis.components.length : '5–8'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {latestAnalysis ? 'Evaluated in current run' : 'Supported per student analysis'}
            </p>
          </div>
        </Card3DTilt>

        <Card3DTilt maxTilt={10}>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Matrix Rank</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestAnalysis
                ? `${latestAnalysis.rank} / ${latestAnalysis.max_possible_rank}`
                : 'r ≤ min(m, n)'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {latestAnalysis
                ? `${latestAnalysis.rank_utilization}% rank utilization`
                : 'Linearly independent axes'}
            </p>
          </div>
        </Card3DTilt>

        <Card3DTilt maxTilt={10}>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Independent Factors
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestAnalysis ? latestAnalysis.independent_factors.length : 'Basis dim'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {latestAnalysis ? 'Foundational basis factors' : 'Spans performance subspace'}
            </p>
          </div>
        </Card3DTilt>

        <Card3DTilt maxTilt={10}>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 dark:hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Dependent Factors
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <GitFork className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestAnalysis ? latestAnalysis.dependent_factors.length : 'Synthesized'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {latestAnalysis ? 'Linear combinations identified' : 'Formed by basis components'}
            </p>
          </div>
        </Card3DTilt>
      </section>

      {/* Featured 3D Subspace Spotlight Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-1/4 -mt-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3D Image with 3D Tilt */}
          <div className="lg:col-span-7">
            <Card3DTilt maxTilt={12} scale={1.02}>
              <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 shadow-2xl shadow-indigo-950/50 group">
                <img
                  src="/assets/math_3d_subspace.jpg"
                  alt="3D Holographic Academic Performance Subspace"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-indigo-400/40 text-[11px] font-mono text-indigo-300 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  Hypercube Subspace Projection
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs text-indigo-300 font-mono">Linear Algebra & SVD</span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Decomposing High-Dimensional Academic Trajectories
                  </h3>
                </div>
              </div>
            </Card3DTilt>
          </div>

          {/* Right: Architectural Subspace Insights */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Mathematical Subspace Architecture
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Why Linear Algebra in 3D Changes Academic Analytics
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Conventional scorecards present grades in isolated scalar columns. Our 3D vector
              engine transforms academic courses into orthogonal basis vectors, enabling instructors
              to calculate:
            </p>

            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300">Dimension Reduction (SVD):</strong> Isolates
                  the true orthogonal competency axes and eliminates redundant cross-correlations.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">Gram-Schmidt Orthogonalization:</strong>{' '}
                  Calculates unit basis coordinates e_k with zero cross-factor interference.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Orthogonal Projection & Residuals:</strong>{' '}
                  Quantifies true mathematical representation fidelity and highlights domain mastery.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('visualization')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Launch Interactive 3D Visualizer</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sequential Mathematical Pipeline */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Mathematical Workflow Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The exact sequential linear algebra process applied to student marks
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            7 Mathematical Stages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {WORKFLOW_STEPS.map((step, idx) => (
            <Card3DTilt key={idx} maxTilt={8} scale={1.03}>
              <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors h-full">
                <div>
                  <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                    {step.step}
                  </span>
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600">
                    →
                  </div>
                )}
              </div>
            </Card3DTilt>
          ))}
        </div>
      </section>

      {/* Core Principles Implemented */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Core Linear Algebra Principles Implemented
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONCEPT_CARDS.map((card, idx) => (
            <Card3DTilt key={idx} maxTilt={10}>
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-cyan-300 border border-blue-200/50 dark:border-cyan-800/50">
                      {card.symbol}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Mathematically Verified
                  </span>
                  <span className="font-mono">Concept 0{idx + 1}</span>
                </div>
              </div>
            </Card3DTilt>
          ))}
        </div>
      </section>

      {/* Action Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 text-center sm:text-left relative z-10">
          <h3 className="text-xl font-bold">Ready to analyze academic dependencies in 3D?</h3>
          <p className="text-xs text-blue-100 max-w-xl">
            Input student marks in 5 to 8 academic components, or click "Start New Analysis" to
            witness the full 7-step linear algebra workflow and real-time 3D vector projections.
          </p>
        </div>

        <button
          onClick={() => onNavigate('new-analysis')}
          className="relative z-10 px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          Compute Decomposition
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
