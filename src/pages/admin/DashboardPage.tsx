import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  FileCode2, 
  Printer, 
  Eye, 
  Plus, 
  Server, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { DTERequirementBadge } from '../../components/common/DTERequirementBadge';
import { StatusBadge, DteTypeBadge } from '../../components/common/StatusBadge';
import { XMLViewerModal } from '../../components/dte/XMLViewerModal';
import { PDFPreviewModal } from '../../components/dte/PDFPreviewModal';
import { mockDTEs, mockCAFs, mockCompany } from '../../data/mockData';
import type { DTEDocument, DTEDocumentType, DTEStatus } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dtes, setDtes] = useState<DTEDocument[]>(mockDTEs);
  const [selectedDteForXml, setSelectedDteForXml] = useState<DTEDocument | null>(null);
  const [selectedDteForPdf, setSelectedDteForPdf] = useState<DTEDocument | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQueryingTrackId, setIsQueryingTrackId] = useState<string | null>(null);

  // Filtered DTE list
  const filteredDtes = dtes.filter((dte) => {
    const matchesType = filterType === 'all' || dte.tipoDTE.toString() === filterType;
    const matchesStatus = filterStatus === 'all' || dte.status === filterStatus;
    const matchesSearch = 
      dte.folio.toString().includes(searchQuery) ||
      dte.header.receptor.razonSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dte.header.receptor.rut.includes(searchQuery) ||
      (dte.trackId && dte.trackId.includes(searchQuery));
    return matchesType && matchesStatus && matchesSearch;
  });

  // Simulated QueryEstUp refresh
  const handleQueryEstUp = (dteId: string) => {
    setIsQueryingTrackId(dteId);
    setTimeout(() => {
      setIsQueryingTrackId(null);
      setDtes((prev) =>
        prev.map((d) => {
          if (d.id === dteId) {
            return {
              ...d,
              status: 'EPR',
              siiGlosa: 'EPR - Consulta QueryEstUp confirmada. Envío Procesado sin reparos.'
            };
          }
          return d;
        })
      );
    }, 1200);
  };

  const eprCount = dtes.filter((d) => d.status === 'EPR').length;
  const soeCount = dtes.filter((d) => d.status === 'SOE').length;
  const totalAmount = dtes.reduce((acc, d) => acc + d.header.totales.montoTotal, 0);

  return (
    <div className="space-y-6">
      
      {/* PMV Requirements Covered Badge */}
      <DTERequirementBadge
        requirements={[
          { num: 8, title: 'Upload Multipart & Obtención de Track ID' },
          { num: 9, title: 'Worker Asíncrono de Conciliación (QueryEstUp)' },
          { num: 13, title: 'Arquitectura Desacoplada con Colas (RabbitMQ/BullMQ)' }
        ]}
      />

      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-extrabold text-slate-900 tracking-tight">
            Dashboard Operativo de Facturación (SII)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Emisor Activo: <strong className="text-slate-800">{mockCompany.razonSocial}</strong> ({mockCompany.rut}) • Res. {mockCompany.resolucionSii.numero} de {mockCompany.resolucionSii.fecha}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/emitir')}
            className="px-4 py-2 bg-dte-primary hover:bg-dte-primary-light text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-md shadow-dte-primary/20"
          >
            <Plus className="w-4 h-4 mr-1.5 text-amber-400" />
            Emitir Nuevo DTE
          </button>
          <button
            onClick={() => navigate('/admin/ciclo-de-vida')}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm"
          >
            <Activity className="w-4 h-4 mr-1.5 text-indigo-600" />
            Simulador de Ciclo de Vida
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Emitidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total DTEs Emitidos</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-headline font-black text-slate-900">
            {dtes.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Monto facturado: <strong className="text-slate-800 font-mono">${totalAmount.toLocaleString('es-CL')}</strong>
          </div>
        </div>

        {/* EPR Aceptados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Aceptados (EPR)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-headline font-black text-emerald-700">
            {eprCount} <span className="text-xs font-semibold text-slate-400">/ {dtes.length}</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            ✓ 100% validados contra DTE_v10.xsd
          </div>
        </div>

        {/* Reparos SOE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Reparos (SOE)</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-headline font-black text-amber-700">
            {soeCount}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            Advertencias no invalidantes del SII
          </div>
        </div>

        {/* Folios CAF Activos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">CAF Factura 33</span>
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-headline font-black text-slate-900 font-mono">
            {mockCAFs[0].foliosDisponibles} <span className="text-xs font-normal text-slate-400">disponibles</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full" 
              style={{ width: `${(mockCAFs[0].folioActual / mockCAFs[0].folioHasta) * 100}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Folio {mockCAFs[0].folioActual} de {mockCAFs[0].folioHasta}</span>
            <span className="text-indigo-600 font-bold">54% restante</span>
          </div>
        </div>

      </div>

      {/* SII Services Live Health Check */}
      <div className="bg-slate-900 text-white p-4 px-6 rounded-2xl border border-blue-900 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Server className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Monitor de Servicios SII en Tiempo Real (Ambiente Maullín)
            </span>
            <span className="text-[11px] text-slate-300">
              Conexión asíncrona activa • Worker de Conciliación en ejecución
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-slate-300">GetSeed (SOAP):</span>
            <span className="font-mono text-emerald-300 font-bold">142ms</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-slate-300">Upload EnvioDTE:</span>
            <span className="font-mono text-emerald-300 font-bold">410ms</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-slate-300">QueryEstUp:</span>
            <span className="font-mono text-emerald-300 font-bold">215ms</span>
          </div>
        </div>
      </div>

      {/* Main Operational Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Filters Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por Folio, RUT, Cliente o Track ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dte-primary w-64"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Todos los Tipos de DTE</option>
              <option value="33">Tipo 33 • Factura Afecta</option>
              <option value="34">Tipo 34 • Factura Exenta</option>
              <option value="39">Tipo 39 • Boleta Electrónica</option>
              <option value="61">Tipo 61 • Nota de Crédito</option>
            </select>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Todos los Estados SII</option>
              <option value="EPR">EPR (Procesado OK)</option>
              <option value="SOE">SOE (Con Reparos)</option>
              <option value="SENT_SII">Enviado SII (Track ID)</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Mostrando <strong>{filteredDtes.length}</strong> de {dtes.length} documentos
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 pl-6">Folio / Tipo</th>
                <th className="p-3.5">Receptor Comercial</th>
                <th className="p-3.5">Fecha Emisión</th>
                <th className="p-3.5 text-right">Monto Total</th>
                <th className="p-3.5">Track ID (SII)</th>
                <th className="p-3.5">Estado SII</th>
                <th className="p-3.5">Acuse Ley 19.983</th>
                <th className="p-3.5 pr-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDtes.map((dte) => (
                <tr key={dte.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Folio & Tipo */}
                  <td className="p-3.5 pl-6">
                    <div className="font-headline font-bold text-slate-900 text-sm">
                      #{dte.folio}
                    </div>
                    <div className="mt-1">
                      <DteTypeBadge type={dte.tipoDTE} />
                    </div>
                  </td>

                  {/* Receptor */}
                  <td className="p-3.5">
                    <div className="font-bold text-slate-800 line-clamp-1 max-w-xs">
                      {dte.header.receptor.razonSocial}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      RUT: {dte.header.receptor.rut}
                    </div>
                  </td>

                  {/* Fecha Emisión */}
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                    {dte.header.fechaEmision}
                  </td>

                  {/* Monto Total */}
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    ${dte.header.totales.montoTotal.toLocaleString('es-CL')}
                  </td>

                  {/* Track ID */}
                  <td className="p-3.5">
                    {dte.trackId ? (
                      <div className="font-mono text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                        {dte.trackId}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No asignado</span>
                    )}
                  </td>

                  {/* Estado SII */}
                  <td className="p-3.5">
                    <StatusBadge status={dte.status} />
                    {dte.siiRevisionDetails && (
                      <div className="text-[10px] text-amber-700 font-semibold mt-1">
                        {dte.siiRevisionDetails.length} observaciones
                      </div>
                    )}
                  </td>

                  {/* Acuse Ley 19.983 */}
                  <td className="p-3.5">
                    {dte.commercialExchangeStatus === 'approved' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        ✓ Aceptada Conforme
                      </span>
                    ) : dte.commercialExchangeStatus === 'sent' ? (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                        Pendiente ({dte.commercialDaysRemaining}d restantes)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No aplica</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-6 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Ver XML */}
                      <button
                        onClick={() => setSelectedDteForXml(dte)}
                        className="p-1.5 bg-slate-100 hover:bg-dte-primary hover:text-white text-slate-700 rounded-lg transition-colors"
                        title="Ver XML Firmado (ISO-8859-1)"
                      >
                        <FileCode2 className="w-4 h-4" />
                      </button>

                      {/* Ver PDF417 */}
                      <button
                        onClick={() => setSelectedDteForPdf(dte)}
                        className="p-1.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 rounded-lg transition-colors"
                        title="Ver Representación Impresa (PDF & PDF417)"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* QueryEstUp manual */}
                      <button
                        onClick={() => handleQueryEstUp(dte.id)}
                        disabled={isQueryingTrackId === dte.id}
                        className="p-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-lg transition-colors"
                        title="Reconsultar Track ID (QueryEstUp SII)"
                      >
                        <RefreshCw className={`w-4 h-4 ${isQueryingTrackId === dte.id ? 'animate-spin text-blue-600' : ''}`} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* XML Viewer Modal */}
      {selectedDteForXml && (
        <XMLViewerModal
          dte={selectedDteForXml}
          onClose={() => setSelectedDteForXml(null)}
        />
      )}

      {/* PDF & PDF417 Preview Modal */}
      {selectedDteForPdf && (
        <PDFPreviewModal
          dte={selectedDteForPdf}
          onClose={() => setSelectedDteForPdf(null)}
        />
      )}

    </div>
  );
};
