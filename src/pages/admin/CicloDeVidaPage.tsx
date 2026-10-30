import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Mail, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  FileCode2, 
  Key, 
  Workflow
} from 'lucide-react';
import { DTERequirementBadge } from '../../components/common/DTERequirementBadge';

interface LifecycleStep {
  step: number;
  title: string;
  source: string;
  target: string;
  protocol: string;
  description: string;
  technicalDetails: string;
  codeSnippet: string;
  payloadType: 'JSON' | 'XML' | 'SOAP' | 'HTTP_MULTIPART';
}

export const CicloDeVidaPage: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps: LifecycleStep[] = [
    {
      step: 1,
      title: 'Petición Limpia desde ERP / Frontend',
      source: 'Frontend / ERP',
      target: 'API Gateway (Core)',
      protocol: 'HTTPS REST / JSON',
      description: 'El usuario o sistema de facturación envía un payload limpio con ítems, montos y RUTs. La emisión nunca se bloquea en espera del SII.',
      technicalDetails: 'El API Gateway valida reglas de negocio (cálculo de IVA 19%, consistencia de precios unitarios) y bloquea la fila de folios en PostgreSQL (SELECT ... FOR UPDATE) para evitar folios duplicados.',
      payloadType: 'JSON',
      codeSnippet: `{
  "tipoDTE": 33,
  "rutReceptor": "77.102.840-K",
  "razonSocial": "Constructora e Ingeniería del Pacífico Ltda.",
  "items": [
    {
      "nro": 1,
      "nombre": "Servicio de Consultoría Criptográfica XMLDSig",
      "cantidad": 1,
      "precio": 1200000,
      "descuento": 0
    }
  ],
  "montoNeto": 1200000,
  "iva": 228000,
  "montoTotal": 1428000
}`
    },
    {
      step: 2,
      title: 'Desacoplamiento en Cola de Mensajería',
      source: 'API Gateway (Core)',
      target: 'Cola RabbitMQ / BullMQ',
      protocol: 'AMQP / Redis Queue',
      description: 'El API Gateway encola el trabajo de timbrado y responde inmediatamente HTTP 202 Accepted al frontend, previniendo timeouts ante caídas del SII.',
      technicalDetails: 'Gestión de colas con política de Dead Letter Queue (DLQ) y reintentos automáticos con exponential backoff (1s, 5s, 30s, 5m).',
      payloadType: 'JSON',
      codeSnippet: `{
  "jobId": "job-dte-33-folio-47",
  "assignedFolio": 47,
  "cafId": "CAF-33-001",
  "attempts": 0,
  "priority": "high",
  "timestamp": "2026-10-30T10:30:00Z"
}`
    },
    {
      step: 3,
      title: 'Motor Criptográfico: TED & XMLDSig ISO-8859-1',
      source: 'Motor Criptográfico',
      target: 'Generación XML Interna',
      protocol: 'Criptografía Local (RSA-SHA1 + C14N)',
      description: 'Construcción estricta del XML en codificación ISO-8859-1, firma del TED con llave privada RSA del CAF y firma Enveloped con certificado .pfx.',
      technicalDetails: 'Canonicalización W3C C14N estricta: un solo cambio en espacios o saltos de línea (\r\n vs \n) invalida la firma criptográfica.',
      payloadType: 'XML',
      codeSnippet: `<?xml version="1.0" encoding="ISO-8859-1"?>
<DTE version="1.0" xmlns="http://www.sii.cl/SiiDte">
  <Documento ID="DTE-33-F47">
    <Encabezado>...</Encabezado>
    <Detalle>...</Detalle>
    <TED version="1.0">
      <DD>
        <RE>76892410-5</RE><TD>33</TD><F>47</F><FE>2026-10-30</FE>
        <RR>77102840-K</RR><MNT>1428000</MNT>
        <CAF version="1.0">...</CAF>
      </DD>
      <FRMT algoritmo="SHA1withRSA">bW9yZGFu...==</FRMT>
    </TED>
  </Documento>
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
      ...
    </SignedInfo>
    <SignatureValue>Jk82La90Kz89LqpXm...==</SignatureValue>
  </Signature>
</DTE>`
    },
    {
      step: 4,
      title: 'Empaquetado en Doble Sobre EnvioDTE',
      source: 'Motor Criptográfico',
      target: 'Bóveda de Sobres XML',
      protocol: 'XML Enveloping & Firma SetDTE',
      description: 'El SII no recibe <DTE> suelto; exige envolverlos en la carátula <EnvioDTE>. Se generan dos sobres: uno al SII y otro al cliente receptor.',
      technicalDetails: 'Sobre SII: RutReceptor = 60803000-K. Sobre Cliente: RutReceptor = RUT del comprador. La carátula completa se firma nuevamente con el .pfx.',
      payloadType: 'XML',
      codeSnippet: `<?xml version="1.0" encoding="ISO-8859-1"?>
<EnvioDTE version="1.0" xmlns="http://www.sii.cl/SiiDte">
  <SetDTE ID="SetDTE-SOBRE-47">
    <Caratula version="1.0">
      <RutEmisor>76.892.410-5</RutEmisor>
      <RutEnvia>15.342.981-2</RutEnvia>
      <RutReceptor>60803000-K</RutReceptor>
      <FchResol>2025-08-14</FchResol>
      <NroResol>80</NroResol>
      <SubTotDTE><TpoDTE>33</TpoDTE><NroDTE>1</NroDTE></SubTotDTE>
    </Caratula>
    <DTE>...</DTE>
  </SetDTE>
  <Signature>...</Signature>
</EnvioDTE>`
    },
    {
      step: 5,
      title: 'Autenticación (Semilla & Token) y Upload al SII',
      source: 'Worker de Despacho',
      target: 'SII (maullin.sii.cl / palena)',
      protocol: 'SOAP GetSeed + HTTPS Multipart POST',
      description: 'Solicitud de semilla SOAP, firma digital con .pfx, obtención de TOKEN (duración 1 hr) y POST multipart del archivo EnvioDTE.',
      technicalDetails: 'El SII responde al instante con un Track ID (número de atención de 10 dígitos) confirmando la recepción física del archivo en su gateway.',
      payloadType: 'HTTP_MULTIPART',
      codeSnippet: `POST /cgi_dte/UPL/DTEUpload HTTP/1.1
Host: maullin.sii.cl
Cookie: TOKEN=TK-SII-9842109482-AUTH
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryX

------WebKitFormBoundaryX
Content-Disposition: form-data; name="rutSender"
15342981
------WebKitFormBoundaryX
Content-Disposition: form-data; name="rutCompany"
76892410
------WebKitFormBoundaryX
Content-Disposition: form-data; name="archivo"; filename="EnvioDTE_47.xml"
Content-Type: text/xml

<?xml version="1.0" encoding="ISO-8859-1"?>...
------WebKitFormBoundaryX--

HTTP/1.1 200 OK
<STATUS>0</STATUS>
<TRACKID>2984729103</TRACKID>`
    },
    {
      step: 6,
      title: 'Worker de Conciliación Asíncrona (QueryEstUp)',
      source: 'Worker Conciliación (Cron)',
      target: 'SII Webservice QueryEstUp',
      protocol: 'SOAP QueryEstUp',
      description: 'Un Track ID solo confirma que el archivo llegó, no que sea válido. El worker consulta periódicamente hasta obtener EPR (Envío Procesado).',
      technicalDetails: 'Si el SII retorna SOE (Subido con Reparos), se alertan las advertencias. Si retorna RCH (Rechazado), se inicia flujo de resolución.',
      payloadType: 'SOAP',
      codeSnippet: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <QueryEstUp xmlns="http://www.sii.cl/WS_DTE/">
      <RutCompania>76892410</RutCompania>
      <DvCompania>5</DvCompania>
      <TrackId>2984729103</TrackId>
      <Token>TK-SII-9842109482-AUTH</Token>
    </QueryEstUp>
  </soapenv:Body>
</soapenv:Envelope>

<!-- RESPUESTA SII -->
<RESP_HDR>
  <ESTADO>EPR</ESTADO>
  <GLOSA>Envío Procesado con Éxito. Cero reparos.</GLOSA>
</RESP_HDR>`
    },
    {
      step: 7,
      title: 'Intercambio Comercial entre Contribuyentes & Ley 19.983',
      source: 'Servicio de Intercambio',
      target: 'Casilla Cliente Receptor',
      protocol: 'SMTP / IMAP (Acuse 8 días)',
      description: 'Envío del segundo sobre EnvioDTE a la casilla de correo registrada por el cliente en el SII, y recepción de los 3 acuses de recibo legales.',
      technicalDetails: 'Acuse de recibo de mercadería (EnvioRecibos), Aceptación técnica (ResultadoDTE) y Aceptación comercial dentro de 8 días (RespuestaDTE).',
      payloadType: 'XML',
      codeSnippet: `<!-- Sobre enviado a facturacion@cliente.cl -->
<!-- Acuse legal retornado por el cliente en 8 días: -->
<EnvioRecibos version="1.0" xmlns="http://www.sii.cl/SiiDte">
  <SetRecibos ID="SetRecibos-001">
    <Recibo version="1.0">
      <DocumentoRecibo ID="REC-47">
        <TipoDoc>33</TipoDoc>
        <Folio>47</Folio>
        <RUTEmisor>76.892.410-5</RUTEmisor>
        <Declaracion>Acuse de recibo de mercaderías según Ley 19.983</Declaracion>
      </DocumentoRecibo>
    </Recibo>
  </SetRecibos>
</EnvioRecibos>`
    }
  ];

  const currentStep = steps[activeStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % steps.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="space-y-6">
      
      {/* Requirements Badge */}
      <DTERequirementBadge
        requirements={[
          { num: 6, title: 'Doble Sobre EnvioDTE (SII vs Intercambio)' },
          { num: 7, title: 'Autenticación Semilla & Token SII' },
          { num: 8, title: 'Upload Multipart & Track ID' },
          { num: 9, title: 'Worker Asíncrono de Conciliación (QueryEstUp)' },
          { num: 10, title: 'Intercambio Comercial (Ley 19.983)' },
          { num: 13, title: 'Arquitectura Desacoplada con Colas' }
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-mono">
              Arquitectura Asíncrona & Pipeline Criptográfico
            </span>
          </div>
          <h1 className="text-2xl font-headline font-extrabold text-slate-900 tracking-tight mt-1">
            Simulador Interactivo del Ciclo de Vida y Mensajería DTE
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Recorre paso a paso cómo viajan los paquetes XML, firmas criptográficas y estados entre el Core, el SII y el receptor.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeStepIndex === 0}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 disabled:opacity-40 transition-colors"
            title="Paso Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-dte-primary text-white hover:bg-dte-primary-light shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Reproducir</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStepIndex === steps.length - 1}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 disabled:opacity-40 transition-colors"
            title="Siguiente Paso"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setActiveStepIndex(0); setIsPlaying(false); }}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
            title="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual System Actor Pipeline (Architecture Top Diagram) */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-blue-900 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            Pipeline de Mensajería Criptográfica
          </span>
          <span className="text-xs font-mono text-blue-200">
            Paso {activeStepIndex + 1} de {steps.length}: <strong className="text-white">{currentStep.title}</strong>
          </span>
        </div>

        {/* 5 Actor Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'actor-1', name: 'ERP / Frontend', role: 'Emisor Original', stepMatch: [0] },
            { id: 'actor-2', name: 'Core API & Colas', role: 'Gateway & RabbitMQ', stepMatch: [0, 1] },
            { id: 'actor-3', name: 'Motor XMLDSig', role: 'TED + RSA-SHA1', stepMatch: [2, 3] },
            { id: 'actor-4', name: 'Servidores SII', role: 'Maullín / Palena', stepMatch: [4, 5] },
            { id: 'actor-5', name: 'Receptor Comercial', role: 'Casilla Intercambio', stepMatch: [6] }
          ].map((actor, idx) => {
            const isCurrentSource = currentStep.source.toLowerCase().includes(actor.name.toLowerCase().slice(0, 5));
            const isCurrentTarget = currentStep.target.toLowerCase().includes(actor.name.toLowerCase().slice(0, 5));
            const isActiveNode = actor.stepMatch.includes(activeStepIndex);

            return (
              <div
                key={actor.id}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isActiveNode
                    ? 'bg-blue-950 border-amber-400 ring-2 ring-amber-400/30 text-white shadow-lg'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                  Actor #{idx + 1}
                </div>
                <div className="text-xs font-bold leading-tight">
                  {actor.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {actor.role}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => { setActiveStepIndex(idx); setIsPlaying(false); }}
              className={`h-2 rounded-full transition-all ${
                idx === activeStepIndex
                  ? 'bg-amber-400 shadow-md shadow-amber-400/50'
                  : idx < activeStepIndex
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
              title={`Paso ${s.step}: ${s.title}`}
            ></button>
          ))}
        </div>

      </div>

      {/* Step Inspector Detail (Two Columns: Explanation Left, Payload Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Step Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
              Paso #{currentStep.step} de {steps.length}
            </span>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
              Protocolo: {currentStep.protocol}
            </span>
          </div>

          <h2 className="text-xl font-headline font-black text-slate-900">
            {currentStep.title}
          </h2>

          {/* Direction Banner */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">{currentStep.source}</span>
            <ArrowRight className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="font-bold text-dte-primary">{currentStep.target}</span>
          </div>

          {/* Overview */}
          <div className="text-xs text-slate-700 leading-relaxed space-y-2">
            <p className="font-medium">{currentStep.description}</p>
          </div>

          {/* Technical Details Note */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-1">
            <span className="font-bold text-dte-primary block mb-1">
              Aspectos Técnicos & Normativos:
            </span>
            <p className="leading-relaxed text-slate-700">
              {currentStep.technicalDetails}
            </p>
          </div>
        </div>

        {/* Right: Real Packet Payload Inspector */}
        <div className="bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 p-4 px-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white">
                Payload / Mensaje ({currentStep.payloadType})
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              ISO-8859-1 Strict
            </span>
          </div>

          <div className="flex-1 p-4 overflow-auto max-h-[380px] font-mono text-xs">
            <pre className="whitespace-pre overflow-x-auto text-slate-300">
              <code>{currentStep.codeSnippet}</code>
            </pre>
          </div>

          <div className="bg-slate-900/60 p-3 px-6 border-t border-slate-800 text-right">
            <span className="text-[11px] text-slate-400 font-mono">
              Estructura canónica validada contra DTE_v10.xsd
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
