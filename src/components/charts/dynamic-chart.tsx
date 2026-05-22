'use client';

import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { downloadImage } from '@/lib/exportUtils';
import { useId } from 'react';

export function DynamicChart({ data, type }: { data?: any, type?: 'bar' | 'pie' | 'line' }) {
  // If no data provided, we use a fallback mock data based on the user's query example
  const mockData = data || [
    { name: 'Home Loan', value: 12500000 },
    { name: 'LAP', value: 8500000 },
    { name: 'MSME', value: 6200000 },
    { name: 'Personal', value: 3100000 },
    { name: 'Auto', value: 2400000 },
  ];

  const chartType = type || 'bar';
  const COLORS = ['#0284c7', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];
  const chartId = useId().replace(/:/g, '');

  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <PieChart>
          <Pie data={mockData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label isAnimationActive={false}>
            {mockData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
          <Legend />
        </PieChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart data={mockData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Disbursed']} />
          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} isAnimationActive={false} />
        </LineChart>
      );
    }

    // Default Bar Chart
    return (
      <BarChart data={mockData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#38bdf8' }} formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Disbursed']} />
        <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    );
  };

  return (
    <div id={`chart-container-${chartId}`} className="h-[320px] w-full max-w-[500px] mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700 relative group">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Data Visualization
        </h3>
        <button 
          onClick={() => downloadImage(`chart-container-${chartId}`, 'chart-export.png')}
          className="text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1"
          title="Download as PNG"
        >
          <Download size={16} />
        </button>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
