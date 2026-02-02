import React from 'react';
import { formatCurrency } from '../utils/format';

interface SummaryCardProps {
  title: string;
  value: number;
  type?: 'neutral' | 'positive' | 'negative' | 'info';
  icon?: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, type = 'neutral', icon }) => {
  let colorClass = 'text-slate-900';
  let bgClass = 'bg-white';

  if (type === 'positive') {
    colorClass = value >= 0 ? 'text-emerald-600' : 'text-rose-600';
    bgClass = 'bg-white';
  } else if (type === 'negative') {
    colorClass = 'text-rose-600';
  } else if (type === 'info') {
    colorClass = 'text-blue-600';
  }

  return (
    <div className={`p-4 rounded-xl shadow-sm border border-slate-200 ${bgClass} flex flex-col justify-between h-full`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{formatCurrency(value)}</p>
    </div>
  );
};