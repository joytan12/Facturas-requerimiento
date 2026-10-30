import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode2, 
  Printer, 
  Calendar, 
  Building2, 
  Clock, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { DTERequirementBadge } from '../../components/common/DTERequirementBadge';
import { StatusBadge, DteTypeBadge } from '../../components/common/StatusBadge';
import { XMLViewerModal } from '../../components/dte/XMLViewerModal';
import { PDFPreviewModal } from '../../components/dte/PDFPreviewModal';
import { mockDTEs } from '../../data/mockData';
import type { DTEDocument } from '../../types';

export const ConsultaTrackIdPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query') || '';

  const [inputQuery, setInputQuery] = useState(queryFromUrl || '2984729103');
  const [foundDte, setFoundDte] = useState<DTEDocument | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const performSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setHasSearched(true);
    const result = mockDTEs.find(
      (d) =>
        d.trackId === trimmed ||
        d.folio.toString() === trimmed ||
        d.header.receptor.rut === trimmed ||
        d.id.toLowerCase() === trimmed.toLowerCase()
    );
    setFoundDte(result || null);
  };

  useEffect(() => {
    if (queryFromUrl) {
      setInputQuery(queryFromUrl);
      performSearch(queryFromUrl);
    } else {
      performSearch('2984729103'); // default mock match
    }
  }, [queryFromUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(inputQuery);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      
      {/* Requirements Badge */}
      <DTERequirementBadge
        requirements={[
          { num: 8, title: 'Upload Multipart & Obtención de Track ID' },
          { num: 9, title: 'Worker Asíncrono de Conciliación (QueryEstUp)' },
          { num: 10, title: 'Trazabilidad Pública de Estado SII' }
        ]}
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-headline font-black text-slate-900 tracking-tight">
          Consulta Pública de Track ID & Estado SII
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Ingresa el número de atención (Track ID de 10 dígitos) o Folio para verificar la validez tributaria ante el SII y el receptor.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ejemplo: Track ID 2984729103 o Folio 45..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-dte-primary focus:bg-white transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-dte-primary hover:bg-dte-primary-light text-white font-headline font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-dte-primary/20 flex items-center justify-center space-x-2"
          >
            <span>Consultar Estado</span>
          </button>
        </div>

        <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400 px-1">
          <span>Pruebas sugeridas:</span>
          <button
            type="button"
            onClick={() => { setInputQuery('2984729103'); performSearch('2984729103'); }}
            className="text-dte-primary hover:underline font-mono font-semibold"
          >
            Track ID: 2984729103 (EPR)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => { setInputQuery('2984729188'); performSearch('2984729188'); }}
            className="text-dte-primary hover:underline font-mono font-semibold"
          >
            Track ID: 2984729188 (SOE)
          </button>
        </div>
      </form>

      {/* Result Display */}
      {foundDte ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
          
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <DteTypeBadge type={foundDte.tipoDTE} />
                <span className="font-mono text-xs font-bold text-slate-500">
                  Folio #{foundDte.folio}
                </span>
              </div>
              <h2 className="text-xl font-headline font-black text-slate-900">
                Track ID: {foundDte.trackId}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Subida: {foundDte.siiUploadDate} • Ambiente: {foundDte.environment.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-col sm:items-end space-y-2">
              <StatusBadge status={foundDte.status} />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowXmlModal(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-dte-primary hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center shadow-sm"
                >
                  <FileCode2 className="w-3.5 h-3.5 mr-1" />
                  Ver XML
                </button>
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Ver PDF417
                </button>
              </div>
            </div>
          </div>

          {/* Glosa SII */}
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
            foundDte.status === 'EPR' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <span className="font-bold block mb-0.5">Glosa de Respuesta Oficial SII (QueryEstUp):</span>
            <p className="font-medium">{foundDte.siiGlosa}</p>
          </div>

          {/* Parties & Amounts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Emisor
              </span>
              <p className="font-bold text-slate-800">{foundDte.header.emisor.razonSocial}</p>
              <p className="text-slate-500 font-mono">{foundDte.header.emisor.rut}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Receptor Comercial
              </span>
              <p className="font-bold text-slate-800">{foundDte.header.receptor.razonSocial}</p>
              <p className="text-slate-500 font-mono">{foundDte.header.receptor.rut}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Monto Total Facturado
              </span>
              <p className="font-mono text-base font-black text-dte-primary">
                ${foundDte.header.totales.montoTotal.toLocaleString('es-CL')}
              </p>
              <p className="text-slate-500 text-[11px]">
                Neto: ${foundDte.header.totales.montoNeto.toLocaleString('es-CL')} | IVA: ${foundDte.header.totales.iva.toLocaleString('es-CL')}
              </p>
            </div>
          </div>

          {/* Chronological Audit Event Timeline */}
          <div className="space-y-3 pt-2">
            <h3 className="font-headline font-bold text-slate-900 text-sm uppercase tracking-wider">
              Bitácora de Trazabilidad Asíncrona (Eventos)
            </h3>

            <div className="border-l-2 border-slate-200 ml-4 space-y-4 pl-4 py-1">
              {foundDte.events.map((ev) => (
                <div key={ev.id} className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-dte-primary ring-4 ring-white"></div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400">{ev.timestamp}</span>
                      <span className="text-xs font-bold text-slate-800">{ev.action}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {ev.source}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{ev.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : hasSearched ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-headline font-bold text-slate-800">
            Documento o Track ID no encontrado
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No se encontró ningún DTE con el parámetro "{inputQuery}". Verifica que el número de 10 dígitos esté correcto o consulta por Folio.
          </p>
        </div>
      ) : null}

      {/* XML Modal */}
      {showXmlModal && foundDte && (
        <XMLViewerModal
          dte={foundDte}
          onClose={() => setShowXmlModal(false)}
        />
      )}

      {/* PDF Modal */}
      {showPdfModal && foundDte && (
        <PDFPreviewModal
          dte={foundDte}
          onClose={() => setShowPdfModal(false)}
        />
      )}

    </div>
  );
};
