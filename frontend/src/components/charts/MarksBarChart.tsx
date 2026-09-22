import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { AcademicComponent } from '../../types/analysis';

interface MarksBarChartProps {
  components: AcademicComponent[];
  independentNames: string[];
}

export const MarksBarChart: React.FC<MarksBarChartProps> = ({
  components,
  independentNames,
}) => {
  const indSet = new Set(independentNames);

  const data = components.map((c) => ({
    name: c.name,
    marks: c.marks,
    status: indSet.has(c.name) ? 'Independent (Basis)' : 'Dependent (Synthesized)',
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#2a64b6ff' }}
            label={{ value: 'Marks (%)', angle: -90, position: 'insideLeft', fill: '#0e2c55ff', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#0f3a65ff',
              fontSize: '12px',
            }}
            formatter={(value: number, _name: string, item: any) => [
              `${value} / 100 (${item.payload.status})`,
              'Score',
            ]}
          />
          <Bar dataKey="marks" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.status.startsWith('Independent') ? '#2563eb' : '#f59e0b'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
