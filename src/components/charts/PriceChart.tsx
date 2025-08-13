import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PriceChartProps {
  data: { time: string; price: number }[];
  color?: string;
  height?: number;
}

export function PriceChart({ data, color = '#10b981', height = 300 }: PriceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          domain={['dataMin', 'dataMax']}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          labelFormatter={(label) => `Time: ${label}`}
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            border: 'none',
            borderRadius: '4px',
            color: '#fff'
          }}
        />
        <Area type="monotone" dataKey="price" stroke={color} fillOpacity={1} fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
