import React, { useState } from 'react';
import { 
  Inbox, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Clock, 
  Send, 
  FileCode2, 
  Copy, 
  Check, 
  Eye, 
  ShieldCheck,
  Mail
} from 'lucide-react';
import { DTERequirementBadge } from '../../components/common/DTERequirementBadge';
import { sampleCommercialAcks } from '../../data/dteXmlTemplates';
import type { CommercialAckXML } from '../../types';

export const IntercambioComercialPage: React.FC = () => {
  const [acks, setAcks] = useState<CommercialAckXML[]>(sampleCommercialAcks);
  const [selectedAck, setSelectedAck] = useState<CommercialAckXML>(sampleCommercialAcks[0]);
  const [copied, setCopied] = useState(false);
  const [receiptAcknowledgeStatus, setReceiptAcknowledgeStatus] = useState<string>('pending');

  const handleCopyXml = () => {
    navigator.clipboard.writeText(selectedAck.xmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAck = (type: 'EnvioRecibos' | 'ResultadoDTE' | 'RespuestaDTE') => {
    setReceiptAcknowledgeStatus(`Enviando ${type} a casilla de intercambio...`);
    setTimeout(() => {
      setReceiptAcknowledgeStatus(`✓ ${type} firmado con .pfx y enviado exitosamente.`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Requirements Badge */}
      <DTERequirementBadge
        requirements={[
          { num: 10, title: 'Intercambio Comercial (Ley 19.983 plazo 8 días)' },
          { num: 11, title: 'Generación de los 3 XMLs de Respuesta Comercial' },
          { num: 6, title: 'Doble Sobre EnvioDTE al Receptor' }
        ]}
      />

      {/* Title */}
      <div>
        <h1 className="text-2xl font-headline font-extrabold text-slate-900 tracking-tight">
          Bandeja de Intercambio Comercial & Acuses (Ley 19.983)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Recepción de facturas de proveedores por IMAP y generación de los 3 XMLs de respuesta comercial y mérito ejecutivo.
        </p>
      </div>

      {/* Legal 8-Day Notice Banner */}
      <div className="bg-amber-50 border border-amber-300 p-4 rounded-3xl flex items-start space-x-3 text-xs text-amber-950">
        <Clock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider block">
            Plazo Legal Perentorio: 8 Días Corridos (Ley N° 19.983)
          </span>
          <p className="leading-relaxed text-amber-900">
            Una vez recibido el sobre <code>EnvioDTE</code> de un proveedor, el contribuyente receptor dispone de un plazo fatal de <strong>8 días corridos</strong> para aceptar o reclamar comercialmente el documento. Transcurrido ese plazo sin reclamo (RespuestaDTE), opera la <strong>aceptación tácita</strong> automática ante el SII, convirtiendo la factura en título ejecutivo transferible o cedible en factoring.
          </p>
        </div>
      </div>

      {/* Main Grid: Inbound Invoice Left, 3 XML Generators Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Received Supplier Invoice Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              DTE Recibido de Proveedor
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              6 días restantes
            </span>
          </div>

          <div>
            <h3 className="font-headline font-bold text-slate-900 text-base">
              Factura Electrónica N° 45
            </h3>
            <p className="text-xs text-slate-500">
              Proveedor: <strong>Distribuidora Los Andes S.A.</strong> (96.541.220-3)
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha Emisión:</span>
              <span className="text-slate-800">2026-10-29</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha Recepción:</span>
              <span className="text-slate-800">2026-10-29 14:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monto Neto:</span>
              <span className="text-slate-800">$1.500.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">I.V.A. (19%):</span>
              <span className="text-slate-800">$285.000</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
              <span>Total:</span>
              <span className="text-dte-primary">$1.785.000</span>
            </div>
          </div>

          {/* Quick Ack Action Triggers */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-700 block">
              Generar Respuestas Criptográficas:
            </span>

            <button
              onClick={() => handleSendAck('EnvioRecibos')}
              className="w-full py-2 px-3 bg-blue-50 hover:bg-dte-primary hover:text-white text-dte-primary text-xs font-bold rounded-xl transition-all flex items-center justify-between"
            >
              <span>1. EnvioRecibos (Acuse Mercaderías)</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleSendAck('ResultadoDTE')}
              className="w-full py-2 px-3 bg-blue-50 hover:bg-dte-primary hover:text-white text-dte-primary text-xs font-bold rounded-xl transition-all flex items-center justify-between"
            >
              <span>2. ResultadoDTE (Aceptación Técnica)</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleSendAck('RespuestaDTE')}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold rounded-xl transition-all flex items-center justify-between"
            >
              <span>3. RespuestaDTE (Aceptación Comercial)</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>

          {receiptAcknowledgeStatus !== 'pending' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-mono font-bold">
              {receiptAcknowledgeStatus}
            </div>
          )}
        </div>

        {/* Right: The 3 Commercial Ack XML Viewer */}
        <div className="lg:col-span-2 bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          
          {/* Top Selector Tabs */}
          <div className="bg-slate-900 p-3 px-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex space-x-2">
              {acks.map((ack) => (
                <button
                  key={ack.type}
                  onClick={() => setSelectedAck(ack)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAck.type === ack.type
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ack.type}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyXml}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 text-slate-400 mr-1.5" />}
              {copied ? 'Copiado' : 'Copiar XML'}
            </button>
          </div>

          {/* Ack Description Banner */}
          <div className="bg-slate-900/40 p-4 px-6 border-b border-slate-800 text-xs space-y-1">
            <h4 className="font-bold text-white text-sm">{selectedAck.title}</h4>
            <p className="text-slate-400 leading-relaxed">{selectedAck.legalContext}</p>
          </div>

          {/* XML Code Body */}
          <div className="flex-1 p-4 overflow-auto max-h-[380px] font-mono text-xs">
            <pre className="whitespace-pre overflow-x-auto text-slate-300">
              <code>{selectedAck.xmlSnippet}</code>
            </pre>
          </div>

          <div className="bg-slate-900/60 p-3 px-6 border-t border-slate-800 text-right">
            <span className="text-[11px] text-slate-400 font-mono">
              Firma XMLDSig RSA-SHA1 con .pfx obligatoria para validez legal
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
