import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  FileKey, 
  Lock, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  FileCode2, 
  Server, 
  Database,
  Layers
} from 'lucide-react';
import { DTERequirementBadge } from '../../components/common/DTERequirementBadge';
import { DteTypeBadge } from '../../components/common/StatusBadge';
import { mockCertificate, mockCAFs } from '../../data/mockData';
import type { CAFAuthorization } from '../../types';

export const BovedaPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCafForInspection, setSelectedCafForInspection] = useState<CAFAuthorization | null>(mockCAFs[0]);

  return (
    <div className="space-y-6">
      
      {/* Requirements Badge */}
      <DTERequirementBadge
        requirements={[
          { num: 1, title: 'Certificado Digital & Firma .pfx/.p12' },
          { num: 2, title: 'Código de Autorización de Folios (CAF)' },
          { num: 13, title: 'Bóveda Segura de Secretos Multi-Tenant (AES-256-GCM / KMS)' }
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-headline font-extrabold text-slate-900 tracking-tight">
          Bóveda Criptográfica & Gestión de Secretos SII
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Almacenamiento y administración de los 4 componentes criptográficos base en entorno multi-tenant aislado.
        </p>
      </div>

      {/* Digital Certificate (.PFX / .P12) Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-bold">
              <KeyRound className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-headline font-bold text-slate-900">
                Certificado Digital del Representante Legal (.pfx / .p12)
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Componente Criptográfico Base #1 • Firma Semilla, DTEs y Sobres
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> Certificado Activo & Vigente
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Representante Legal (CN)
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {mockCertificate.commonName}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              RUT: {mockCertificate.rutRepresentante}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Entidad Certificadora (CA)
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {mockCertificate.issuer}
            </p>
            <p className="text-xs text-emerald-600 font-semibold">
              Vigencia hasta: {mockCertificate.validTo}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Cifrado en Bóveda & Algoritmo
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono font-bold text-dte-primary bg-blue-100 px-2 py-0.5 rounded">
                AES-256-GCM
              </span>
              <span className="text-xs font-mono text-slate-600">
                RSA-SHA1
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Clave privada resguardada en AWS KMS / Vault
            </p>
          </div>

        </div>

        {/* Password / Keystore info */}
        <div className="bg-slate-900 text-white p-4 px-5 rounded-2xl border border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-slate-300">Archivo PFX: <strong>{mockCertificate.pfxFileName}</strong></span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-400">PIN / Contraseña:</span>
            <span className="font-mono bg-slate-800 px-2.5 py-1 rounded text-amber-300 font-bold">
              {showPassword ? 'CertPass2025!Sii' : '••••••••••••••••'}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* CAF (Código de Autorización de Folios) Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              <FileKey className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-headline font-bold text-slate-900">
                Códigos de Autorización de Folios (CAF) Vigentes
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Componente Criptográfico Base #2 • Llave privada RSA del SII por rango de folios
              </span>
            </div>
          </div>
        </div>

        {/* CAF Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockCAFs.map((caf) => (
            <div
              key={caf.id}
              onClick={() => setSelectedCafForInspection(caf)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedCafForInspection?.id === caf.id
                  ? 'border-dte-primary bg-blue-50/70 shadow-md ring-2 ring-dte-primary/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <DteTypeBadge type={caf.dteType} />
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Activo
                </span>
              </div>

              <div className="text-xs font-headline font-bold text-slate-800 mt-2">
                {caf.tipoDocumentoGlosa}
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Rango Autorizado:</span>
                  <span className="font-mono font-bold text-slate-800">{caf.folioDesde} al {caf.folioHasta}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Folio Actual:</span>
                  <span className="font-mono font-bold text-dte-primary">#{caf.folioActual}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Disponibles:</span>
                  <span className="font-mono font-bold text-emerald-600">{caf.foliosDisponibles}</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-dte-primary h-1.5 rounded-full"
                  style={{ width: `${(caf.folioActual / caf.folioHasta) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* CAF XML & RSA Inspection Viewer */}
        {selectedCafForInspection && (
          <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-amber-400">
              <span className="font-bold uppercase tracking-wider">
                Inspección Técnica de CAF Seleccionado: {selectedCafForInspection.id} (Tipo {selectedCafForInspection.dteType})
              </span>
              <span className="text-slate-400">
                Autorizado: {selectedCafForInspection.fechaAutorizacion}
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
              <pre>
                <code>{selectedCafForInspection.xmlCafSnippet}</code>
              </pre>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              🔒 La clave privada RSA contenida en el nodo <code>&lt;RSAPK&gt;</code> se utiliza exclusivamente para firmar el nodo resumen <code>&lt;TED&gt;</code> que se transforma en el código de barras PDF417.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
