import {TrendingUp} from 'lucide-react';
import type {ReactNode} from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: ReactNode;
  loading: boolean;
}

export function StatCard({label, value, trend, icon, loading}: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl border border-outline/10 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200">
      <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-125">
        {icon}
      </div>
      <p className="text-xs font-bold tracking-widest uppercase text-tertiary mb-2">{label}</p>
      <h2 className="text-4xl font-serif font-bold text-primary mb-4">{loading ? '…' : value}</h2>
      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
        <TrendingUp size={14} className="text-secondary" /> <span>{trend}</span>
      </div>
    </div>
  );
}
