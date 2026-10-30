import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Play, 
  Terminal, 
  FileText, 
  FileCheck2, 
  Printer, 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  Server, 
  Copy, 
  Check,
  ExternalLink
} from 'lucide-react';
import { DTERequirementBadge } from '../../components/common/DTERequirementBadge';
import { mockCertificationStages } from '../../data/mockData';

export const CertificacionMaullinPage: React.FC = () => {
  const [stages, setStages] = useState(mockCertificationStages);
  const [activeTab, setActiveTab] = useState<'set_basico' | 'simulacion' | 'intercambio' | 'muestras' | 'script'>('set_basico');
  const [isExecutingScript, setIsExecutingScript] = useState(false);
  const [scriptRut, setScriptRut] = useState('76.999.888-4');
  const [scriptLog, setScriptLog] = useState<string[]>([]);
  const [copiedScript, setCopiedScript] = useState(false);

  // Simulated script runner for multi-client certification
  const handleRunCertificationScript = async () => {
    setIsExecutingScript(true);
    setScriptLog([`[START] Iniciando script de certificación automatizada para RUT: ${scriptRut}`]);

    await new Promise((r) => setTimeout(r, 600));
    setScriptLog((prev) => [...prev, `[1/5] Descargando set de pruebas desde maullin.sii.cl... OK`]);

    await new Promise((r) => setTimeout(r, 700));
    setScriptLog((prev) => [...prev, `[2/5] Generando 5 DTEs de prueba (3 Facturas, 2 Notas de Crédito con referencias)... OK`]);

    await new Promise((r) => setTimeout(r, 700));
    setScriptLog((prev) => [...prev, `[3/5] Timbrando con CAF y firmando EnvioDTE único hacia RutReceptor 60803000-K... OK`]);

    await new Promise((r) => setTimeout(r, 800));
    setScriptLog((prev) => [...prev, `[4/5] POST multipart a maullin. Track ID: 3918204910 -> QueryEstUp EPR (Cero reparos)... OK`]);

    await new Promise((r) => setTimeout(r, 700));
    setScriptLog((prev) => [...prev, `[5/5] Emisión de 50 documentos en simulación y generación de los 3 XMLs de intercambio... OK`]);

    await new Promise((r) => setTimeout(r, 500));
    setScriptLog((prev) => [...prev, `[SUCCESS] ¡Empresa ${scriptRut} lista para solicitar paso a Producción (palena.sii.cl) en 3.5 minutos!`]);
    setIsExecutingScript(false);
  };

  const automationScriptSnippet = `// scripts/certify-client.ts
// Certificación automatizada en Ambiente Maullín para un nuevo RUT
import { DteEngine, SiiClient } from '@austral/dte-engine';

export async function certifyNewClient(rutEmisor: string, pfxPath: string, pfxPassword: string) {
  const engine = new DteEngine({ rutEmisor, pfxPath, pfxPassword, env: 'maullin' });
  
  console.log('[1] Descargando archivo de casos de prueba SII...');
  const testCases = await SiiClient.getMaullinTestCases(rutEmisor);
  
  console.log('[2] Construyendo y timbrando DTEs de prueba...');
  const dtes = await engine.buildSetDePruebas(testCases);
  const sobreEnvio = await engine.packageEnvioDTE(dtes, '60803000-K');
  
  console.log('[3] Upload al SII y consulta QueryEstUp...');
  const trackId = await engine.uploadToSii(sobreEnvio);
  await engine.pollUntilEpr(trackId);
  
  console.log('[4] Ejecutando simulación masiva (50 documentos)...');
  await engine.runSimulation({ count: 50 });
  
  console.log('[5] Generando acuses de intercambio (EnvioRecibos, ResultadoDTE, RespuestaDTE)...');
  await engine.generateCommercialAcks();
  
  console.log('✓ Certificación completada exitosamente.');
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(automationScriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Requirements Badge */}
      <DTERequirementBadge
        requirements={[
          { num: 14, title: 'Suite de Certificación Ambiente Maullín & Pangal' },
          { num: 11, title: 'Generación de los 3 XMLs de Respuesta Comercial' },
          { num: 12, title: 'Renderizador PDF con Timbre PDF417 & Copia Cedible' }
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-dte-primary to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-900 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Postulación al Sistema de Facturación de Mercado SII
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-black text-white">
            Suite de Certificación Ambiente Maullín
          </h1>
          <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
            Para emitir en Producción (<code>palena.sii.cl</code> / <code>rahue.sii.cl</code>), tu software debe superar
            las 4 etapas obligatorias en el ambiente de certificación (<code>maullin.sii.cl</code> / <code>pangal.sii.cl</code>).
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 px-6 rounded-2xl border border-white/20 text-center min-w-[170px]">
          <span className="text-3xl font-headline font-extrabold text-amber-400 font-mono">3 / 4</span>
          <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider block mt-0.5">
            Etapas Superadas
          </span>
          <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full mt-2 inline-block">
            96% Progreso Global
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'set_basico', label: '1. Set de Pruebas Básico', icon: FileText },
          { id: 'simulacion', label: '2. Simulación (20-200 DTEs)', icon: Zap },
          { id: 'intercambio', label: '3. Intercambio Comercial', icon: FileCheck2 },
          { id: 'muestras', label: '4. Muestras Impresas (PDF417)', icon: Printer },
          { id: 'script', label: '⚡ Automatización Multi-RUT', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-dte-primary text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-amber-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Set de Pruebas Básico */}
      {activeTab === 'set_basico' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                Etapa 1 Obligatoria
              </span>
              <h2 className="text-xl font-headline font-black text-slate-900 mt-0.5">
                Set de Pruebas Básico del SII
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> Superado (Cero Reparos)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            El SII entrega un archivo de texto con casos específicos que ponen a prueba todas las casuísticas tributarias.
            Todos los DTEs deben empaquetarse en un único sobre <code>&lt;EnvioDTE&gt;</code> y no admiten ninguna discrepancia de centavos ni de referencias.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Casos de Prueba Ejecutados:</span>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Factura 1 (Tipo 33):</strong> 3 ítems afectos, descuento global del 5% y recargo específico de flete.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Factura 2 (Tipo 33):</strong> 1 ítem exento y 2 afectos con cálculo diferenciado.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Factura 3 (Tipo 33):</strong> Venta con retención parcial de cambio de sujeto.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Nota de Crédito 1 (Tipo 61):</strong> Anula totalmente la Factura 1 (CodRef 1).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Nota de Crédito 2 (Tipo 61):</strong> Corrige texto y giro de la Factura 2 (CodRef 2).</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-2 overflow-auto">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Log de Validación Maullín (Track ID 1982740129)
              </span>
              <p className="text-slate-400">[14:10:02] Recibiendo EnvioDTE_SetPruebas.xml (5 DTEs)</p>
              <p className="text-slate-400">[14:10:04] Validando schema contra DTE_v10.xsd: OK</p>
              <p className="text-slate-400">[14:10:05] Verificando firma XMLDSig de representante: OK</p>
              <p className="text-slate-400">[14:10:06] Validando 5 Timbres TED con CAF de prueba: OK</p>
              <p className="text-emerald-400 font-bold">[14:10:08] RESULTADO: EPR - Aceptado sin reparos</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Simulación */}
      {activeTab === 'simulacion' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                Etapa 2 Obligatoria
              </span>
              <h2 className="text-xl font-headline font-black text-slate-900 mt-0.5">
                Simulación de Operación Real (20 a 200 DTEs)
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center">
              <RefreshCw className="w-4 h-4 mr-1 text-amber-600 animate-spin" /> En Progreso (85%)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Consiste en emitir un lote significativo de documentos emulando la facturación habitual de la empresa en un mes real,
            comprobando que la asignación secuencial de folios, cálculo de IVA y envío asíncrono no fallen ante carga continua.
          </p>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Progreso de Simulación: 55 / 65 Documentos Emitidos</span>
              <span className="text-dte-primary font-mono text-sm">85%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-3 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Facturas Afectas 33</span>
                <span className="font-bold text-slate-900 font-mono text-sm">45 emitidas</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Facturas Exentas 34</span>
                <span className="font-bold text-slate-900 font-mono text-sm">8 emitidas</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Notas de Crédito 61</span>
                <span className="font-bold text-slate-900 font-mono text-sm">2 emitidas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Intercambio Comercial */}
      {activeTab === 'intercambio' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                Etapa 3 Obligatoria
              </span>
              <h2 className="text-xl font-headline font-black text-slate-900 mt-0.5">
                Intercambio de Información Comercial
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> Superado (100%)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            El SII envía un XML de prueba generado por un proveedor ficticio. El motor debe recibirlo, validar su firma criptográfica y schema,
            y emitir automáticamente los 3 XMLs de respuesta comercial reglamentarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-xs block">1. EnvioRecibos</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Recibo de mercaderías o servicios prestados conforme a la <strong>Ley 19.983</strong>.
              </p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                ✓ XML Aprobado por SII
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-xs block">2. ResultadoDTE</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Aceptación o rechazo técnico del XML recibido (validez de schema y firma electrónica).
              </p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                ✓ XML Aprobado por SII
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-xs block">3. RespuestaDTE</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Aceptación o reclamo comercial del contenido (plazo legal de 8 días).
              </p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                ✓ XML Aprobado por SII
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Muestras Impresas */}
      {activeTab === 'muestras' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                Etapa 4 Obligatoria
              </span>
              <h2 className="text-xl font-headline font-black text-slate-900 mt-0.5">
                Muestras Impresas & Timbre PDF417
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> Superado (100%)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Se generan las representaciones impresas en PDF (Formato Carta y Formato Térmico 80mm) con el timbre PDF417
            y la leyenda legal <strong>"CEDIBLE CON SU FACTURA"</strong> en la copia para factoring.
          </p>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800">Verificación de Legibilidad Óptica</span>
              <p className="text-xs text-slate-500">
                El timbre electrónico TED fue verificado con escáneres 2D físicos cumpliendo con las dimensiones de 55mm x 20mm.
              </p>
            </div>
            <button
              onClick={() => window.open('/admin', '_self')}
              className="px-4 py-2 bg-dte-primary hover:bg-dte-primary-light text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Ver Muestra en Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Automatización Multi-RUT (The secret weapon from prompt!) */}
      {activeTab === 'script' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">
                Dato Clave de Arquitectura (Prompt de Facturación)
              </span>
              <h2 className="text-xl font-headline font-black text-slate-900 mt-0.5">
                Script de Certificación Automatizada para Nuevos Clientes / RUTs
              </h2>
            </div>
            <button
              onClick={handleCopyScript}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center transition-colors self-start sm:self-auto"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-600 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5 text-slate-500" />}
              {copiedScript ? 'Copiado' : 'Copiar Script'}
            </button>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
            💡 <strong>Ventaja Competitiva:</strong> Una vez que certificas tu motor con la primera empresa emisora, 
            puedes automatizar las etapas 1, 2 y 3 mediante un script para certificar a tus futuros clientes (nuevos RUTs) 
            en cuestión de <strong>minutos</strong>, eliminando semanas de trámites manuales.
          </div>

          {/* Interactive Simulation Run */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-300">RUT Nuevo Cliente a Certificar:</label>
                <input
                  type="text"
                  value={scriptRut}
                  onChange={(e) => setScriptRut(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <button
                onClick={handleRunCertificationScript}
                disabled={isExecutingScript}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md disabled:opacity-50"
              >
                {isExecutingScript ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Certificando en Maullín...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Ejecutar Script de Certificación Rápida</span>
                  </>
                )}
              </button>
            </div>

            {/* Execution Log */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 min-h-[120px] max-h-[220px] overflow-y-auto">
              {scriptLog.length === 0 ? (
                <span className="text-slate-500 italic">
                  Haz clic en "Ejecutar Script de Certificación Rápida" para probar la automatización multi-tenant...
                </span>
              ) : (
                scriptLog.map((line, idx) => (
                  <p
                    key={idx}
                    className={
                      line.includes('[SUCCESS]')
                        ? 'text-emerald-400 font-bold'
                        : line.includes('[START]')
                        ? 'text-amber-400 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>

          {/* Code Snippet */}
          <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>
              <code>{automationScriptSnippet}</code>
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
