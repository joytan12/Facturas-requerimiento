import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCode2, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Key, 
  QrCode, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  FileText, 
  Printer, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DTERequirementBadge } from '../../components/common/DTERequirementBadge';
import { XMLViewerModal } from '../../components/dte/XMLViewerModal';
import { PDFPreviewModal } from '../../components/dte/PDFPreviewModal';
import { mockCompany, mockCAFs } from '../../data/mockData';
import type { DTEDocument, DTEDocumentType, DTEItem } from '../../types';

export const EmitirDTEPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [tipoDTE, setTipoDTE] = useState<DTEDocumentType>(33);
  const [rutReceptor, setRutReceptor] = useState('77.102.840-K');
  const [razonSocialReceptor, setRazonSocialReceptor] = useState('Constructora e Ingeniería del Pacífico Ltda.');
  const [giroReceptor, setGiroReceptor] = useState('Obras Menores y Montaje Industrial');
  const [direccionReceptor, setDireccionReceptor] = useState('Camino El Alba 8900');
  const [comunaReceptor, setComunaReceptor] = useState('Las Condes');
  const [ciudadReceptor, setCiudadReceptor] = useState('Santiago');
  const [correoIntercambio, setCorreoIntercambio] = useState('proveedores@pacificoctr.cl');

  // Items State
  const [items, setItems] = useState<DTEItem[]>([
    {
      id: 'item-1',
      nroLinea: 1,
      nombre: 'Servicio de Consultoría Criptográfica XMLDSig',
      descripcion: 'Implementación de algoritmo RSA-SHA1 y canonicalización W3C C14N',
      cantidad: 1,
      precioUnitario: 1200000,
      descuentoPorcentaje: 0,
      montoTotalItem: 1200000,
      esExento: false
    },
    {
      id: 'item-2',
      nroLinea: 2,
      nombre: 'Licencia Servidor de Facturación Electrónica',
      descripcion: 'Módulo de colas asíncronas con reintentos para contingencia SII',
      cantidad: 1,
      precioUnitario: 800000,
      descuentoPorcentaje: 0,
      montoTotalItem: 800000,
      esExento: false
    }
  ]);

  // Emission Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [emittedDte, setEmittedDte] = useState<DTEDocument | null>(null);
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Active CAF for selected type
  const activeCaf = mockCAFs.find((c) => c.dteType === tipoDTE) || mockCAFs[0];
  const nextFolio = activeCaf.folioActual + 1;

  // Real-time calculation of totals
  const neto = items.reduce((acc, item) => (item.esExento ? acc : acc + item.montoTotalItem), 0);
  const exento = items.reduce((acc, item) => (item.esExento ? acc + item.montoTotalItem : acc), 0);
  const iva = tipoDTE === 34 || tipoDTE === 41 ? 0 : Math.round(neto * 0.19);
  const total = neto + exento + iva;

  // Add Item
  const handleAddItem = () => {
    const newItem: DTEItem = {
      id: `item-${items.length + 1}`,
      nroLinea: items.length + 1,
      nombre: '',
      cantidad: 1,
      precioUnitario: 0,
      montoTotalItem: 0,
      esExento: tipoDTE === 34
    };
    setItems([...items, newItem]);
  };

  // Update Item
  const handleUpdateItem = (id: string, field: keyof DTEItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuentoPorcentaje') {
            const qty = field === 'cantidad' ? Number(value) : item.cantidad;
            const price = field === 'precioUnitario' ? Number(value) : item.precioUnitario;
            const discountPct = field === 'descuentoPorcentaje' ? Number(value) : (item.descuentoPorcentaje || 0);
            const subtotal = qty * price;
            updated.montoTotalItem = Math.round(subtotal * (1 - discountPct / 100));
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id).map((item, idx) => ({ ...item, nroLinea: idx + 1 })));
  };

  // 6-Step Cryptographic Emission Sequence
  const handleStartEmission = async () => {
    setIsProcessing(true);
    setCurrentStep(1); // 1. Construcción XML ISO-8859-1

    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(2); // 2. Generación TED & CAF

    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(3); // 3. Firma XMLDSig Enveloped con .pfx

    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(4); // 4. Empaquetado Doble Sobre EnvioDTE

    await new Promise((r) => setTimeout(r, 800));
    setCurrentStep(5); // 5. GetSeed -> GetToken -> POST Upload al SII

    await new Promise((r) => setTimeout(r, 900));
    setCurrentStep(6); // 6. Track ID recibido & Encolado

    const generatedTrackId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const newDoc: DTEDocument = {
      id: `DTE-${tipoDTE}-F${nextFolio}`,
      uuid: crypto.randomUUID ? crypto.randomUUID() : 'f9418294-8192-4819-bf91-918294019284',
      tipoDTE,
      folio: nextFolio,
      status: 'SENT_SII',
      trackId: generatedTrackId,
      siiUploadDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      siiGlosa: 'Envío recibido con éxito. En proceso de validación asíncrona (QueryEstUp).',
      environment: 'certificacion',
      commercialExchangeStatus: 'sent',
      commercialDaysRemaining: 8,
      header: {
        tipoDTE,
        folio: nextFolio,
        fechaEmision: new Date().toISOString().slice(0, 10),
        emisor: {
          rut: mockCompany.rut,
          razonSocial: mockCompany.razonSocial,
          giro: mockCompany.giro,
          acteco: mockCompany.acteco,
          direccion: mockCompany.direccion,
          comuna: mockCompany.comuna,
          ciudad: mockCompany.ciudad,
          correoIntercambio: mockCompany.correoIntercambio
        },
        receptor: {
          rut: rutReceptor,
          razonSocial: razonSocialReceptor,
          giro: giroReceptor,
          direccion: direccionReceptor,
          comuna: comunaReceptor,
          ciudad: ciudadReceptor,
          correoIntercambio
        },
        totales: {
          montoNeto: neto,
          montoExento: exento,
          tasaIVA: tipoDTE === 34 || tipoDTE === 41 ? 0 : 19,
          iva,
          montoTotal: total
        }
      },
      items,
      ted: {
        rutEmisor: mockCompany.rut.replace(/[.-]/g, ''),
        tipoDTE,
        folio: nextFolio,
        fecha: new Date().toISOString().slice(0, 10),
        rutReceptor: rutReceptor.replace(/[.-]/g, ''),
        montoTotal: total,
        primerItem: items[0].nombre,
        cafFragment: activeCaf.xmlCafSnippet,
        rsaSignature: 'Tk92MW...[RSA SIGNATURE]...==',
        rawXML: '<TED version="1.0">...</TED>'
      },
      xmlSignature: {
        digestValue: 'wK8410mNQ12948==',
        signatureValue: 'eW0mN2J4K8w9XzPqL9v2A1bC==',
        canonicalizationMethod: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
        signedAt: new Date().toISOString()
      },
      events: [
        {
          id: 'ev-new-1',
          timestamp: new Date().toLocaleTimeString(),
          source: 'API Gateway',
          action: 'Recepción JSON & Folio Reservado',
          details: `Asignado folio ${nextFolio} con bloqueo transaccional en PostgreSQL`,
          statusBadge: 'info'
        },
        {
          id: 'ev-new-2',
          timestamp: new Date().toLocaleTimeString(),
          source: 'Motor XMLDSig',
          action: 'Firma TED y XMLDSig',
          details: 'Documento firmado con C14N estricta e ISO-8859-1',
          statusBadge: 'success'
        },
        {
          id: 'ev-new-3',
          timestamp: new Date().toLocaleTimeString(),
          source: 'SII SOAP/REST',
          action: 'Upload Multipart al SII',
          details: `Track ID ${generatedTrackId} recibido`,
          statusBadge: 'success'
        }
      ]
    };

    setEmittedDte(newDoc);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Requirements Badge */}
      <DTERequirementBadge
        requirements={[
          { num: 2, title: 'Control de CAF & Bloqueo Transaccional' },
          { num: 3, title: 'Timbre TED (RSA-SHA1 de CAF)' },
          { num: 4, title: 'Firma XMLDSig Enveloped & Canonicalización C14N' },
          { num: 5, title: 'Construcción XML ISO-8859-1 & Schema XSD' },
          { num: 6, title: 'Doble Sobre EnvioDTE' }
        ]}
      />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-extrabold text-slate-900 tracking-tight">
            Emisión Criptográfica de DTE
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generador conforme al estándar del SII con codificación estricta ISO-8859-1 y W3C XMLDSig.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 p-2 px-3 rounded-2xl text-xs">
          <Key className="w-4 h-4 text-amber-600" />
          <span className="text-slate-600 font-semibold">Folio disponible:</span>
          <span className="font-mono font-bold text-dte-primary text-sm">#{nextFolio}</span>
          <span className="text-[10px] text-blue-700 font-mono bg-blue-100 px-1.5 py-0.5 rounded">
            CAF-33-001
          </span>
        </div>
      </div>

      {/* Main Grid: Form Left, Cryptographic Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Document Type Selector Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-headline font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 mr-2 text-amber-500" />
              1. Selección de Tipo de Documento Tributario
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: 33, label: 'Factura Afecta', sub: 'IVA 19%' },
                { type: 34, label: 'Factura Exenta', sub: 'Sin IVA' },
                { type: 39, label: 'Boleta Electrónica', sub: 'REST / pangal' },
                { type: 61, label: 'Nota de Crédito', sub: 'Anulación / Corrección' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setTipoDTE(item.type as DTEDocumentType)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    tipoDTE === item.type
                      ? 'border-dte-primary bg-blue-50/70 shadow-sm ring-2 ring-dte-primary/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">
                    Tipo {item.type}
                  </span>
                  <span className="text-xs font-bold text-slate-900 block leading-tight mt-0.5">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Receptor Information Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-headline font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-dte-primary" />
              2. Datos del Contribuyente Receptor
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  RUT Receptor (con DV)
                </label>
                <input
                  type="text"
                  value={rutReceptor}
                  onChange={(e) => setRutReceptor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:ring-2 focus:ring-dte-primary focus:outline-none"
                  placeholder="ej. 76.432.189-K"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Razón Social
                </label>
                <input
                  type="text"
                  value={razonSocialReceptor}
                  onChange={(e) => setRazonSocialReceptor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-dte-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giro Comercial
                </label>
                <input
                  type="text"
                  value={giroReceptor}
                  onChange={(e) => setGiroReceptor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-dte-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo Electrónico de Intercambio (SII)
                </label>
                <input
                  type="email"
                  value={correoIntercambio}
                  onChange={(e) => setCorreoIntercambio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-dte-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccionReceptor}
                  onChange={(e) => setDireccionReceptor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-dte-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Comuna
                  </label>
                  <input
                    type="text"
                    value={comunaReceptor}
                    onChange={(e) => setComunaReceptor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-dte-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={ciudadReceptor}
                    onChange={(e) => setCiudadReceptor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-dte-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Table Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-headline font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <FileCode2 className="w-4 h-4 mr-2 text-cyan-600" />
                3. Detalle de Ítems / Líneas de Facturación
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-blue-50 text-dte-primary hover:bg-dte-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Agregar Ítem
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      Línea #{index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                        Descripción del Producto / Servicio
                      </label>
                      <input
                        type="text"
                        value={item.nombre}
                        onChange={(e) => handleUpdateItem(item.id, 'nombre', e.target.value)}
                        placeholder="Nombre del servicio o producto..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-dte-primary mt-1"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleUpdateItem(item.id, 'cantidad', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-dte-primary mt-1"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                        Precio Unit. ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.precioUnitario}
                        onChange={(e) => handleUpdateItem(item.id, 'precioUnitario', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-dte-primary mt-1"
                      />
                    </div>

                    <div className="sm:col-span-2 text-right">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                        Subtotal ($)
                      </label>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-2.5">
                        ${item.montoTotalItem.toLocaleString('es-CL')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales Summary Box */}
            <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-xs text-slate-500 font-medium space-y-0.5">
                <p>• Tasa IVA Ley de Impuesto a las Ventas y Servicios: 19%</p>
                <p>• Los totales se cuadran matemáticamente contra el esquema XSD del SII</p>
              </div>

              <div className="w-full sm:w-64 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Monto Neto:</span>
                  <span className="font-mono font-semibold">${neto.toLocaleString('es-CL')}</span>
                </div>
                {exento > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Monto Exento:</span>
                    <span className="font-mono font-semibold">${exento.toLocaleString('es-CL')}</span>
                  </div>
                )}
                {iva > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>I.V.A. (19%):</span>
                    <span className="font-mono font-semibold">${iva.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
                  <span>Total DTE:</span>
                  <span className="font-mono text-base font-black text-dte-primary">
                    ${total.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: 6-Step Cryptographic Engine & Emission Action */}
        <div className="space-y-6">
          
          {/* Cryptographic Execution Box */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-blue-900 shadow-xl space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-bold">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-white text-base">
                  Motor Criptográfico DTE
                </h3>
                <p className="text-[11px] text-blue-200">
                  Secuencia estricta de 6 pasos para emisión
                </p>
              </div>
            </div>

            {/* Stepper Visualizer */}
            <div className="space-y-3">
              {[
                { step: 1, label: '1. XML ISO-8859-1 & Schema XSD', desc: 'Validación sintáctica oficial' },
                { step: 2, label: '2. Timbre TED (RSA-SHA1 del CAF)', desc: 'Genera nodo DD y hash con clave privada CAF' },
                { step: 3, label: '3. Firma XMLDSig (.pfx) Enveloped', desc: 'Canonicalización W3C C14N estricta' },
                { step: 4, label: '4. Generación Sobre Doble EnvioDTE', desc: 'Sobre SII (60803000-K) + Sobre Intercambio' },
                { step: 5, label: '5. Semilla, Token & Upload Multipart', desc: 'POST a maullin.sii.cl con Cookie: TOKEN' },
                { step: 6, label: '6. Track ID & Encolado Asíncrono', desc: 'Worker consultará QueryEstUp -> EPR' }
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-3 rounded-2xl border transition-all ${
                    currentStep === s.step
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                      : currentStep > s.step
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{s.label}</span>
                    {currentStep > s.step ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : currentStep === s.step ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Launch Button */}
            {!emittedDte ? (
              <button
                type="button"
                onClick={handleStartEmission}
                disabled={isProcessing || total === 0}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl font-headline font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Ejecutando Criptografía...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-slate-950" />
                    <span>Emitir & Subir al SII</span>
                  </>
                )}
              </button>
            ) : (
              /* Success Actions Box */
              <div className="bg-emerald-900/60 border border-emerald-500/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>¡DTE Emitido Exitosamente!</span>
                </div>
                <div className="text-[11px] text-slate-200 font-mono space-y-1">
                  <p>Track ID: <strong className="text-white">{emittedDte.trackId}</strong></p>
                  <p>Folio: #{emittedDte.folio} • Tipo {emittedDte.tipoDTE}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setShowXmlModal(true)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                    Ver XML
                  </button>
                  <button
                    onClick={() => setShowPdfModal(true)}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Ver PDF417
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cert Info Banner */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-xs space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Credenciales de Firma Activas
            </span>
            <div className="text-slate-600 space-y-1 font-mono text-[11px]">
              <p>• PFX: <span className="text-slate-900 font-bold">firma_representante_legal_2025.pfx</span></p>
              <p>• RUT Rep: <span className="text-slate-900 font-bold">15.342.981-2</span></p>
              <p>• CA Emisor: <span className="text-slate-900">E-Sign S.A.</span></p>
              <p>• Algoritmo: <span className="text-slate-900 font-bold">RSA-SHA1 (C14N)</span></p>
            </div>
          </div>

        </div>

      </div>

      {/* XML Modal */}
      {showXmlModal && emittedDte && (
        <XMLViewerModal
          dte={emittedDte}
          onClose={() => setShowXmlModal(false)}
        />
      )}

      {/* PDF Modal */}
      {showPdfModal && emittedDte && (
        <PDFPreviewModal
          dte={emittedDte}
          onClose={() => setShowPdfModal(false)}
        />
      )}

    </div>
  );
};
