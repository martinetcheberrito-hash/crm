
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, TrendingUp, BarChart3, Plus, Search, Bell, LayoutDashboard, UserCircle, Briefcase, 
  Settings, ShieldCheck, Filter, ArrowRight, Target, Zap, DollarSign, Calendar as CalendarIcon, 
  ArrowRightLeft, Loader2, AlertCircle, RefreshCw, UserCheck2
} from 'lucide-react';
import { Lead, LeadStatus, LeadOrigin, DashboardStats, Qualification } from './types';
import { supabase } from './supabase';
import StatsCard from './StatsCard';
import LeadsTable from './LeadsTable';
import LeadDetailModal from './LeadDetailModal';
import NewLeadModal from './NewLeadModal';
import ReportsView from './ReportsView';

type View = 'dashboard' | 'leads' | 'deals' | 'reports' | 'settings';
type DateRange = '7days' | 'month' | 'all' | 'custom';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [customStartDate, setCustomStartDate] = useState<string>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError('Sincronización limitada. Verifica conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'created_at'>) => {
    const tempId = `L-${Math.random().toString(36).substr(2, 9)}`;
    const newLead: Lead = {
      ...newLeadData,
      id: tempId,
      created_at: new Date().toISOString()
    };

    setLeads([newLead, ...leads]);
    setShowNewLeadModal(false);

    try {
      const { error: insError } = await supabase.from('leads').insert([newLead]);
      if (insError) throw insError;
    } catch (err) {
      console.error('Error saving lead:', err);
      setError('Error al guardar en Supabase.');
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);

    try {
      const { error: updError } = await supabase
        .from('leads')
        .update(updatedLead)
        .eq('id', updatedLead.id);
      
      if (updError) throw updError;
    } catch (err) {
      console.error('Error updating lead:', err);
      setError('Error al actualizar registro.');
    }
  };

  const filteredLeadsByDate = useMemo(() => {
    const now = new Date();
    return leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      if (dateRange === '7days') return (now.getTime() - leadDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      if (dateRange === 'month') return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear();
      if (dateRange === 'custom') {
        const start = new Date(customStartDate); start.setHours(0,0,0,0);
        const end = new Date(customEndDate); end.setHours(23,59,59,999);
        return leadDate >= start && leadDate <= end;
      }
      return true;
    });
  }, [leads, dateRange, customStartDate, customEndDate]);

  const stats: DashboardStats = useMemo(() => {
    const totalCollected = filteredLeadsByDate.reduce((acc, l) => acc + (l.collected_amount || 0), 0);
    const totalCommissions = filteredLeadsByDate.reduce((acc, l) => acc + (l.setter_commission || 0) + (l.closer_commission || 0), 0);
    return {
      totalLeads: filteredLeadsByDate.length,
      monthlySales: totalCollected,
      totalCommissions,
      conversionRate: (filteredLeadsByDate.filter(l => l.bought).length / Math.max(filteredLeadsByDate.length, 1)) * 100,
      growth: 22.4
    };
  }, [filteredLeadsByDate]);

  const totalGrossRevenue = useMemo(() => {
    return filteredLeadsByDate.reduce((acc, l) => acc + (l.revenue || 0), 0);
  }, [filteredLeadsByDate]);

  const finalFilteredLeads = filteredLeadsByDate.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => {
    if (loading && leads.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Llama Syncing...</p>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Control Panel</h1>
                <p className="text-slate-500 font-medium">KPIs maestros de Llama Ecom Group.</p>
              </div>
              <div className="flex items-center bg-slate-900/50 border border-slate-800 p-1.5 rounded-2xl">
                {['7days', 'month', 'all'].map((range) => (
                  <button 
                    key={range}
                    onClick={() => setDateRange(range as DateRange)} 
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateRange === range ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {range === '7days' ? '7D' : range === 'month' ? 'Mes' : 'Todo'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Total Leads" value={stats.totalLeads} icon={Users} trend="Periodo" trendUp={true} color="emerald" />
              <StatsCard title="Net Collected" value={`$${stats.monthlySales.toLocaleString()}`} icon={DollarSign} trend="Caja" trendUp={true} color="emerald" />
              <StatsCard title="Gross Sales" value={`$${totalGrossRevenue.toLocaleString()}`} icon={TrendingUp} trend="Ventas" trendUp={true} color="emerald" />
              <StatsCard title="Ratio Cierre" value={`${stats.conversionRate.toFixed(1)}%`} icon={BarChart3} trend="Ratio" trendUp={true} color="emerald" />
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Agenda Reciente</h2>
              <LeadsTable leads={finalFilteredLeads.slice(0, 10)} onSelectLead={setSelectedLead} />
            </div>
          </div>
        );

      case 'leads': return <div className="space-y-6"><LeadsTable leads={finalFilteredLeads} onSelectLead={setSelectedLead} /></div>;
      case 'reports': return <ReportsView leads={filteredLeadsByDate} />;
      case 'deals': return <div className="text-center py-20 text-slate-700 font-black uppercase tracking-[0.3em]">Pipeline activo</div>;
      default: return <div className="text-center py-20 text-slate-700 font-black uppercase tracking-[0.3em]">Módulo {activeView}</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200">
      <aside className="w-72 border-r border-slate-900 bg-slate-950 flex flex-col hidden md:flex sticky top-0 h-screen z-40">
        <div className="p-10 flex items-center gap-5">
          <div className="relative w-10 h-10">
            <div className="absolute top-1 left-1 w-7 h-7 bg-emerald-500/40 rounded-lg blur-[2px]"></div>
            <div className="absolute top-0 left-0 w-8 h-8 bg-emerald-500 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
            <div className="absolute top-2 left-2 w-8 h-8 bg-emerald-400/30 rounded-lg backdrop-blur-[1px] border border-white/10"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter uppercase leading-none">LLAMA</span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">ECOM GROUP</span>
          </div>
        </div>
        
        <nav className="flex-1 px-6 py-8 space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavItem icon={Users} label="Trackboard" active={activeView === 'leads'} onClick={() => setActiveView('leads')} />
          <NavItem icon={Briefcase} label="Pipeline" active={activeView === 'deals'} onClick={() => setActiveView('deals')} />
          <NavItem icon={BarChart3} label="Reports & BI" active={activeView === 'reports'} onClick={() => setActiveView('reports')} />
          <div className="pt-10 border-t border-slate-900 mt-6">
            <NavItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 border-b border-slate-900 bg-slate-950/20 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input 
              type="text" 
              placeholder="Buscar prospecto..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 font-medium" 
            />
          </div>
          <div className="flex items-center gap-6">
             {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                <AlertCircle className="w-4 h-4" /> Sync Error
              </div>
            )}
            <button className="p-2 text-slate-600 hover:text-emerald-400 transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-10 w-px bg-slate-800/50"></div>
            <button onClick={() => setShowNewLeadModal(true)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase py-4 px-8 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 tracking-widest">
              NUEVO LEAD
            </button>
          </div>
        </header>

        <main className="flex-1 p-10 max-w-[1400px] mx-auto w-full overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleUpdateLead} />}
      {showNewLeadModal && <NewLeadModal onClose={() => setShowNewLeadModal(false)} onSave={handleAddLead} />}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900/40'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-slate-950' : 'text-slate-700'}`} />
    {label}
  </button>
);

export default App;
