
import React, { useMemo } from 'react';
import { Lead, LeadOrigin, Qualification } from '../types';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Users, 
  Zap, 
  PieChart,
  Activity,
  Wallet,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  UserCheck2
} from 'lucide-react';

interface ReportsViewProps {
  leads: Lead[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ leads }) => {
  const metrics = useMemo(() => {
    const totalRevenue = leads.reduce((acc, l) => acc + (l.revenue || 0), 0);
    const totalCollected = leads.reduce((acc, l) => acc + (l.collected_amount || 0), 0);
    const totalSetterCommissions = leads.reduce((acc, l) => acc + (l.setter_commission || 0), 0);
    const totalCloserCommissions = leads.reduce((acc, l) => acc + (l.closer_commission || 0), 0);
    const totalCommissions = totalSetterCommissions + totalCloserCommissions;
    
    const payingLeads = leads.filter(l => l.bought).length;
    const avgTicket = payingLeads > 0 ? totalRevenue / payingLeads : 0;
    const collectionEfficiency = totalRevenue > 0 ? (totalCollected / totalRevenue) * 100 : 0;

    // Personnel breakdown (Setters)
    const setterStats = leads.reduce((acc: any, lead) => {
      const name = lead.setter || 'Sin Asignar';
      if (!acc[name]) acc[name] = { name, count: 0, sales: 0, commissions: 0 };
      acc[name].count++;
      if (lead.bought) acc[name].sales++;
      acc[name].commissions += (lead.setter_commission || 0);
      return acc;
    }, {});

    // Personnel breakdown (Closers)
    const closerStats = leads.reduce((acc: any, lead) => {
      const name = lead.closer || 'Sin Asignar';
      if (!acc[name]) acc[name] = { name, count: 0, sales: 0, commissions: 0 };
      acc[name].count++;
      if (lead.bought) acc[name].sales++;
      acc[name].commissions += (lead.closer_commission || 0);
      return acc;
    }, {});

    // Origin analysis
    const origins = Object.values(LeadOrigin).map(origin => {
      const count = leads.filter(l => l.origin === origin).length;
      const sales = leads.filter(l => l.origin === origin && l.bought).length;
      const conversion = count > 0 ? (sales / count) * 100 : 0;
      return { name: origin, count, sales, conversion };
    }).sort((a, b) => b.count - a.count);

    return {
      totalRevenue,
      totalCollected,
      totalCommissions,
      totalSetterCommissions,
      totalCloserCommissions,
      avgTicket,
      collectionEfficiency,
      origins,
      setterStats: Object.values(setterStats).sort((a: any, b: any) => b.commissions - a.commissions),
      closerStats: Object.values(closerStats).sort((a: any, b: any) => b.commissions - a.commissions),
      totalLeads: leads.length,
      payingLeads
    };
  }, [leads]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Llama BI</h1>
        <p className="text-slate-500 font-medium italic">Inteligencia de negocio y rendimiento financiero.</p>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Recaudación Real" 
          value={`$${metrics.totalCollected.toLocaleString()}`} 
          subValue={`${metrics.collectionEfficiency.toFixed(1)}% Cobrado`} 
          icon={Wallet} 
          color="emerald" 
        />
        <KPICard 
          label="Ticket Promedio" 
          value={`$${metrics.avgTicket.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          subValue="Por cierre de venta" 
          icon={Zap} 
          color="emerald" 
        />
        <KPICard 
          label="Total Comisiones" 
          value={`$${metrics.totalCommissions.toLocaleString()}`} 
          subValue={`Setter: $${metrics.totalSetterCommissions.toLocaleString()} / Closer: $${metrics.totalCloserCommissions.toLocaleString()}`} 
          icon={UserCheck2} 
          color="emerald" 
        />
        <KPICard 
          label="Ebitda Estimado" 
          value={`$${(metrics.totalCollected - metrics.totalCommissions).toLocaleString()}`} 
          subValue="Neto post-comisiones" 
          icon={TrendingUp} 
          color="emerald" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance by Setter */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" /> Rendimiento de Setters
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.setterStats.map((person: any) => (
              <div key={person.name} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-[10px] font-black text-emerald-500 uppercase">
                    {person.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{person.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{person.sales} CIERRES / {person.count} LEADS</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-black text-emerald-400">${person.commissions.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">COMISIÓN ACUM.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance by Closer */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Rendimiento de Closers
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.closerStats.map((person: any) => (
              <div key={person.name} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase">
                    {person.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{person.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{person.sales} CIERRES / {person.count} LEADS</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-black text-emerald-400">${person.commissions.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">COMISIÓN ACUM.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance by Origin */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" /> Rendimiento por Plataforma
            </h3>
          </div>
          <div className="space-y-6">
            {metrics.origins.filter(o => o.count > 0).map(origin => (
              <div key={origin.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{origin.name}</span>
                    <span className="text-[9px] text-slate-600 font-bold">{origin.count} leads</span>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-500">{origin.conversion.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                    style={{ width: `${origin.conversion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Flow */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col justify-center gap-8 shadow-xl">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Flujo de Caja Consolidado</p>
              <h4 className="text-5xl font-mono font-black text-white italic">
                ${metrics.totalCollected.toLocaleString()}
              </h4>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-center">
                 <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Comisiones (Out)</p>
                 <p className="text-xl font-mono font-black text-rose-400">-${metrics.totalCommissions.toLocaleString()}</p>
              </div>
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center">
                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Margen Operativo</p>
                 <p className="text-xl font-mono font-black text-emerald-400">${(metrics.totalCollected - metrics.totalCommissions).toLocaleString()}</p>
              </div>
           </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="flex justify-between items-center p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-xs font-medium text-slate-500">
            Sincronización en tiempo real activa. Los datos financieros reflejan el estado del <span className="text-emerald-500 font-black uppercase tracking-widest">Trackboard Central</span>.
          </p>
        </div>
        <button className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-[0.2em] transition-all flex items-center gap-2 px-6 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20">
          Descargar Reporte (.PDF) <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, subValue, icon: Icon, color }: { label: string, value: string | number, subValueText?: string, subValue?: string, icon: any, color: string }) => {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] group hover:border-emerald-500/40 transition-all shadow-xl relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/5 blur-3xl rounded-full"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl transition-all ${colorMap[color] || colorMap.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">{label}</p>
      <h3 className="text-3xl font-black text-white mt-2 font-mono tracking-tighter relative z-10">{value}</h3>
      <p className="text-[9px] font-bold text-slate-600 uppercase mt-2 tracking-widest relative z-10">{subValue}</p>
    </div>
  );
};

export default ReportsView;
