import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Key, 
  FileKey, 
  QrCode, 
  ShieldCheck, 
  FileCode2, 
  MailCheck, 
  Lock, 
  UploadCloud, 
  RefreshCw, 
  Inbox, 
  FileCheck2, 
  Printer, 
  Award,
  Filter,
  Sparkles
} from 'lucide-react';
import { dteRequirementsList } from '../../data/mockData';
import type { PMVRequirementDetail } from '../../types';

export const DTERequirementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos (14)' },
    { id: 'Criptografía Base', label: '1. Criptografía Base' },
    { id: 'Flujo Emisión DTE', label: '2. Flujo Emisión DTE' },
    { id: 'Arquitectura Backend', label: '3. Arquitectura & Colas' },
    { id: 'Certificación Maullín', label: '4. Ambiente Maullín' },
    { id: 'Intercambio Comercial', label: '5. Intercambio Comercial' }
  ];

  const filteredRequirements = selectedCategory === 'all'
    ? dteRequirementsList
    : dteRequirementsList.filter((r) => r.category === selectedCategory);

  const getRequirementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Key': return <Key className="w-5 h-5 text-amber-600" />;
      case 'FileKey': return <FileKey className="w-5 h-5 text-blue-600" />;
      case 'QrCode': return <QrCode className="w-5 h-5 text-indigo-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'FileCode2': return <FileCode2 className="w-5 h-5 text-cyan-600" />;
      case 'MailCheck': return <MailCheck className="w-5 h-5 text-blue-700" />;
      case 'Lock': return <Lock className="w-5 h-5 text-rose-600" />;
      case 'UploadCloud': return <UploadCloud className="w-5 h-5 text-blue-600" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-emerald-600" />;
      case 'Inbox': return <Inbox className="w-5 h-5 text-teal-600" />;
      case 'FileCheck2': return <FileCheck2 className="w-5 h-5 text-indigo-600" />;
      case 'Printer': return <Printer className="w-5 h-5 text-slate-700" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-600" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-dte-primary to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-900/70">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Especificación de Facturación Electrónica (DTE) • SII Chile
            </span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-white">
            Matriz de Requerimientos Criptográficos y Normativos
          </h1>
          <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
            Consolidado integral de los 14 requerimientos técnicos obligatorios para operar un motor de DTE propio: 
            gestión criptográfica (XMLDSig RSA-SHA1, C14N), esquemas XML en codificación ISO-8859-1, doble sobre EnvioDTE,
            comunicación asíncrona SOAP/REST con el SII, certificación en Maullín y acuses de la Ley 19.983.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center flex flex-col justify-center min-w-[160px]">
          <span className="text-3xl font-headline font-extrabold text-amber-400 font-mono">14 / 14</span>
          <span className="text-[10px] text-blue-100 uppercase font-bold tracking-wider mt-1">Requerimientos</span>
          <span className="text-[10px] bg-emerald-500 text-white font-bold px-3 py-1 rounded-full mt-2 inline-flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 mr-1" /> 100% Cubierto
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-dte-primary text-white shadow-sm font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Requirements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRequirements.map((req) => (
          <div 
            key={req.num}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-dte-primary hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Card Top: Number, Category & Normative Ref */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-slate-100 rounded-2xl border border-slate-200 flex-shrink-0">
                    {getRequirementIcon(req.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Requerimiento #{req.num} • {req.category}
                      </span>
                    </div>
                    <h3 className="text-base font-headline font-bold text-slate-900 leading-snug mt-0.5">
                      {req.title}
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Cubierto
                </span>
              </div>

              {/* Normative Reference Badge */}
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="text-slate-400 font-semibold">Norma SII:</span>
                <span className="bg-blue-50 text-blue-900 border border-blue-200 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                  {req.siiNormativeRef}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  req.criticality === 'Crítica' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  Criticidad {req.criticality}
                </span>
              </div>

              {/* Exact Description Box */}
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                "{req.description}"
              </p>

              {/* Technical Implementation details */}
              <div className="text-[11px] text-slate-600 bg-blue-50/40 p-3 rounded-2xl border border-blue-100">
                <span className="font-bold text-dte-primary block mb-1">Implementación en el Motor:</span>
                <p className="leading-relaxed">{req.implementation}</p>
              </div>
            </div>

            {/* Probar en Vivo Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Ruta: {req.targetPath}
              </span>
              <button
                onClick={() => navigate(req.targetPath)}
                className="px-4 py-2 bg-blue-50 hover:bg-dte-primary hover:text-white text-dte-primary text-xs font-bold rounded-xl transition-all flex items-center shadow-sm"
              >
                Probar en Vivo <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
