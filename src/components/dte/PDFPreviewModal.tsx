import React, { useState } from 'react';
import { X, Printer, Download, Eye, FileText } from 'lucide-react';
import type { DTEDocument } from '../../types';
import { PDF417Barcode } from './PDF417Barcode';

interface PDFPreviewModalProps {
  dte: DTEDocument;
  onClose: () => void;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ dte, onClose }) => {
  const [format, setFormat] = useState<'carta' | 'termico'>('carta');
  const [isCedible, setIsCedible] = useState(true);

  const h = dte.header;

  const handlePrint = () => {
    window.print();
  };

  const getDocTitle = () => {
    switch (dte.tipoDTE) {
      case 33: return 'FACTURA ELECTRÓNICA';
      case 34: return 'FACTURA NO AFECTA O EXENTA ELECTRÓNICA';
      case 39: return 'BOLETA ELECTRÓNICA';
      case 41: return 'BOLETA EXENTA ELECTRÓNICA';
      case 56: return 'NOTA DE DÉBITO ELECTRÓNICA';
      case 61: return 'NOTA DE CRÉDITO ELECTRÓNICA';
      case 52: return 'GUÍA DE DESPACHO ELECTRÓNICA';
      default: return 'DOCUMENTO TRIBUTARIO ELECTRÓNICO';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Controls Header */}
        <div className="bg-dte-primary text-white p-4 px-6 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-bold">
              <Printer className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-base text-white">
                Representación Impresa Oficial SII
              </h2>
              <p className="text-xs text-blue-200">
                {getDocTitle()} • Folio: {dte.folio}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Format toggle */}
            <div className="bg-blue-950/80 p-1 rounded-xl border border-blue-800 flex items-center text-xs">
              <button
                onClick={() => setFormat('carta')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  format === 'carta' ? 'bg-amber-500 text-slate-950 shadow' : 'text-blue-200 hover:text-white'
                }`}
              >
                Formato Carta (A4)
              </button>
              <button
                onClick={() => setFormat('termico')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  format === 'termico' ? 'bg-amber-500 text-slate-950 shadow' : 'text-blue-200 hover:text-white'
                }`}
              >
                Térmico 80mm
              </button>
            </div>

            {/* Cedible toggle */}
            <label className="flex items-center space-x-1.5 text-xs text-blue-100 bg-blue-900/50 px-2.5 py-1.5 rounded-xl border border-blue-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isCedible}
                onChange={(e) => setIsCedible(e.target.checked)}
                className="rounded text-amber-500 focus:ring-0"
              />
              <span className="font-semibold">Copia Cedible</span>
            </label>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-slate-700" />
              Imprimir
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-300">
          {format === 'carta' ? (
            /* FORMATO CARTA */
            <div className="bg-white w-[210mm] min-h-[297mm] p-10 shadow-xl border border-slate-300 text-black font-sans relative flex flex-col justify-between">
              
              {/* Header: Emisor + Red Box */}
              <div>
                <div className="flex justify-between items-start mb-6">
                  {/* Left: Emisor info */}
                  <div className="max-w-[55%] space-y-1">
                    <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                      {h.emisor.razonSocial}
                    </h1>
                    <p className="text-xs text-slate-700 font-semibold">{h.emisor.giro}</p>
                    <p className="text-xs text-slate-600">Actividad Económica: {h.emisor.acteco}</p>
                    <p className="text-xs text-slate-600">Casa Matriz: {h.emisor.direccion}</p>
                    <p className="text-xs text-slate-600">{h.emisor.comuna}, {h.emisor.ciudad}</p>
                    <p className="text-xs text-slate-600">Contacto Intercambio: {h.emisor.correoIntercambio}</p>
                  </div>

                  {/* Right: Red Box SII */}
                  <div className="w-[40%] border-2 border-red-700 text-red-700 p-3 text-center rounded-sm font-bold">
                    <p className="text-sm font-black tracking-wider">R.U.T.: {h.emisor.rut}</p>
                    <p className="text-base font-extrabold uppercase my-1 leading-tight">{getDocTitle()}</p>
                    <p className="text-base font-black tracking-widest my-1">N° {dte.folio}</p>
                    <p className="text-[11px] font-bold tracking-tight uppercase border-t border-red-700 pt-1 mt-1">
                      S.I.I. - SANTIAGO ORIENTE
                    </p>
                  </div>
                </div>

                {/* Receptor Box */}
                <div className="border border-slate-400 p-3 rounded text-xs space-y-1 mb-6 bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold">SEÑOR(ES):</span> {h.receptor.razonSocial}
                    </div>
                    <div>
                      <span className="font-bold">R.U.T.:</span> {h.receptor.rut}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold">GIRO:</span> {h.receptor.giro}
                    </div>
                    <div>
                      <span className="font-bold">FECHA EMISIÓN:</span> {h.fechaEmision}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold">DIRECCIÓN:</span> {h.receptor.direccion}
                    </div>
                    <div>
                      <span className="font-bold">COMUNA / CIUDAD:</span> {h.receptor.comuna}, {h.receptor.ciudad}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-xs border border-slate-400 mb-6">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-400 text-left font-bold text-slate-800">
                      <th className="p-2 border-r border-slate-400 w-12 text-center">Lín.</th>
                      <th className="p-2 border-r border-slate-400">Descripción / Ítem</th>
                      <th className="p-2 border-r border-slate-400 w-20 text-right">Cant.</th>
                      <th className="p-2 border-r border-slate-400 w-28 text-right">Precio Unit.</th>
                      <th className="p-2 w-28 text-right">Total ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dte.items.map((item) => (
                      <tr key={item.id} className="border-b border-slate-300">
                        <td className="p-2 border-r border-slate-300 text-center">{item.nroLinea}</td>
                        <td className="p-2 border-r border-slate-300">
                          <p className="font-semibold">{item.nombre}</p>
                          {item.descripcion && <p className="text-[10px] text-slate-500">{item.descripcion}</p>}
                        </td>
                        <td className="p-2 border-r border-slate-300 text-right">{item.cantidad}</td>
                        <td className="p-2 border-r border-slate-300 text-right font-mono">
                          ${item.precioUnitario.toLocaleString('es-CL')}
                        </td>
                        <td className="p-2 text-right font-mono font-bold">
                          ${item.montoTotalItem.toLocaleString('es-CL')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Section: Totales & PDF417 Timbre */}
              <div className="mt-8 border-t border-slate-400 pt-4">
                <div className="flex justify-between items-start">
                  
                  {/* Left: Timbre PDF417 */}
                  <div className="space-y-2">
                    <PDF417Barcode
                      folio={dte.folio}
                      tipoDTE={dte.tipoDTE}
                      resolucionNumero={80}
                      resolucionFecha="2025"
                    />
                    <p className="text-[9px] text-slate-600 max-w-xs leading-tight">
                      Timbre Electrónico DTE con firma RSA-SHA1 sobre hash de CAF vigente.
                    </p>
                  </div>

                  {/* Right: Totales */}
                  <div className="w-64 border border-slate-400 rounded text-xs overflow-hidden">
                    {h.totales.montoNeto > 0 && (
                      <div className="flex justify-between p-1.5 px-3 border-b border-slate-300">
                        <span className="font-semibold text-slate-700">MONTO NETO:</span>
                        <span className="font-mono font-bold">${h.totales.montoNeto.toLocaleString('es-CL')}</span>
                      </div>
                    )}
                    {h.totales.montoExento > 0 && (
                      <div className="flex justify-between p-1.5 px-3 border-b border-slate-300">
                        <span className="font-semibold text-slate-700">MONTO EXENTO:</span>
                        <span className="font-mono font-bold">${h.totales.montoExento.toLocaleString('es-CL')}</span>
                      </div>
                    )}
                    {h.totales.tasaIVA > 0 && (
                      <div className="flex justify-between p-1.5 px-3 border-b border-slate-300">
                        <span className="font-semibold text-slate-700">I.V.A. (19%):</span>
                        <span className="font-mono font-bold">${h.totales.iva.toLocaleString('es-CL')}</span>
                      </div>
                    )}
                    <div className="flex justify-between p-2 px-3 bg-slate-100 font-bold text-sm">
                      <span>TOTAL:</span>
                      <span className="font-mono text-base font-black">${h.totales.montoTotal.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                </div>

                {/* Cedible Watermark / Notice (Ley 19.983) */}
                {isCedible && (
                  <div className="mt-6 border-t border-dashed border-slate-400 pt-3 flex justify-between items-center text-[10px] text-slate-600">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 uppercase block tracking-wider">
                        CEDIBLE CON SU FACTURA (LEY 19.983)
                      </span>
                      <p>Nombre: _____________________ RUT: ______________ Fecha: ___________ Firma: _______________</p>
                      <p className="text-[9px] text-slate-500">
                        El acuse de recibo que se declara en este acto se rige por lo dispuesto en la letra b) del Art. 4° y el Art. 5° de la Ley 19.983.
                      </p>
                    </div>
                    <div className="text-right font-black text-xs text-red-700 border-2 border-red-700 px-2 py-1 rounded">
                      COPIA CEDIBLE
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* FORMATO TERMICO 80MM */
            <div className="bg-white w-[80mm] min-h-[140mm] p-4 shadow-xl border border-slate-400 text-black font-mono text-[11px] leading-tight flex flex-col justify-between">
              <div>
                <div className="text-center border-b border-black pb-2 mb-2">
                  <p className="font-bold text-xs">{h.emisor.razonSocial}</p>
                  <p>RUT: {h.emisor.rut}</p>
                  <p>{h.emisor.giro.slice(0, 32)}</p>
                  <p>{h.emisor.direccion}</p>
                  <p>{h.emisor.comuna}</p>
                </div>

                <div className="text-center border border-black p-1 my-2 font-bold">
                  <p>{getDocTitle()}</p>
                  <p className="text-xs">FOLIO N° {dte.folio}</p>
                  <p className="text-[9px]">S.I.I. - SANTIAGO ORIENTE</p>
                </div>

                <div className="border-b border-dashed border-black pb-2 mb-2 text-[10px]">
                  <p><strong>FECHA:</strong> {h.fechaEmision}</p>
                  <p><strong>CLIENTE:</strong> {h.receptor.razonSocial.slice(0, 25)}</p>
                  <p><strong>RUT:</strong> {h.receptor.rut}</p>
                </div>

                <div className="border-b border-dashed border-black pb-2 mb-2 text-[10px]">
                  {dte.items.map((item) => (
                    <div key={item.id} className="flex justify-between my-0.5">
                      <span>{item.cantidad}x {item.nombre.slice(0, 18)}</span>
                      <span className="font-bold">${item.montoTotalItem.toLocaleString('es-CL')}</span>
                    </div>
                  ))}
                </div>

                <div className="text-right text-xs font-bold border-b border-black pb-2 mb-2">
                  <p>TOTAL: ${h.totales.montoTotal.toLocaleString('es-CL')}</p>
                  <p className="text-[10px] font-normal">(Incluye IVA 19%)</p>
                </div>
              </div>

              <div className="text-center mt-3">
                <PDF417Barcode
                  folio={dte.folio}
                  tipoDTE={dte.tipoDTE}
                  resolucionNumero={80}
                  resolucionFecha="2025"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 px-6 border-t border-slate-300 flex justify-between items-center text-xs">
          <span className="text-slate-600 font-mono text-[11px]">
            Renderizado oficial conforme a Resolución Exenta SII N° 11 y Circular N° 21.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
