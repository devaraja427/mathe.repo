import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarComparisonChartProps {
  dimensionNames: string[];
  performanceVector: number[];
  projectedVector: number[];
}

export const RadarComparisonChart: React.FC<RadarComparisonChartProps> = ({
  dimensionNames,
  performanceVector,
  projectedVector,
}) => {
  const data = dimensionNames.map((dim, idx) => ({
    dimension: dim,
    Performance: Number((performanceVector[idx] || 0).toFixed(1)),
    SubspaceBasis: Number((projectedVector[idx] || 0).toFixed(1)),
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#94a3b8" opacity={0.3} />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#64748b' }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 9, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Radar
            name="Performance Vector (p)"
            dataKey="Performance"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Radar
            name="Subspace Basis Projection (proj_B(p))"
            dataKey="SubspaceBasis"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
