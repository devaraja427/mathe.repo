import React from 'react';
import {
  TrendingUp,
  Compass,
  Target,
  Radar,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { AnalysisResponse } from '../types/analysis';
import { MarksBarChart } from '../components/charts/MarksBarChart';
import { FactorBreakdownChart } from '../components/charts/FactorBreakdownChart';
import { BasisContributionChart } from '../components/charts/BasisContributionChart';
import { ProjectionChart } from '../components/charts/ProjectionChart';
import { RadarComparisonChart } from '../components/charts/RadarComparisonChart';
import { VectorSpace3DViewer } from '../components/3d/VectorSpace3DViewer';
import { Card3DTilt } from '../components/3d/Card3DTilt';

interface VisualizationProps {
  analysis: AnalysisResponse;
}

export const Visualization: React.FC<VisualizationProps> = ({ analysis }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Visualizing Academic Performance Space
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore 3D basis vectors, Gram-Schmidt orthogonalization planes, and multi-chart decompositions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" />
            {'3D Coordinate Space $\\mathbb{R}^3$'}
          </span>
        </div>
      </div>

      {/* Featured 3D Interactive WebGL Explorer */}
      <VectorSpace3DViewer
        analysis={analysis}
        height="480px"
        showControls={true}
      />

      {/* Grid of 2D / 3D Tilt Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Academic Marks Bar Chart */}
        <Card3DTilt maxTilt={6}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 h-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  1. Academic Marks Distribution
                </h4>
                <p className="text-[11px] text-slate-400">
                  Blue indicates basis-generating independent factors; orange indicates dependent factors.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-cyan-400">
                Marks (0-100)
              </span>
            </div>
            <MarksBarChart
              components={analysis.components}
              independentNames={analysis.independent_factors.map((f) => f.name)}
            />
          </div>
        </Card3DTilt>

        {/* Chart 2: Factor Independence Breakdown */}
        <Card3DTilt maxTilt={6}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 h-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  2. Factor Independence Breakdown
                </h4>
                <p className="text-[11px] text-slate-400">
                  Proportion of fundamental competencies vs synthesized dependent courses.
                </p>
              </div>
              <Compass className="w-4 h-4 text-indigo-500" />
            </div>
            <FactorBreakdownChart
              independentCount={analysis.independent_factors.length}
              dependentCount={analysis.dependent_factors.length}
            />
          </div>
        </Card3DTilt>

        {/* Chart 3: Vector Projection Comparison */}
        <div className="lg:col-span-2">
          <Card3DTilt maxTilt={4}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    3. Subspace Reconstruction: Original vs Projected vs Residual Error
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Compares the student’s actual performance coordinates with their orthogonal projection onto B.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {analysis.percentage_representation}% Subspace Fidelity
                </div>
              </div>
              <ProjectionChart
                dimensionNames={analysis.dimension_names}
                performanceVector={analysis.performance_vector}
                projectedVector={analysis.projection}
                residualVector={analysis.residual}
              />
            </div>
          </Card3DTilt>
        </div>

        {/* Chart 4: Basis Coordinates & Contribution */}
        <Card3DTilt maxTilt={6}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 h-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  4. Projection Coordinates Along Basis
                </h4>
                <p className="text-[11px] text-slate-400">
                  Inner products c_i = p · e_i along each orthonormal direction.
                </p>
              </div>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <BasisContributionChart
              basisNames={analysis.basis_names}
              projectionCoefficients={analysis.projection_coefficients}
            />
          </div>
        </Card3DTilt>

        {/* Chart 5: Multi-dimensional Radar Coverage */}
        <Card3DTilt maxTilt={6}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 h-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  5. Dimensional Performance Radar Profile
                </h4>
                <p className="text-[11px] text-slate-400">
                  Radial visualization across 5 foundational curricular axes.
                </p>
              </div>
              <Radar className="w-4 h-4 text-blue-500" />
            </div>
            <RadarComparisonChart
              dimensionNames={analysis.dimension_names}
              performanceVector={analysis.performance_vector}
              projectedVector={analysis.projection}
            />
          </div>
        </Card3DTilt>

        {/* Chart 6: Rank Utilization Gauge */}
        <div className="lg:col-span-2">
          <Card3DTilt maxTilt={4}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    6. Rank Dimensionality Utilization Gauge
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {`Evaluation of matrix rank ($r = ${analysis.rank}$) relative to theoretical maximum dimensionality ($r_{max} = ${analysis.max_possible_rank}$).`}
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">
                    Degrees of Freedom Spanned: {analysis.rank} / {analysis.max_possible_rank}
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                    {analysis.rank_utilization}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.rank_utilization}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Interpretation: A rank utilization of {analysis.rank_utilization}% demonstrates that the student’s curricular profile expands across {analysis.rank} distinct orthogonal directions, preserving independent strengths while identifying dependent crossover competencies.
                </p>
              </div>
            </div>
          </Card3DTilt>
        </div>
      </div>
    </div>
  );
};
