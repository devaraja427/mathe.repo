import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

interface ProjectionChartProps {
  dimensionNames: string[];
  performanceVector: number[];
  projectedVector: number[];
  residualVector: number[];
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  dimensionNames,
  performanceVector,
  projectedVector,
  residualVector,
}) => {
  const data = dimensionNames.map((dim, idx) => ({
    dimension: dim.length > 12 ? dim.slice(0, 11) + '..' : dim,
    fullName: dim,
    Original: performanceVector[idx] || 0,
    Projected: projectedVector[idx] || 0,
    Residual: Math.abs(residualVector[idx] || 0),
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
          <XAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: '#64748b' }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            formatter={(val: number, name: string) => [`${val.toFixed(2)}`, name]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="Original" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Projected" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Residual" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
