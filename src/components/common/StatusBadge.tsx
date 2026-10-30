import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Send, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import type { DTEStatus, DTEDocumentType } from '../../types';

interface StatusBadgeProps {
  status: DTEStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  switch (status) {
    case 'EPR':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
          EPR (Envío Procesado)
        </span>
      );
    case 'SOE':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />}
          SOE (Aceptado con Reparos)
        </span>
      );
    case 'RCH':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
          {showIcon && <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />}
          RCH (Rechazado por SII)
        </span>
      );
    case 'SENT_SII':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
          {showIcon && <Send className="w-3.5 h-3.5 mr-1 text-blue-600" />}
          Enviado SII (Track ID)
        </span>
      );
    case 'SIGNED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />}
          Firmado XMLDSig
        </span>
      );
    case 'ENQUEUED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
          {showIcon && <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />}
          En Cola de Envío
        </span>
      );
    case 'ACCEPTED_COMMERCIAL':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600" />}
          Aceptado Comercial
        </span>
      );
    case 'CLAIMED_COMMERCIAL':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
          Reclamado (8 días)
        </span>
      );
    case 'DRAFT':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-300">
          {showIcon && <FileText className="w-3.5 h-3.5 mr-1 text-gray-500" />}
          Borrador
        </span>
      );
  }
};

interface DteTypeBadgeProps {
  type: DTEDocumentType;
}

export const DteTypeBadge: React.FC<DteTypeBadgeProps> = ({ type }) => {
  switch (type) {
    case 33:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
          Tipo 33 • Factura Afecta
        </span>
      );
    case 34:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-200">
          Tipo 34 • Factura Exenta
        </span>
      );
    case 39:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
          Tipo 39 • Boleta Electrónica
        </span>
      );
    case 41:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-violet-100 text-violet-900 border border-violet-200">
          Tipo 41 • Boleta Exenta
        </span>
      );
    case 61:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-900 border border-rose-200">
          Tipo 61 • Nota de Crédito
        </span>
      );
    case 56:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-900 border border-orange-200">
          Tipo 56 • Nota de Débito
        </span>
      );
    case 52:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
          Tipo 52 • Guía de Despacho
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          Tipo {type}
        </span>
      );
  }
};
