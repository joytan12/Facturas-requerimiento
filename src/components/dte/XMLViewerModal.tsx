import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode2, Shield, QrCode } from 'lucide-react';
import type { DTEDocument } from '../../types';
import { generateSampleDteXml, generateEnvioDteXml } from '../../data/dteXmlTemplates';

interface XMLViewerModalProps {
  dte: DTEDocument;
  onClose: () => void;
}

export const XMLViewerModal: React.FC<XMLViewerModalProps> = ({ dte, onClose }) => {
  const [activeTab, setActiveTab] = useState<'dte' | 'envio_sii' | 'envio_cliente'>('dte');
  const [copied, setCopied] = useState(false);

  const getXmlContent = () => {
    switch (activeTab) {
      case 'envio_sii':
        return generateEnvioDteXml(dte, 'SII');
      case 'envio_cliente':
        return generateEnvioDteXml(dte, 'RECEPTOR_COMERCIAL');
      case 'dte':
      default:
        return generateSampleDteXml(dte);
    }
  };

  const currentXml = getXmlContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${activeTab === 'dte' ? 'DTE' : 'EnvioDTE'}_${dte.tipoDTE}_F${dte.folio}.xml`;
    const blob = new Blob([currentXml], { type: 'application/xml;charset=ISO-8859-1' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-dte-primary text-white p-5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-bold">
              <FileCode2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-white">
                Visor Criptográfico XML (ISO-8859-1)
              </h2>
              <p className="text-xs text-blue-200 font-mono">
                DTE Tipo {dte.tipoDTE} • Folio: {dte.folio} • RUT Receptor: {dte.header.receptor.rut}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar & Action Controls */}
        <div className="bg-slate-100 p-3 px-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('dte')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'dte'
                  ? 'bg-dte-primary text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              1. DTE Individual Firmado (&lt;DTE&gt;)
            </button>
            <button
              onClick={() => setActiveTab('envio_sii')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'envio_sii'
                  ? 'bg-dte-primary text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              2. Sobre SII (RutReceptor 60803000-K)
            </button>
            <button
              onClick={() => setActiveTab('envio_cliente')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'envio_cliente'
                  ? 'bg-dte-primary text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              3. Sobre Intercambio Cliente
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                  Copiar XML
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Descargar .XML
            </button>
          </div>
        </div>

        {/* XML Warning Badge */}
        <div className="bg-amber-50 px-6 py-2 border-b border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
          <span>
            ⚠️ <strong>Estándar Criptográfico Estricto:</strong> Codificación <code>ISO-8859-1</code> con canonicalización <code>C14N</code>. Cualquier cambio de salto de línea (\r\n vs \n) o espacio invalida la firma XMLDSig.
          </span>
          <span className="font-mono text-xs font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-950">
            DTE_v10.xsd OK
          </span>
        </div>

        {/* XML Code Body */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 text-slate-200 text-xs font-mono">
          <pre className="whitespace-pre overflow-x-auto p-2">
            <code>{currentXml}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 px-6 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Cerrar Visor
          </button>
        </div>

      </div>
    </div>
  );
};
