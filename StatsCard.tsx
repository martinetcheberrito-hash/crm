
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendUp, color = "emerald" }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl shadow-sm hover:border-emerald-500/30 transition-all group overflow-hidden relative">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-emerald-500/10 transition-colors border border-slate-700/50">
          <Icon className="w-6 h-6 text-emerald-500" />
        </div>
        {trend && (
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${trendUp ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-black text-white mt-2 font-mono tracking-tighter">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
