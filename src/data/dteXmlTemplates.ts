import type { DTEDocument, CommercialAckXML } from '../types';

export const generateSampleDteXml = (dte: DTEDocument): string => {
  const h = dte.header;
  const itemsXml = dte.items.map((item) => `      <Detalle>
        <NroLinDet>${item.nroLinea}</NroLinDet>
        <NmbItem>${item.nombre}</NmbItem>
        ${item.descripcion ? `<DscItem>${item.descripcion}</DscItem>` : ''}
        <QtyItem>${item.cantidad}</QtyItem>
        <PrcItem>${item.precioUnitario}</PrcItem>
        ${item.descuentoPorcentaje ? `<DescuentoPct>${item.descuentoPorcentaje}</DescuentoPct>` : ''}
        <MontoItem>${item.montoTotalItem}</MontoItem>
      </Detalle>`).join('\n');

  return `<?xml version="1.0" encoding="ISO-8859-1"?>
<DTE version="1.0" xmlns="http://www.sii.cl/SiiDte">
  <Documento ID="DTE-${dte.tipoDTE}-F${dte.folio}">
    <Encabezado>
      <IdDoc>
        <TipoDTE>${dte.tipoDTE}</TipoDTE>
        <Folio>${dte.folio}</Folio>
        <FchEmis>${h.fechaEmision}</FchEmis>
      </IdDoc>
      <Emisor>
        <RUTEmisor>${h.emisor.rut}</RUTEmisor>
        <RznSoc>${h.emisor.razonSocial}</RznSoc>
        <GiroEmis>${h.emisor.giro}</GiroEmis>
        <Acteco>${h.emisor.acteco}</Acteco>
        <DirOrigen>${h.emisor.direccion}</DirOrigen>
        <CmnaOrigen>${h.emisor.comuna}</CmnaOrigen>
        <CiudadOrigen>${h.emisor.ciudad}</CiudadOrigen>
      </Emisor>
      <Receptor>
        <RUTRecep>${h.receptor.rut}</RUTRecep>
        <RznSocRecep>${h.receptor.razonSocial}</RznSocRecep>
        <GiroRecep>${h.receptor.giro}</GiroRecep>
        <DirRecep>${h.receptor.direccion}</DirRecep>
        <CmnaRecep>${h.receptor.comuna}</CmnaRecep>
        <CiudadRecep>${h.receptor.ciudad}</CiudadRecep>
      </Receptor>
      <Totales>
        ${h.totales.montoNeto > 0 ? `<MntNeto>${h.totales.montoNeto}</MntNeto>` : ''}
        ${h.totales.montoExento > 0 ? `<MntExe>${h.totales.montoExento}</MntExe>` : ''}
        ${h.totales.tasaIVA > 0 ? `<TasaIVA>${h.totales.tasaIVA}</TasaIVA>` : ''}
        ${h.totales.iva > 0 ? `<IVA>${h.totales.iva}</IVA>` : ''}
        <MntTotal>${h.totales.montoTotal}</MntTotal>
      </Totales>
    </Encabezado>
${itemsXml}
    <TED version="1.0">
      <DD>
        <RE>${h.emisor.rut.replace(/[.-]/g, '')}</RE>
        <TD>${dte.tipoDTE}</TD>
        <F>${dte.folio}</F>
        <FE>${h.fechaEmision}</FE>
        <RR>${h.receptor.rut.replace(/[.-]/g, '')}</RR>
        <RSR>${h.receptor.razonSocial.slice(0, 40)}</RSR>
        <MNT>${h.totales.montoTotal}</MNT>
        <IT1>${dte.items[0]?.nombre.slice(0, 40) || 'Item 1'}</IT1>
        <CAF version="1.0">
          <DA>
            <RE>${h.emisor.rut.replace(/[.-]/g, '')}</RE>
            <RS>${h.emisor.razonSocial}</RS>
            <TD>${dte.tipoDTE}</TD>
            <RNG><D>1</D><H>100</H></RNG>
            <FA>2026-01-10</FA>
            <RSAPK><M>w3pTz...==</M><E>Aw==</E></RSAPK>
            <IDK>100</IDK>
          </DA>
          <FRMA algoritmo="SHA1withRSA">bGF6YXJv...</FRMA>
        </CAF>
        <TSTED>${h.fechaEmision}T12:00:00</TSTED>
      </DD>
      <FRMT algoritmo="SHA1withRSA">Yk5hTjhmOTAyMz...[RSA-SHA1 SIGNATURE BY CAF PRIVATE KEY]...==</FRMT>
    </TED>
    <TmstFirma>${h.fechaEmision}T12:01:15</TmstFirma>
  </Documento>
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
      <Reference URI="#DTE-${dte.tipoDTE}-F${dte.folio}">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
        <DigestValue>${dte.xmlSignature?.digestValue || 'rK48XoP+89mN1q0v6w5zL7a1='}</DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>${dte.xmlSignature?.signatureValue || 'MIIBOwIBAAJBAMEQ+k2fV9K8Z1y+qJ...=='}</SignatureValue>
    <KeyInfo>
      <KeyValue>
        <RSAKeyValue>
          <Modulus>s7D1yK4p...==</Modulus>
          <Exponent>AQAB</Exponent>
        </RSAKeyValue>
      </KeyValue>
      <X509Data>
        <X509Certificate>MIIFnzCCBEegAwIBAgIQ...[CERTIFICADO DIGITAL .PFX DEL REPRESENTANTE LEGAL]...==</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
</DTE>`;
};

export const generateEnvioDteXml = (
  dte: DTEDocument, 
  tipoDestino: 'SII' | 'RECEPTOR_COMERCIAL'
): string => {
  const rutReceptorSobre = tipoDestino === 'SII' 
    ? '60803000-K' 
    : dte.header.receptor.rut;

  return `<?xml version="1.0" encoding="ISO-8859-1"?>
<EnvioDTE version="1.0" xmlns="http://www.sii.cl/SiiDte" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sii.cl/SiiDte EnvioDTE_v10.xsd">
  <SetDTE ID="SetDTE-SOBRE-${dte.folio}">
    <Caratula version="1.0">
      <RutEmisor>${dte.header.emisor.rut}</RutEmisor>
      <RutEnvia>15.342.981-2</RutEnvia>
      <RutReceptor>${rutReceptorSobre}</RutReceptor>
      <FchResol>2025-08-14</FchResol>
      <NroResol>80</NroResol>
      <TmstFirmaEnv>${dte.header.fechaEmision}T12:05:00</TmstFirmaEnv>
      <SubTotDTE>
        <TpoDTE>${dte.tipoDTE}</TpoDTE>
        <NroDTE>1</NroDTE>
      </SubTotDTE>
    </Caratula>
    <!-- DTE Individual Enclosed -->
    ${generateSampleDteXml(dte).replace('<?xml version="1.0" encoding="ISO-8859-1"?>\n', '')}
  </SetDTE>
  <!-- Firma XMLDSig del Carátula / SetDTE Completo con .PFX -->
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
      <Reference URI="#SetDTE-SOBRE-${dte.folio}">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
        <DigestValue>+8Dk3LmsZ94m1pQwertyu71=</DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>Jk982La90Kz89LqpXm...==</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509Certificate>MIIFnzCCBEegAwIBAgIQ...==</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
</EnvioDTE>`;
};

export const sampleCommercialAcks: CommercialAckXML[] = [
  {
    type: 'EnvioRecibos',
    title: 'Acuse de Recibo de Mercaderías o Servicios (Ley 19.983)',
    legalContext: 'Acredita la recepción conforme de bienes o servicios entregados. Permite que la factura constituya título ejecutivo transferible o cedible en factoring.',
    xmlSnippet: `<?xml version="1.0" encoding="ISO-8859-1"?>
<EnvioRecibos version="1.0" xmlns="http://www.sii.cl/SiiDte">
  <SetRecibos ID="SetRecibos-001">
    <Caratula version="1.0">
      <RutResponde>76.892.410-5</RutResponde>
      <RutRecibe>96.541.220-3</RutRecibe>
      <NroRecibos>1</NroRecibos>
      <TmstFirmaEnv>2026-10-30T10:15:00</TmstFirmaEnv>
    </Caratula>
    <Recibo version="1.0">
      <DocumentoRecibo ID="REC-45">
        <TipoDoc>33</TipoDoc>
        <Folio>45</Folio>
        <FchEmis>2026-10-29</FchEmis>
        <RUTEmisor>96.541.220-3</RUTEmisor>
        <RUTRecep>76.892.410-5</RUTRecep>
        <MntTotal>1785000</MntTotal>
        <ReciboDetalle>
          <MntNeto>1500000</MntNeto>
          <IVA>285000</IVA>
          <Declaracion>El acuse de recibo que se declara en este acto se rige por lo dispuesto en la Ley 19.983</Declaracion>
          <TmstRecibo>2026-10-30T10:14:00</TmstRecibo>
        </ReciboDetalle>
      </DocumentoRecibo>
    </Recibo>
  </SetRecibos>
</EnvioRecibos>`,
    status: 'accepted',
    timestamp: '2026-10-30 10:15:00'
  },
  {
    type: 'ResultadoDTE',
    title: 'Aceptación o Rechazo Técnico del XML Recibido',
    legalContext: 'Responde si el archivo XML recibido cumple con el esquema XSD oficial del SII y si la firma electrónica del sobre y del DTE son válidas.',
    xmlSnippet: `<?xml version="1.0" encoding="ISO-8859-1"?>
<ResultadoDTE version="1.0" xmlns="http://www.sii.cl/SiiDte">
  <RecepcionDTE>
    <RUTEmisor>96.541.220-3</RUTEmisor>
    <RUTRecep>76.892.410-5</RUTRecep>
    <TipoDTE>33</TipoDTE>
    <Folio>45</Folio>
    <FchEmis>2026-10-29</FchEmis>
    <MntTotal>1785000</MntTotal>
    <EstadoRecepDTE>0</EstadoRecepDTE>
    <RecepDTEGlosa>DTE Recibido OK - Schema y Firma Criptográfica Válidos</RecepDTEGlosa>
  </RecepcionDTE>
</ResultadoDTE>`,
    status: 'accepted',
    timestamp: '2026-10-30 10:16:30'
  },
  {
    type: 'RespuestaDTE',
    title: 'Aceptación o Reclamo Comercial del Contenido',
    legalContext: 'Dentro del plazo legal perentorio de 8 días corridos, el receptor acepta o reclama el contenido comercial (precios, ítems, plazos). Sin respuesta, opera la aceptación tácita por el SII.',
    xmlSnippet: `<?xml version="1.0" encoding="ISO-8859-1"?>
<RespuestaDTE version="1.0" xmlns="http://www.sii.cl/SiiDte">
  <Resultado>
    <Caratula>
      <RutResponde>76.892.410-5</RutResponde>
      <RutRecibe>96.541.220-3</RutRecibe>
      <IdRespuesta>RESP-45-ACEPTA</IdRespuesta>
      <NroDetalles>1</NroDetalles>
      <TmstFirmaResp>2026-10-30T10:18:00</TmstFirmaResp>
    </Caratula>
    <RecepcionEnvio>
      <NmbEnvio>EnvioDTE-45.xml</NmbEnvio>
      <FchRecep>2026-10-29T14:30:00</FchRecep>
      <CodEnvio>0</CodEnvio>
      <EnvioOk>DTE Aceptado Conforme</EnvioOk>
    </RecepcionEnvio>
  </Resultado>
</RespuestaDTE>`,
    status: 'accepted',
    timestamp: '2026-10-30 10:18:00'
  }
];
