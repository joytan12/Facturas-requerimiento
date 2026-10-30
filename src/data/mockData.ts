import type { 
  DigitalCertificate, 
  CAFAuthorization, 
  DTEDocument, 
  SiiSessionToken, 
  CertificationStage, 
  PMVRequirementDetail 
} from '../types';

export const mockCompany = {
  rut: '76.892.410-5',
  razonSocial: 'Soluciones Tecnológicas Austral SpA',
  giro: 'Servicios de Consultoría y Desarrollo de Software Informático',
  acteco: 620200,
  direccion: 'Av. Apoquindo 4700, Piso 11',
  comuna: 'Las Condes',
  ciudad: 'Santiago',
  correoIntercambio: 'dte-intercambio@australtech.cl',
  resolucionSii: {
    numero: 80,
    fecha: '2025-08-14'
  }
};

export const mockCertificate: DigitalCertificate = {
  id: 'CERT-2025-CL',
  commonName: 'CLAUDIO ANDRES SEPULVEDA MORALES',
  rutRepresentante: '15.342.981-2',
  issuer: 'E-Sign S.A. Autoridad Certificadora Subordinada',
  validFrom: '2025-01-15',
  validTo: '2028-01-15',
  serialNumber: '4C:98:F2:11:AB:65:21:09',
  algorithm: 'sha256WithRSAEncryption',
  status: 'valid',
  pfxFileName: 'firma_representante_legal_2025.pfx',
  hasPrivateKey: true,
  vaultEncrypted: true
};

export const mockCAFs: CAFAuthorization[] = [
  {
    id: 'CAF-33-001',
    dteType: 33,
    tipoDocumentoGlosa: 'Factura Electrónica Afecta',
    folioDesde: 1,
    folioHasta: 100,
    folioActual: 46,
    foliosDisponibles: 54,
    fechaAutorizacion: '2026-01-10',
    siiSignatureKey: 'MIIBOwIBAAJBAMEQ+k2fV9K8Z1y+qJ...[RSA PRIVATE KEY 1024-BIT SII]...IDAQAB',
    xmlCafSnippet: `<AUTORIZACION>
  <CAF version="1.0">
    <DA>
      <RE>76892410-5</RE>
      <RS>SOLUCIONES TECNOLOGICAS AUSTRAL SPA</RS>
      <TD>33</TD>
      <RNG><D>1</D><H>100</H></RNG>
      <FA>2026-01-10</FA>
      <RSAPK><M>w3pTz...==</M><E>Aw==</E></RSAPK>
      <IDK>100</IDK>
    </DA>
    <FRMA algoritmo="SHA1withRSA">bGF6YXJv...</FRMA>
  </CAF>
</AUTORIZACION>`,
    status: 'active'
  },
  {
    id: 'CAF-34-001',
    dteType: 34,
    tipoDocumentoGlosa: 'Factura No Afecta o Exenta',
    folioDesde: 1,
    folioHasta: 50,
    folioActual: 12,
    foliosDisponibles: 38,
    fechaAutorizacion: '2026-01-10',
    siiSignatureKey: 'MIIBPQIBAAJBAMR79qW...[RSA PRIVATE KEY 1024-BIT SII]...IDAQAB',
    xmlCafSnippet: `<AUTORIZACION>
  <CAF version="1.0">
    <DA>
      <RE>76892410-5</RE>
      <RS>SOLUCIONES TECNOLOGICAS AUSTRAL SPA</RS>
      <TD>34</TD>
      <RNG><D>1</D><H>50</H></RNG>
      <FA>2026-01-10</FA>
      <RSAPK><M>p19Km...==</M><E>Aw==</E></RSAPK>
      <IDK>200</IDK>
    </DA>
    <FRMA algoritmo="SHA1withRSA">dGVtcGxh...</FRMA>
  </CAF>
</AUTORIZACION>`,
    status: 'active'
  },
  {
    id: 'CAF-39-001',
    dteType: 39,
    tipoDocumentoGlosa: 'Boleta Electrónica',
    folioDesde: 1001,
    folioHasta: 2000,
    folioActual: 1084,
    foliosDisponibles: 916,
    fechaAutorizacion: '2026-02-01',
    siiSignatureKey: 'MIIBPQIBAAJBAMLx30...[RSA PRIVATE KEY REST SII]...IDAQAB',
    xmlCafSnippet: `<AUTORIZACION>
  <CAF version="1.0">
    <DA>
      <RE>76892410-5</RE>
      <RS>SOLUCIONES TECNOLOGICAS AUSTRAL SPA</RS>
      <TD>39</TD>
      <RNG><D>1001</D><H>2000</H></RNG>
      <FA>2026-02-01</FA>
      <RSAPK><M>zLk41...==</M><E>Aw==</E></RSAPK>
      <IDK>300</IDK>
    </DA>
    <FRMA algoritmo="SHA1withRSA">bW9yZGFu...</FRMA>
  </CAF>
</AUTORIZACION>`,
    status: 'active'
  },
  {
    id: 'CAF-61-001',
    dteType: 61,
    tipoDocumentoGlosa: 'Nota de Crédito Electrónica',
    folioDesde: 1,
    folioHasta: 50,
    folioActual: 8,
    foliosDisponibles: 42,
    fechaAutorizacion: '2026-01-10',
    siiSignatureKey: 'MIIBPQIBAAJBAMN50p...[RSA PRIVATE KEY SII]...IDAQAB',
    xmlCafSnippet: `<AUTORIZACION>
  <CAF version="1.0">
    <DA>
      <RE>76892410-5</RE>
      <RS>SOLUCIONES TECNOLOGICAS AUSTRAL SPA</RS>
      <TD>61</TD>
      <RNG><D>1</D><H>50</H></RNG>
      <FA>2026-01-10</FA>
      <RSAPK><M>qO22w...==</M><E>Aw==</E></RSAPK>
      <IDK>400</IDK>
    </DA>
    <FRMA algoritmo="SHA1withRSA">a2psa2Y...</FRMA>
  </CAF>
</AUTORIZACION>`,
    status: 'active'
  }
];

export const mockSiiToken: SiiSessionToken = {
  token: 'TK-SII-9842109482-AUTH',
  seed: '0984128471',
  signedSeed: 'MIIF5wYJKoZIhvcNAQcCoIIF2DCCBdQCAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHAT...',
  issuedAt: '2026-10-30T09:40:00-03:00',
  expiresAt: '2026-10-30T10:40:00-03:00',
  isValid: true,
  environment: 'certificacion'
};

export const mockDTEs: DTEDocument[] = [
  {
    id: 'DTE-33-045',
    uuid: 'a89c4210-61b4-4e9e-b98a-119284092831',
    tipoDTE: 33,
    folio: 45,
    status: 'EPR',
    trackId: '2984729103',
    siiUploadDate: '2026-10-29 14:22:10',
    siiGlosa: 'EPR - Envío Procesado con Éxito. Documento Aceptado por el SII.',
    environment: 'certificacion',
    commercialExchangeStatus: 'approved',
    commercialDaysRemaining: 7,
    header: {
      tipoDTE: 33,
      folio: 45,
      fechaEmision: '2026-10-29',
      emisor: {
        rut: '76.892.410-5',
        razonSocial: 'Soluciones Tecnológicas Austral SpA',
        giro: 'Servicios de Consultoría y Desarrollo de Software',
        acteco: 620200,
        direccion: 'Av. Apoquindo 4700, Piso 11',
        comuna: 'Las Condes',
        ciudad: 'Santiago',
        correoIntercambio: 'dte-intercambio@australtech.cl'
      },
      receptor: {
        rut: '96.541.220-3',
        razonSocial: 'Distribuidora Los Andes S.A.',
        giro: 'Distribución y Comercialización de Artículos Electrónicos',
        direccion: 'Av. Matta 1240',
        comuna: 'Santiago Centro',
        ciudad: 'Santiago',
        correoIntercambio: 'facturacion@losandes.cl'
      },
      totales: {
        montoNeto: 1500000,
        montoExento: 0,
        tasaIVA: 19,
        iva: 285000,
        montoTotal: 1785000
      }
    },
    items: [
      {
        id: 'ITM-01',
        nroLinea: 1,
        nombre: 'Implementación Motor Criptográfico XMLDSig',
        descripcion: 'Desarrollo de microservicio para canonicalización C14N y timbrado TED',
        cantidad: 1,
        precioUnitario: 1000000,
        montoTotalItem: 1000000
      },
      {
        id: 'ITM-02',
        nroLinea: 2,
        nombre: 'Soporte y Pruebas Ambiente Maullín',
        descripcion: 'Configuración de endpoints SOAP y simulación de 50 documentos',
        cantidad: 1,
        precioUnitario: 500000,
        montoTotalItem: 500000
      }
    ],
    ted: {
      rutEmisor: '76892410-5',
      tipoDTE: 33,
      folio: 45,
      fecha: '2026-10-29',
      rutReceptor: '96541220-3',
      montoTotal: 1785000,
      primerItem: 'Implementación Motor Criptográfico XMLDSig',
      cafFragment: '<CAF version="1.0">...</CAF>',
      rsaSignature: 'W1Y8X2Z9aL...==',
      rawXML: `<TED version="1.0"><DD><RE>76892410-5</RE><TD>33</TD><F>45</F><FE>2026-10-29</FE><RR>96541220-3</RR><RSR>Distribuidora Los Andes S.A.</RSR><MNT>1785000</MNT><IT1>Implementación Motor Criptográfico XMLDSig</IT1><CAF version="1.0">...</CAF><TSTED>2026-10-29T14:20:00</TSTED></DD><FRMT algoritmo="SHA1withRSA">W1Y8X2Z9aL...</FRMT></TED>`
    },
    xmlSignature: {
      digestValue: 'rK48XoP+89mN1q0v6w5zL7a1=',
      signatureValue: 'eW0mN2J4K8w9XzPqL9v2A1bC...==',
      canonicalizationMethod: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      signedAt: '2026-10-29T14:21:05-03:00'
    },
    events: [
      {
        id: 'EV-01',
        timestamp: '2026-10-29 14:20:10',
        source: 'API Gateway',
        action: 'Recepción JSON & Bloqueo Transaccional',
        details: 'Folio 45 asignado mediante SELECT ... FOR UPDATE en PostgreSQL',
        statusBadge: 'info'
      },
      {
        id: 'EV-02',
        timestamp: '2026-10-29 14:20:30',
        source: 'Motor XMLDSig',
        action: 'Generación TED & Firma Criptográfica ISO-8859-1',
        details: 'Calculado SHA-1 de nodo DD y firmado con clave privada RSA de CAF-33-001',
        statusBadge: 'success'
      },
      {
        id: 'EV-03',
        timestamp: '2026-10-29 14:21:05',
        source: 'Motor XMLDSig',
        action: 'Firma Enveloped XMLDSig con .pfx',
        details: 'Aplicada firma W3C RSA-SHA1 con certificado de representante legal',
        statusBadge: 'success'
      },
      {
        id: 'EV-04',
        timestamp: '2026-10-29 14:22:00',
        source: 'SII SOAP/REST',
        action: 'Autenticación Semilla & POST EnvioDTE',
        details: 'Subida multipart exitosa a maullin.sii.cl. Track ID generado: 2984729103',
        statusBadge: 'success'
      },
      {
        id: 'EV-05',
        timestamp: '2026-10-29 14:25:40',
        source: 'Worker Conciliación',
        action: 'Consulta QueryEstUp -> EPR',
        details: 'El SII procesó el envío sin observaciones (EPR)',
        statusBadge: 'success'
      },
      {
        id: 'EV-06',
        timestamp: '2026-10-29 14:26:00',
        source: 'Receptor Comercial',
        action: 'Envío de sobre comercial e IMAP Acuse',
        details: 'Sobre EnvioDTE recibido por casilla facturacion@losandes.cl. Acuse técnico retornado.',
        statusBadge: 'success'
      }
    ]
  },
  {
    id: 'DTE-33-046',
    uuid: 'b91c5321-72c5-5f0f-c09b-220395103942',
    tipoDTE: 33,
    folio: 46,
    status: 'SOE',
    trackId: '2984729188',
    siiUploadDate: '2026-10-30 08:15:22',
    siiGlosa: 'SOE - Envío Procesado con Reparos. El documento es válido pero contiene advertencias.',
    siiRevisionDetails: [
      'Reparo 01: El RUT receptor presenta diferencias en la actividad económica principal.',
      'Reparo 02: Advertencia informativa sobre plazo para emisión diferida.'
    ],
    environment: 'certificacion',
    commercialExchangeStatus: 'sent',
    commercialDaysRemaining: 8,
    header: {
      tipoDTE: 33,
      folio: 46,
      fechaEmision: '2026-10-30',
      emisor: {
        rut: '76.892.410-5',
        razonSocial: 'Soluciones Tecnológicas Austral SpA',
        giro: 'Servicios de Consultoría y Desarrollo de Software',
        acteco: 620200,
        direccion: 'Av. Apoquindo 4700, Piso 11',
        comuna: 'Las Condes',
        ciudad: 'Santiago',
        correoIntercambio: 'dte-intercambio@australtech.cl'
      },
      receptor: {
        rut: '77.102.840-K',
        razonSocial: 'Constructora e Ingeniería del Pacífico Ltda.',
        giro: 'Obras Menores y Montaje Industrial',
        direccion: 'Camino El Alba 8900',
        comuna: 'Las Condes',
        ciudad: 'Santiago',
        correoIntercambio: 'proveedores@pacificoctr.cl'
      },
      totales: {
        montoNeto: 3200000,
        montoExento: 0,
        tasaIVA: 19,
        iva: 608000,
        montoTotal: 3808000
      }
    },
    items: [
      {
        id: 'ITM-01',
        nroLinea: 1,
        nombre: 'Licencia Servidor Motor DTE On-Premise',
        cantidad: 1,
        precioUnitario: 3200000,
        montoTotalItem: 3200000
      }
    ],
    events: [
      {
        id: 'EV-10',
        timestamp: '2026-10-30 08:14:00',
        source: 'API Gateway',
        action: 'Ingreso DTE Folio 46',
        details: 'Folio 46 reservado',
        statusBadge: 'info'
      },
      {
        id: 'EV-11',
        timestamp: '2026-10-30 08:15:22',
        source: 'SII SOAP/REST',
        action: 'Upload Track ID 2984729188',
        details: 'Recibido por SII maullin',
        statusBadge: 'warning'
      }
    ]
  },
  {
    id: 'DTE-34-012',
    uuid: 'c02d6432-83d6-6a1a-d10c-331406214053',
    tipoDTE: 34,
    folio: 12,
    status: 'EPR',
    trackId: '2984729221',
    siiUploadDate: '2026-10-28 11:30:00',
    siiGlosa: 'EPR - Envío Procesado con Éxito. Factura Exenta aprobada.',
    environment: 'certificacion',
    commercialExchangeStatus: 'approved',
    commercialDaysRemaining: 6,
    header: {
      tipoDTE: 34,
      folio: 12,
      fechaEmision: '2026-10-28',
      emisor: {
        rut: '76.892.410-5',
        razonSocial: 'Soluciones Tecnológicas Austral SpA',
        giro: 'Servicios de Consultoría y Desarrollo de Software',
        acteco: 620200,
        direccion: 'Av. Apoquindo 4700, Piso 11',
        comuna: 'Las Condes',
        ciudad: 'Santiago',
        correoIntercambio: 'dte-intercambio@australtech.cl'
      },
      receptor: {
        rut: '69.070.300-9',
        razonSocial: 'Fundación Educacional del Sur',
        giro: 'Educación Superior y Capacitación',
        direccion: 'Av. Alemania 0450',
        comuna: 'Temuco',
        ciudad: 'Temuco',
        correoIntercambio: 'contabilidad@fundacioneduca.cl'
      },
      totales: {
        montoNeto: 0,
        montoExento: 850000,
        tasaIVA: 0,
        iva: 0,
        montoTotal: 850000
      }
    },
    items: [
      {
        id: 'ITM-01',
        nroLinea: 1,
        nombre: 'Taller de Seguridad en XMLDSig y Firma Digital',
        esExento: true,
        cantidad: 1,
        precioUnitario: 850000,
        montoTotalItem: 850000
      }
    ],
    events: [
      {
        id: 'EV-20',
        timestamp: '2026-10-28 11:30:00',
        source: 'Worker Conciliación',
        action: 'QueryEstUp Finalizado',
        details: 'Estado EPR confirmado por SII',
        statusBadge: 'success'
      }
    ]
  },
  {
    id: 'DTE-39-1084',
    uuid: 'd13e7543-94e7-7b2b-e21d-442517325164',
    tipoDTE: 39,
    folio: 1084,
    status: 'EPR',
    trackId: 'REST-BOL-91820491',
    siiUploadDate: '2026-10-30 09:12:00',
    siiGlosa: 'EPR - Boleta Electrónica Recibida y Aprobada vía REST (pangal.sii.cl).',
    environment: 'certificacion',
    header: {
      tipoDTE: 39,
      folio: 1084,
      fechaEmision: '2026-10-30',
      emisor: {
        rut: '76.892.410-5',
        razonSocial: 'Soluciones Tecnológicas Austral SpA',
        giro: 'Servicios de Consultoría y Desarrollo de Software',
        acteco: 620200,
        direccion: 'Av. Apoquindo 4700, Piso 11',
        comuna: 'Las Condes',
        ciudad: 'Santiago',
        correoIntercambio: 'dte-intercambio@australtech.cl'
      },
      receptor: {
        rut: '66.666.666-6',
        razonSocial: 'Cliente Final Consumidor',
        giro: 'Consumo Particular',
        direccion: 'Av. Libertad 342',
        comuna: 'Viña del Mar',
        ciudad: 'Viña del Mar',
        correoIntercambio: 'cliente@gmail.com'
      },
      totales: {
        montoNeto: 42017,
        montoExento: 0,
        tasaIVA: 19,
        iva: 7983,
        montoTotal: 50000
      }
    },
    items: [
      {
        id: 'ITM-01',
        nroLinea: 1,
        nombre: 'Suscripción Mensual API Facturación',
        cantidad: 1,
        precioUnitario: 50000,
        montoTotalItem: 50000
      }
    ],
    events: [
      {
        id: 'EV-30',
        timestamp: '2026-10-30 09:12:00',
        source: 'SII SOAP/REST',
        action: 'Emisión REST Boleta v2',
        details: 'Enviado a endpoint REST pangal con token Bearer',
        statusBadge: 'success'
      }
    ]
  }
];

export const mockCertificationStages: CertificationStage[] = [
  {
    id: 'STAGE-1',
    stageNumber: 1,
    title: 'Set de Pruebas Básico',
    description: 'Generación y envío del sobre EnvioDTE con casos de prueba estrictos entregados por el SII.',
    status: 'completed',
    progressPercentage: 100,
    requirements: [
      '3 Facturas Electrónicas Afectas (Tipo 33) con diversos ítems y recargos',
      '1 Nota de Crédito (Tipo 61) que anula totalmente la Factura 1 (CodRef 1)',
      '1 Nota de Crédito (Tipo 61) que corrige texto/giro de la Factura 2 (CodRef 2)',
      'Validación de cero reparos (EPR estricto) en el validador Maullín'
    ],
    executionLog: [
      '[OK] Casos de prueba cargados desde archivo oficial SII',
      '[OK] Timbrado TED con CAF de prueba asignado',
      '[OK] Enveloping en EnvioDTE hacia RutReceptor 60803000-K',
      '[OK] Track ID 1982740129 -> Estado EPR confirmado'
    ]
  },
  {
    id: 'STAGE-2',
    stageNumber: 2,
    title: 'Simulación de Operación Real',
    description: 'Emisión masiva de 20 a 200 documentos simulando la operación regular del giro de la empresa.',
    status: 'in_progress',
    progressPercentage: 85,
    requirements: [
      'Emitir 50 Facturas Afectas, 10 Exentas y 5 Notas de Débito',
      'Simulación de dispersión de fechas dentro del mes en curso',
      'Cero descalces en cuadratura de IVA 19% ni redondeos',
      'Validación de folios continuos sin saltos injustificados'
    ],
    executionLog: [
      '[OK] 55 de 65 documentos generados y procesados con éxito',
      '[RUNNING] Worker asíncrono consultando los últimos 10 Track IDs...',
      '[PENDING] Cuadratura final de libro de ventas y DTEs'
    ]
  },
  {
    id: 'STAGE-3',
    stageNumber: 3,
    title: 'Intercambio de Información Comercial',
    description: 'Recepción del XML de prueba de un proveedor ficticio del SII y emisión de los 3 XMLs de respuesta.',
    status: 'completed',
    progressPercentage: 100,
    requirements: [
      'EnvioRecibos: Acuse de mercaderías o servicios prestados (Ley 19.983)',
      'ResultadoDTE: Aceptación o rechazo técnico del XML recibido',
      'RespuestaDTE: Aceptación o reclamo comercial del contenido'
    ],
    executionLog: [
      '[OK] Archivo prueba_proveedor_sii.xml importado',
      '[OK] EnvioRecibos generado y firmado con certificado digital',
      '[OK] ResultadoDTE emitido con estado: DTE Aceptado OK',
      '[OK] RespuestaDTE emitida y despachada a casilla ficticia SII'
    ]
  },
  {
    id: 'STAGE-4',
    stageNumber: 4,
    title: 'Muestras Impresas (PDF y PDF417)',
    description: 'Generación de representación impresa (Formato Carta y Térmico) con el código PDF417 validado.',
    status: 'completed',
    progressPercentage: 100,
    requirements: [
      'Timbre electrónico TED en código bidimensional PDF417 legible',
      'Dimensiones reglamentarias mínimas (55mm x 20mm)',
      'Leyenda reglamentaria obligatoria: "CEDIBLE CON SU FACTURA"',
      'Subida de PDFs al portal del SII para aprobación de diseño'
    ],
    executionLog: [
      '[OK] Algoritmo bwip-js renderizado en SVG y canvas de alta resolución',
      '[OK] Prueba de escaneo con pistola 2D óptica: 100% legibilidad',
      '[OK] PDFs generados y listos para visto bueno del funcionario SII'
    ]
  }
];

export const dteRequirementsList: PMVRequirementDetail[] = [
  {
    num: 1,
    title: 'Certificado Digital & Firma .pfx/.p12',
    category: 'Criptografía Base',
    description: 'Gestión segura del archivo .pfx o .p12 del representante legal para firma de semilla, folios, DTE individual y sobre EnvioDTE.',
    implementation: 'Carga segura en Bóveda Criptográfica con desencapsulado de llave privada RSA y almacenamiento cifrado en reposo (AES-256-GCM / Vault).',
    targetPath: '/admin/boveda',
    iconName: 'Key',
    criticality: 'Crítica',
    siiNormativeRef: 'Resolución Ex. SII N° 11 de 2003'
  },
  {
    num: 2,
    title: 'Código de Autorización de Folios (CAF)',
    category: 'Criptografía Base',
    description: 'Administración de archivos XML CAF otorgados por el SII por rango de folios, conteniendo la llave privada RSA del SII exclusiva para timbrar.',
    implementation: 'Parser de XML de CAF, extracción de rango autorizado, control de folios con bloqueo transaccional y resguardo de la llave privada del SII.',
    targetPath: '/admin/boveda',
    iconName: 'FileKey',
    criticality: 'Crítica',
    siiNormativeRef: 'Manual Técnico DTE SII v1.0'
  },
  {
    num: 3,
    title: 'Timbre Electrónico DTE (TED) & PDF417',
    category: 'Criptografía Base',
    description: 'Generación del nodo resumen XML <TED>, cálculo de hash SHA-1 de su nodo <DD> y firma con la llave privada RSA del CAF para convertirlo en código PDF417.',
    implementation: 'Constructor estricto del nodo <TED> en ISO-8859-1, digest SHA-1, firmado RSA-SHA1 e integración con motor de renderizado de código PDF417.',
    targetPath: '/admin/emitir',
    iconName: 'QrCode',
    criticality: 'Crítica',
    siiNormativeRef: 'Resolución Ex. SII N° 45 de 2003'
  },
  {
    num: 4,
    title: 'Firma XMLDSig Enveloped & Canonicalización C14N',
    category: 'Criptografía Base',
    description: 'Estándar W3C para firmar el nodo <Documento> en RSA-SHA1 con canonicalización C14N estricta: un solo espacio en blanco inválido corrompe la firma.',
    implementation: 'Motor criptográfico de canonicalización W3C C14N que respeta codificación ISO-8859-1 sin alteraciones de caracteres ni saltos de línea Windows/Unix.',
    targetPath: '/admin/emitir',
    iconName: 'ShieldCheck',
    criticality: 'Crítica',
    siiNormativeRef: 'W3C XMLDSig Standard / Esquema DTE SII'
  },
  {
    num: 5,
    title: 'Construcción XML en ISO-8859-1 & Schema XSD',
    category: 'Flujo Emisión DTE',
    description: 'Generación de la estructura <Documento> con <Encabezado> e <Detalle> validada contra los esquemas oficiales DTE_v10.xsd del SII.',
    implementation: 'Serializador XML con cabecera <?xml version="1.0" encoding="ISO-8859-1"?> y validador de tipos y longitudes de campos según XSD oficial.',
    targetPath: '/admin/emitir',
    iconName: 'FileCode2',
    criticality: 'Alta',
    siiNormativeRef: 'Esquema XSD DTE_v10.xsd SII'
  },
  {
    num: 6,
    title: 'Doble Sobre EnvioDTE (SII vs Intercambio)',
    category: 'Flujo Emisión DTE',
    description: 'Empaquetado de DTEs en dos carátulas firmadas: Sobre 1 para el SII (RutReceptor 60803000-K) y Sobre 2 para el cliente receptor comercial.',
    implementation: 'Generador del nodo contenedor <EnvioDTE> con <SetDTE> individualmente firmado con el certificado digital del emisor para cada destinatario.',
    targetPath: '/admin/ciclo-de-vida',
    iconName: 'MailCheck',
    criticality: 'Alta',
    siiNormativeRef: 'Circular N° 21 de 2004 SII'
  },
  {
    num: 7,
    title: 'Autenticación Semilla & Token de Sesión SII',
    category: 'Flujo Emisión DTE',
    description: 'Consumo de servicio GetSeed, firma de la semilla con el .pfx y solicitud de TOKEN mediante GetTokenFromSeed (validez de 1 hora).',
    implementation: 'Cliente SOAP/REST con caché de token, renovación automática ante expiración e inyección en cabeceras HTTP (Cookie: TOKEN=...).',
    targetPath: '/admin/ciclo-de-vida',
    iconName: 'Lock',
    criticality: 'Crítica',
    siiNormativeRef: 'Webservice Autenticación SII'
  },
  {
    num: 8,
    title: 'Upload Multipart & Obtención de Track ID',
    category: 'Flujo Emisión DTE',
    description: 'POST multipart/form-data del XML EnvioDTE al endpoint de subida del SII, recibiendo de respuesta un Track ID de 10 dígitos.',
    implementation: 'Conector HTTP multipart resiliente con timeouts controlados y parsing instantáneo de la respuesta XML con el número de atención (Track ID).',
    targetPath: '/admin/emitir',
    iconName: 'UploadCloud',
    criticality: 'Crítica',
    siiNormativeRef: 'Servicio Web Subida DTE SII'
  },
  {
    num: 9,
    title: 'Worker Asíncrono de Conciliación (QueryEstUp)',
    category: 'Arquitectura Backend',
    description: 'Monitoreo en background del estado del Track ID mediante QueryEstUp hasta obtener EPR (Envío Procesado) o reporte de reparos.',
    implementation: 'Workers dedicados desacoplados que ejecutan consultas periódicas con exponential backoff y registran el historial de estados.',
    targetPath: '/admin',
    iconName: 'RefreshCw',
    criticality: 'Alta',
    siiNormativeRef: 'Webservice QueryEstUp SII'
  },
  {
    num: 10,
    title: 'Intercambio Comercial & Acuses (Ley 19.983)',
    category: 'Intercambio Comercial',
    description: 'Despacho del XML a la casilla de intercambio del receptor y gestión del plazo perentorio de 8 días para aceptación o reclamo de facturas.',
    implementation: 'Bandeja de intercambio comercial con temporizador de 8 días legales, sincronización de casilla de correo y log de trazabilidad.',
    targetPath: '/admin/intercambio',
    iconName: 'Inbox',
    criticality: 'Alta',
    siiNormativeRef: 'Ley N° 19.983 y Circular SII N° 4'
  },
  {
    num: 11,
    title: 'Generación de los 3 XMLs de Respuesta Comercial',
    category: 'Intercambio Comercial',
    description: 'Generación de EnvioRecibos (mercaderías), ResultadoDTE (técnico) y RespuestaDTE (comercial) para recepción de facturas de proveedores.',
    implementation: 'Motor que parsea DTEs recibidos de proveedores y construye los tres sobres XML estandarizados firmados criptográficamente.',
    targetPath: '/admin/intercambio',
    iconName: 'FileCheck2',
    criticality: 'Alta',
    siiNormativeRef: 'Formato Intercambio DTE SII'
  },
  {
    num: 12,
    title: 'Renderizador PDF con Timbre PDF417 & Copia Cedible',
    category: 'Flujo Emisión DTE',
    description: 'Generación de la representación gráfica oficial (Carta y 80mm térmico) con el timbre PDF417 nítido y la leyenda "CEDIBLE CON SU FACTURA".',
    implementation: 'Motor de renderizado visual con código de barras PDF417 vectorial de alta densidad y opciones de impresión estándar y térmica.',
    targetPath: '/admin/emitir',
    iconName: 'Printer',
    criticality: 'Media',
    siiNormativeRef: 'Instrucciones Representación Impresa SII'
  },
  {
    num: 13,
    title: 'Arquitectura de Colas y Resiliencia ante Caídas SII',
    category: 'Arquitectura Backend',
    description: 'Desacoplamiento total de la emisión HTTP respecto a la disponibilidad del SII mediante colas de mensajería (RabbitMQ / BullMQ).',
    implementation: 'Pipeline asíncrono que entrega respuesta instantánea al frontend/ERP y garantiza reintentos automáticos si el SII presenta degradación.',
    targetPath: '/admin/ciclo-de-vida',
    iconName: 'Layers',
    criticality: 'Crítica',
    siiNormativeRef: 'Best Practice de Arquitectura Resiliente'
  },
  {
    num: 14,
    title: 'Suite de Certificación Ambiente Maullín & Pangal',
    category: 'Certificación Maullín',
    description: 'Consola integral para ejecutar el Set Básico, Simulación de 20-200 documentos, Intercambio y Muestras Impresas ante el SII.',
    implementation: 'Módulo interactivo con ejecución paso a paso, validación de cuadraturas y automatización por script para certificar nuevos RUTs en minutos.',
    targetPath: '/admin/certificacion',
    iconName: 'Award',
    criticality: 'Crítica',
    siiNormativeRef: 'Proceso de Certificación de Mercado SII'
  }
];
