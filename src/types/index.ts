export type SiiEnvironment = 'certificacion' | 'produccion';

export type UserRole = 'admin' | 'auditor' | 'receiver';

export type DTEDocumentType = 
  | 33  // Factura Electrónica
  | 34  // Factura No Afecta o Exenta Electrónica
  | 39  // Boleta Electrónica
  | 41  // Boleta Electrónica Exenta
  | 56  // Nota de Débito Electrónica
  | 61  // Nota de Crédito Electrónica
  | 52; // Guía de Despacho Electrónica

export type DTEStatus = 
  | 'DRAFT'               // Borrador local
  | 'SIGNED'              // TED + XMLDSig generado
  | 'ENQUEUED'            // En cola de mensajería (RabbitMQ/BullMQ)
  | 'SENT_SII'            // Enviado a SII con Track ID recibido
  | 'EPR'                 // Envío Procesado (Aceptado por el SII)
  | 'SOE'                 // Subido con Reparos (Observaciones SII)
  | 'RCH'                 // Rechazado por el SII
  | 'ACCEPTED_COMMERCIAL' // Aceptado comercialmente (Ley 19.983)
  | 'CLAIMED_COMMERCIAL'; // Reclamado comercialmente

export interface DigitalCertificate {
  id: string;
  commonName: string;
  rutRepresentante: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  algorithm: 'sha1WithRSAEncryption' | 'sha256WithRSAEncryption';
  status: 'valid' | 'expired' | 'revoked';
  pfxFileName: string;
  hasPrivateKey: boolean;
  vaultEncrypted: boolean;
}

export interface CAFAuthorization {
  id: string;
  dteType: DTEDocumentType;
  tipoDocumentoGlosa: string;
  folioDesde: number;
  folioHasta: number;
  folioActual: number;
  foliosDisponibles: number;
  fechaAutorizacion: string;
  siiSignatureKey: string; // Clave privada RSA del SII contenida en el XML CAF
  xmlCafSnippet: string;
  status: 'active' | 'exhausted' | 'expired';
}

export interface DTEItem {
  id: string;
  nroLinea: number;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  esExento?: boolean;
  descuentoPorcentaje?: number;
  montoTotalItem: number;
}

export interface DTEHeader {
  tipoDTE: DTEDocumentType;
  folio: number;
  fechaEmision: string;
  emisor: {
    rut: string;
    razonSocial: string;
    giro: string;
    acteco: number;
    direccion: string;
    comuna: string;
    ciudad: string;
    correoIntercambio: string;
  };
  receptor: {
    rut: string;
    razonSocial: string;
    giro: string;
    direccion: string;
    comuna: string;
    ciudad: string;
    correoIntercambio: string;
  };
  totales: {
    montoNeto: number;
    montoExento: number;
    tasaIVA: number; // 19%
    iva: number;
    montoTotal: number;
  };
}

export interface TEDTimbre {
  rutEmisor: string;
  tipoDTE: DTEDocumentType;
  folio: number;
  fecha: string;
  rutReceptor: string;
  montoTotal: number;
  primerItem: string;
  cafFragment: string;
  rsaSignature: string; // Firma RSA privada del CAF
  rawXML: string;
}

export interface EnvioDTESobre {
  id: string;
  tipoDestino: 'SII' | 'RECEPTOR_COMERCIAL';
  rutEmisor: string;
  rutReceptor: string; // 60803000-K para SII
  fechaResolucion: string;
  numeroResolucion: number;
  cantidadDTEs: number;
  xmlPayload: string;
  firmadoConCertificado: boolean;
}

export interface DTETrackEvent {
  id: string;
  timestamp: string;
  source: 'API Gateway' | 'Cola Mensajería' | 'Motor XMLDSig' | 'SII SOAP/REST' | 'Worker Conciliación' | 'Receptor Comercial';
  action: string;
  details: string;
  statusBadge?: 'success' | 'warning' | 'error' | 'info';
}

export interface DTEDocument {
  id: string;
  uuid: string;
  tipoDTE: DTEDocumentType;
  folio: number;
  header: DTEHeader;
  items: DTEItem[];
  ted?: TEDTimbre;
  xmlSignature?: {
    digestValue: string;
    signatureValue: string;
    canonicalizationMethod: string;
    signedAt: string;
  };
  rawXmlIso8859_1?: string;
  status: DTEStatus;
  trackId?: string;
  siiUploadDate?: string;
  siiGlosa?: string;
  siiRevisionDetails?: string[];
  commercialExchangeStatus?: 'pending_dispatch' | 'sent' | 'receipt_acknowledged' | 'approved' | 'rejected';
  commercialDaysRemaining?: number; // 8 días legales Ley 19.983
  events: DTETrackEvent[];
  environment: SiiEnvironment;
}

export interface SiiSessionToken {
  token: string;
  seed: string;
  signedSeed: string;
  issuedAt: string;
  expiresAt: string;
  isValid: boolean;
  environment: SiiEnvironment;
}

export interface CertificationStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  progressPercentage: number;
  requirements: string[];
  executionLog: string[];
}

export interface CommercialAckXML {
  type: 'EnvioRecibos' | 'ResultadoDTE' | 'RespuestaDTE';
  title: string;
  legalContext: string;
  xmlSnippet: string;
  status: 'accepted' | 'rejected' | 'pending';
  timestamp: string;
}

export interface PMVRequirementDetail {
  num: number;
  title: string;
  category: 'Criptografía Base' | 'Flujo Emisión DTE' | 'Arquitectura Backend' | 'Certificación Maullín' | 'Intercambio Comercial';
  description: string;
  implementation: string;
  targetPath: string;
  iconName: string;
  criticality: 'Alta' | 'Crítica' | 'Media';
  siiNormativeRef: string;
}
