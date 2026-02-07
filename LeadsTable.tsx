
import React from 'react';
import { User, ChevronRight, Zap, Target, Globe, CheckCircle2, XCircle, Calendar, Clock } from 'lucide-react';
import { Lead, Qualification } from '../types';

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onSelectLead }) => {
  const getQualColor = (qual?: Qualification) => {
    switch (qual) {
      case Qualification.LEVEL_1: return 'bg-emerald-500 text-slate-950';
      case Qualification.LEVEL_2: return 'bg-emerald-800/50 text-emerald-400 border border-emerald-700';
      case Qualification.LEVEL_3: return 'bg-slate-800 text-slate-400';
      case Qualification.NO_CALIF: return 'bg-rose-600 text-white';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  const getAttendanceDisplay = (lead: Lead) => {
    if (lead.attended === 'Si') {
      return (
        <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
          <CheckCircle2 className="w-3.5 h-3.5" /> ASISTIÓ
        </div>
      );
    }
    
    if (lead.attended === 'No') {
      return (
        <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-widest">
          <XCircle className="w-3.5 h-3.5" /> NO ASISTIÓ
        </div>
      );
    }

    if (lead.call_date) {
      const now = new Date(); now.setHours(0,0,0,0);
      const callDate = new Date(lead.call_date); callDate.setHours(0,0,0,0);
      const diffDays = Math.ceil((callDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase animate-pulse"><Clock className="w-3.5 h-3.5" /> HOY</div>;
      } else if (diffDays === 1) {
        return <div className="flex items-center gap-1.5 text-emerald-400/60 text-[10px] font-black uppercase"><Clock className="w-3.5 h-3.5" /> MAÑANA</div>;
      } else if (diffDays > 1) {
        return <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase"><Clock className="w-3.5 h-3.5" /> EN {diffDays} DÍAS</div>;
      }
    }

    return <div className="text-slate-700 text-[10px] font-black uppercase tracking-widest">PENDIENTE</div>;
  };

  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/40 border-b border-slate-800">
              <th className="px-8 py-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">Qual</th>
              <th className="px-8 py-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">Client & Schedule</th>
              <th className="px-8 py-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">Origin</th>
              <th className="px-8 py-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">Status</th>
              <th className="px-8 py-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">Total Rev</th>
              <th className="px-8 py-6 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {leads.map((lead) => (
              <tr 
                key={lead.id} 
                className="hover:bg-emerald-500/[0.02] transition-all group cursor-pointer" 
                onClick={() => onSelectLead(lead)}
              >
                <td className="px-8 py-5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${getQualColor(lead.qualification)}`}>
                    {lead.qualification || '?'}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                      <User className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">{lead.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter">Agenda: {formatDate(lead.call_date)}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20 uppercase tracking-widest">
                     {lead.origin}
                   </span>
                </td>
                <td className="px-8 py-5">
                   {getAttendanceDisplay(lead)}
                </td>
                <td className="px-8 py-5">
                   <div className="flex flex-col">
                      <span className="text-sm font-mono font-black text-white">${lead.revenue?.toLocaleString() || '0'}</span>
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">COLLECTED: ${lead.collected_amount?.toLocaleString() || '0'}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
