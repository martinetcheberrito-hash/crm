
import React, { useState, useRef } from 'react';
import { X, BrainCircuit, Mail, Phone, Calendar, DollarSign, FileText, Loader2, Zap, Target, Image as ImageIcon, MessageSquare, ChevronDown, Globe, BarChart, AlertCircle, Users, CheckCircle2, XCircle, MapPin, TrendingUp, Clock, UserCheck, ShieldCheck, UserMinus } from 'lucide-react';
import { Lead, LeadOrigin, Qualification, LeadStatus } from './types';
import { generateLeadStrategy, analyzeChatScreenshot } from './geminiService';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate?: (updatedLead: Lead) => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onUpdate }) => {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [chatAnalysis, setChatAnalysis] = useState<string | null>(lead.chat_analysis || null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateField = (field: keyof Lead, value: any) => {
    if (onUpdate) onUpdate({ ...lead, [field]: value });
  };

  const handleGenerateStrategy = async () => {
    setLoadingStrategy(true);
    try {
      const result = await generateLeadStrategy(lead);
      setStrategy(result);
    } catch (err) { console.error(err); } finally { setLoadingStrategy(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingAnalysis(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const result = await analyzeChatScreenshot(base64String, lead);
        setChatAnalysis(result);
        if (onUpdate) onUpdate({ ...lead, chat_analysis: result });
      } catch (err) { console.error(err); } finally { setLoadingAnalysis(false); }
    };
    reader.readAsDataURL(file);
  };

  const formatAIDeliverable = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={`${line.trim().startsWith('•') ? 'ml-2 mb-1' : line.trim() === '' ? 'h-4' : 'font-bold text-emerald-400 mt-4 mb-2 uppercase text-[10px] tracking-widest'}`}>
        {line}
      </p>
    ));
  };

  const qualStyles = {
    [Qualification.LEVEL_1]: 'bg-emerald-500 text-slate-950',
    [Qualification.LEVEL_2]: 'bg-emerald-800 text-emerald-100',
    [Qualification.LEVEL_3]: 'bg-slate-800 text-slate-400',
    [Qualification.NO_CALIF]: 'bg-rose-600 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-[#0f172a] border border-slate-800 w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg ${qualStyles[lead.qualification || Qualification.LEVEL_1]}`}>
              <span className="text-3xl font-black">{lead.qualification || '?'}</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{lead.name}</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" /> {lead.country || 'GLOBAL'}
                </div>
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                <div className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">{lead.origin}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-right">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Gross Revenue</p>
                <p className="text-2xl font-mono font-black text-emerald-500">${lead.revenue?.toLocaleString() || '0'}</p>
             </div>
             <button onClick={onClose} className="p-4 hover:bg-slate-800 rounded-full transition-all text-slate-500 hover:text-white">
                <X className="w-7 h-7" />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-950/20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800/50 space-y-6 shadow-xl">
              <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Clock className="w-4 h-4" /> Operativo
              </h4>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Cualificación</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:border-emerald-500 outline-none transition-all"
                    value={lead.qualification}
                    onChange={(e) => handleUpdateField('qualification', e.target.value)}
                  >
                    <option value={Qualification.LEVEL_1}>Nivel 1</option>
                    <option value={Qualification.LEVEL_2}>Nivel 2</option>
                    <option value={Qualification.LEVEL_3}>Nivel 3</option>
                    <option value={Qualification.NO_CALIF}>Descartado</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Asistencia</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleUpdateField('attended', 'Si')}
                      className={`py-2.5 rounded-xl text-[10px] font-black border transition-all ${lead.attended === 'Si' ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                    >SÍ</button>
                    <button 
                      onClick={() => handleUpdateField('attended', 'No')}
                      className={`py-2.5 rounded-xl text-[10px] font-black border transition-all ${lead.attended === 'No' ? 'bg-rose-500 border-rose-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                    >NO</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Atribución</label>
                  <div className="space-y-3">
                    <input 
                      type="text"
                      placeholder="Nombre del Setter"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:border-emerald-500 outline-none transition-all"
                      value={lead.setter || ''}
                      onChange={(e) => handleUpdateField('setter', e.target.value)}
                    />
                    <input 
                      type="text"
                      placeholder="Nombre del Closer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:border-emerald-500 outline-none transition-all"
                      value={lead.closer || ''}
                      onChange={(e) => handleUpdateField('closer', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Notas de Triager</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 outline-none focus:border-emerald-500 min-h-[120px] resize-none"
                    placeholder="Contexto crítico..."
                    value={lead.notes}
                    onChange={(e) => handleUpdateField('notes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900 border border-emerald-500/10 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px]"></div>
               
               <div className="flex items-center justify-between">
                  <h4 className="text-white text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Liquidación y Comisiones
                  </h4>
                  <div className={`flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black tracking-[0.2em] ${lead.bought ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-700'}`}>
                    {lead.bought ? 'SALE COMPLETED' : 'IN PROGRESS'}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Cash Collected ($)</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-2xl font-mono font-black text-emerald-500 outline-none focus:border-emerald-500 shadow-inner transition-all"
                      value={lead.collected_amount}
                      onChange={(e) => handleUpdateField('collected_amount', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Total Revenue ($)</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-2xl font-mono font-black text-white outline-none focus:border-emerald-500 shadow-inner transition-all"
                      value={lead.revenue}
                      onChange={(e) => handleUpdateField('revenue', Number(e.target.value))}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 p-6 bg-slate-950/40 rounded-3xl border border-slate-800">
                  <div className="space-y-2">
                    <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">
                      <UserCheck className="w-3 h-3 text-emerald-500" /> Comis. Setter ($)
                    </label>
                    <input 
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm font-mono font-black text-emerald-400 outline-none focus:border-emerald-500"
                      value={lead.setter_commission || 0}
                      onChange={(e) => handleUpdateField('setter_commission', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Comis. Closer ($)
                    </label>
                    <input 
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm font-mono font-black text-emerald-400 outline-none focus:border-emerald-500"
                      value={lead.closer_commission || 0}
                      onChange={(e) => handleUpdateField('closer_commission', Number(e.target.value))}
                    />
                  </div>
               </div>

               <button 
                  onClick={() => handleUpdateField('bought', !lead.bought)}
                  className={`w-full py-6 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl ${lead.bought ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
               >
                  {lead.bought ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {lead.bought ? 'REGISTRO DE VENTA EXITOSO' : 'REGISTRAR CIERRE FINAL'}
               </button>

               <div className="flex gap-4 pt-4">
                 <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-all">
                    <ImageIcon className="w-6 h-6 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Scan Chat</span>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                 </button>
                 <button onClick={handleGenerateStrategy} className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl flex flex-col items-center gap-2 hover:bg-emerald-500/10 transition-all">
                    <BrainCircuit className="w-6 h-6 text-emerald-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">AI Logic</span>
                 </button>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] h-[400px] flex flex-col shadow-xl overflow-hidden">
               <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Synthesis</span>
               </div>
               <div className="p-8 overflow-y-auto flex-1 text-[11px] text-slate-300 leading-relaxed font-medium">
                  {loadingAnalysis || loadingStrategy ? (
                    <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
                  ) : chatAnalysis || strategy ? formatAIDeliverable(chatAnalysis || strategy) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4 grayscale">
                       <Target className="w-12 h-12" />
                       <p className="font-black uppercase tracking-[0.2em]">Waiting for AI prompt</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
