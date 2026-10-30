import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  FileSpreadsheet, 
  CheckSquare, 
  KeyRound, 
  FileKey, 
  QrCode, 
  Workflow, 
  ArrowRight,
  Server,
  Globe2
} from 'lucide-react';
import type { UserRole, SiiEnvironment } from '../types';

interface LoginPageProps {
  setRole: (role: UserRole) => void;
  environment: SiiEnvironment;
  setEnvironment: (env: SiiEnvironment) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  setRole, 
  environment, 
  setEnvironment 
}) => {
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-dte-primary to-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-blue-900 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <span>MOTOR CRIPTOGRÁFICO DE FACTURACIÓN ELECTRÓNICA (DTE)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-headline font-black tracking-tight leading-tight">
            Plataforma DTE Chile & Certificación SII
          </h1>

          <p className="text-sm text-blue-200 leading-relaxed font-normal">
            Implementación integral de software propio de facturación electrónica conforme a la normativa del 
            <strong> Servicio de Impuestos Internos (SII)</strong>. Criptografía W3C XMLDSig, codificación ISO-8859-1, 
            timbres TED con PDF417, doble sobre EnvioDTE y flujos asíncronos en Ambiente Maullín y Palena.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/requirements')}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-headline font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2"
            >
              <CheckSquare className="w-4 h-4 text-slate-950" />
              <span>Ver Matriz de 14 Requerimientos</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => handleSelectRole('admin', '/admin')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center space-x-2 backdrop-blur-sm"
            >
              <span>Acceder al Dashboard Operativo</span>
            </button>
          </div>
        </div>

        {/* Background Decorative Rings */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Environment Selector Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Entorno de Ejecución Activo
          </span>
          <h3 className="text-sm font-headline font-bold text-slate-800">
            {environment === 'certificacion' 
              ? 'Ambiente de Certificación (maullin.sii.cl / pangal.sii.cl)' 
              : 'Ambiente de Producción (palena.sii.cl / rahue.sii.cl)'}
          </h3>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setEnvironment('certificacion')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              environment === 'certificacion'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            Ambiente Maullín (Pruebas)
          </button>
          <button
            onClick={() => setEnvironment('produccion')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              environment === 'produccion'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            Ambiente Palena (Producción)
          </button>
        </div>
      </div>

      {/* Role Selection Interactive Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-headline font-bold text-slate-400 uppercase tracking-wider px-1">
          Selección de Rol para Explorar el Prototipo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Role 1: Emisor / Admin */}
          <div 
            onClick={() => handleSelectRole('admin', '/admin')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-dte-primary hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-dte-primary rounded-2xl flex items-center justify-center group-hover:bg-dte-primary group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Rol #1</span>
                <h3 className="text-lg font-headline font-bold text-slate-900 group-hover:text-dte-primary transition-colors">
                  Administrador Emisor
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gestión comercial, emisión criptográfica de DTEs, control de CAF, monitor de servicios SII y consulta de Track IDs.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-dte-primary">
              <span>Ingresar como Emisor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Role 2: Auditor de Certificación */}
          <div 
            onClick={() => handleSelectRole('auditor', '/admin/certificacion')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Rol #2</span>
                <h3 className="text-lg font-headline font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Auditor Certificación SII
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ejecución del Set de Pruebas Básico, simulación de 20 a 200 documentos y automatización por script para nuevos RUTs.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Ingresar a Maullín</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Role 3: Receptor Comercial */}
          <div 
            onClick={() => handleSelectRole('receiver', '/admin/intercambio')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Rol #3</span>
                <h3 className="text-lg font-headline font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Receptor Comercial
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bandeja de intercambio, validación de facturas de proveedores y generación de los 3 acuses de la Ley 19.983 en 8 días.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Ingresar a Intercambio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* 4 Cryptographic Pillars Summary */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-900 shadow-md space-y-4">
        <h3 className="text-sm font-headline font-bold text-amber-400 uppercase tracking-wider">
          Los 4 Componentes Criptográficos Base de la Facturación Electrónica en Chile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h4 className="text-xs font-bold text-white">1. Certificado Digital</h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              Archivo .pfx del representante legal para firma de semilla SOAP, folios, DTEs y sobre EnvioDTE.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <FileKey className="w-5 h-5 text-blue-400" />
            <h4 className="text-xs font-bold text-white">2. Archivo CAF</h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              XML timbrado por el SII con rango de folios autorizado y llave privada RSA única del SII.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">3. Timbre TED & PDF417</h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              Nodo XML resumen firmado con la llave del CAF que genera el código bidimensional del PDF.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h4 className="text-xs font-bold text-white">4. Firma XMLDSig (C14N)</h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              Estándar W3C en RSA-SHA1 con canonicalización C14N estricta en codificación ISO-8859-1.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
