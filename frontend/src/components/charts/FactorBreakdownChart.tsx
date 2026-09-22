import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FactorBreakdownChartProps {
  independentCount: number;
  dependentCount: number;
}

export const FactorBreakdownChart: React.FC<FactorBreakdownChartProps> = ({
  independentCount,
  dependentCount,
}) => {
  const data = [
    { name: 'Independent Factors', value: independentCount, color: '#2563eb' },
    { name: 'Dependent Factors', value: dependentCount, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
