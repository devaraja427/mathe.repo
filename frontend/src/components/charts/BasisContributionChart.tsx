import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

interface BasisContributionChartProps {
  basisNames: string[];
  projectionCoefficients: number[];
}

export const BasisContributionChart: React.FC<BasisContributionChartProps> = ({
  basisNames,
  projectionCoefficients,
}) => {
  const data = basisNames.map((name, idx) => ({
    name: `e_${idx + 1} (${name.length > 10 ? name.slice(0, 9) + '..' : name})`,
    fullName: name,
    coefficient: projectionCoefficients[idx] || 0,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            formatter={(val: number) => [`${val.toFixed(2)}`, 'Projection Coordinate (p · e_i)']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
          />
          <Bar dataKey="coefficient" radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
