
import React, { useState } from 'react';
import { X, Save, ChevronDown, Globe, MapPin, Calendar } from 'lucide-react';
import { Lead, LeadStatus, LeadOrigin, Qualification } from '../types';

interface NewLeadModalProps {
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'created_at'>) => void;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Argentina',
    website: '',
    decision_maker: 'No necesito a nadie para tomar decisiones.',
    ad_spend: '',
    monthly_revenue: '',
    main_problem: '',
    qualification: Qualification.LEVEL_1,
    value: 0,
    origin: LeadOrigin.TIKTOK,
    notes: '',
    call_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      call_date: new Date(formData.call_date).toISOString(),
      status: LeadStatus.NEW,
      attended: 'Pendiente',
      whatsapp_confirmed: 'Pendiente',
      offer_made: false,
      bought: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-950/20">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Registrar Prospecto</h2>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Llama Ecom Group Intake</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre y Apellido *</label>
              <input 
                required
                placeholder="Ej. Lautaro Freres"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha de Agenda *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                  value={formData.call_date}
                  onChange={e => setFormData({...formData, call_date: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Corporativo *</label>
              <input 
                required
                type="email"
                placeholder="email@ejemplo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">País *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  placeholder="País de residencia"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp / Teléfono *</label>
              <input 
                required
                placeholder="+54 9..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cualificación Inicial</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                  value={formData.qualification}
                  onChange={e => setFormData({...formData, qualification: e.target.value as Qualification})}
                >
                  <option value={Qualification.LEVEL_1}>Nivel 1 (Prioridad Alta)</option>
                  <option value={Qualification.LEVEL_2}>Nivel 2 (Intermedio)</option>
                  <option value={Qualification.LEVEL_3}>Nivel 3 (Filtro)</option>
                  <option value={Qualification.NO_CALIF}>Descartar</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Página Web / Redes</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                placeholder="URL de negocio"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Canal de Origen</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                  value={formData.origin}
                  onChange={e => setFormData({...formData, origin: e.target.value as LeadOrigin})}
                >
                  {Object.values(LeadOrigin).map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2 pb-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas de Contexto</label>
            <textarea 
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 outline-none focus:border-emerald-500 resize-none transition-all"
              placeholder="¿Qué busca el cliente?..."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]"
          >
            <Save className="w-5 h-5" /> Confirmar Agenda
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;
