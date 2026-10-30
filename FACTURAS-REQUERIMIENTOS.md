# 🇨🇱 Especificación Técnica y Arquitectura de Facturación Electrónica (DTE) - SII Chile

> **Proyecto:** Facturas-requerimiento  
> **Ubicación:** `facturas/Facturas-requerimiento/`  
> **GitHub:** [https://github.com/joytan12/Facturas-requerimiento](https://github.com/joytan12/Facturas-requerimiento)  
> **Deploy Vercel:** [https://facturas-requerimiento.vercel.app](https://facturas-requerimiento.vercel.app)  
> **Estándar:** DTE_v10.xsd / W3C XMLDSig / ISO-8859-1  
> **Ambientes:** Certificación (`maullin.sii.cl` / `pangal.sii.cl`) y Producción (`palena.sii.cl` / `rahue.sii.cl`)

---

## 1. Resumen Ejecutivo & Marco Normativo

Desarrollar un software propio de facturación electrónica (DTE) en Chile exige implementar un motor capaz de gestionar **criptografía asimétrica (XMLDSig RSA-SHA1)**, esquemas XML estrictos en codificación **ISO-8859-1** y comunicación **asíncrona** mediante servicios SOAP y REST con el Servicio de Impuestos Internos (SII).

El sistema regula y respalda las operaciones tributarias de los siguientes documentos:
* **Tipo 33:** Factura Electrónica Afecta (IVA 19%)
* **Tipo 34:** Factura No Afecta o Exenta Electrónica
* **Tipo 39:** Boleta Electrónica (API REST vía `pangal`/`rahue`)
* **Tipo 41:** Boleta Electrónica Exenta
* **Tipo 56:** Nota de Débito Electrónica
* **Tipo 61:** Nota de Crédito Electrónica
* **Tipo 52:** Guía de Despacho Electrónica

---

## 2. Los 4 Componentes Criptográficos Base

Antes de escribir la lógica comercial o de facturación, la plataforma administra e interactúa con 4 componentes de seguridad:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   4 COMPONENTES CRIPTOGRÁFICOS BASE                   │
└────────────────────────────────────────────────────────────────────────┘

  1. Certificado Digital (.pfx / .p12)
     └─ Representante Legal ──► Firma Semilla (GetSeed), Folios, DTEs y EnvioDTE

  2. CAF (Código de Autorización de Folios)
     └─ XML descargado del SII ──► Rango de folios + Clave Privada RSA exclusiva

  3. TED (Timbre Electrónico del DTE)
     └─ Resumen XML (<DD>) ──► Hash SHA-1 firmado con RSA de CAF ──► Código PDF417

  4. Firma XMLDSig Enveloped (W3C)
     └─ Firma <Documento> en RSA-SHA1 con Canonicalización C14N en ISO-8859-1
```

### 2.1. Certificado Digital (Firma Electrónica Simple / Avanzada)
* Archivo binario `.pfx` o `.p12` emitido por una entidad certificadora acreditada (Acepta, E-Sign, Certinet, etc.) perteneciente al representante legal de la empresa emisora.
* Con su clave privada se firman:
  1. La semilla de autenticación (`GetSeed -> GetTokenFromSeed`).
  2. Cada documento DTE individual (`<Documento>`).
  3. La carátula del sobre electrónico (`<EnvioDTE>`).
  4. Los acuses comerciales de intercambio (**Ley 19.983**).

### 2.2. Código de Autorización de Folios (CAF)
* Archivo XML timbrado electrónicamente por el SII que se obtiene al solicitar timbraje de folios (ej. folios 1 al 100 para Tipo 33).
* Contiene:
  * Rango autorizado (`<RNG><D>1</D><H>100</H></RNG>`).
  * Fecha de autorización (`<FA>`).
  * Llave privada RSA entregada por el SII en el nodo `<RSAPK>` exclusiva para ese rango.

### 2.3. Timbre Electrónico del DTE (TED)
* Nodo XML resumen que contiene: RUT emisor, tipo DTE, folio, fecha de emisión, RUT receptor, razón social receptor, monto total, primer ítem (`<IT1>`) y fragmento del CAF.
* Se calcula el digesto **SHA-1** del nodo `<DD>` y se firma con la **clave privada RSA del CAF**.
* La cadena resultante se codifica en el código de barras bidimensional **PDF417** impreso en el PDF legal.

### 2.4. Firma XMLDSig (Enveloped Signature)
* Estándar W3C para firmar nodos XML usando algoritmo `RSA-SHA1` (Resolución Ex. SII N° 11).
* **Canonicalización C14N estricta (`http://www.w3.org/TR/2001/REC-xml-c14n-20010315`):** Cualquier variación en espacios en blanco, atributos o saltos de línea (`\r\n` de Windows vs `\n` de Unix) invalida el documento de forma irreversible (*Error de Schema o Firma Inválida*).

---

## 3. Flujo Técnico de Emisión de un DTE (6 Pasos)

```
[ ERP / Frontend ]
       │
       ▼
1. Construcción XML (ISO-8859-1) ──► Valida contra DTE_v10.xsd
       │
2. Timbre TED ───────────────────► Digest SHA-1 + Firma RSA del CAF ──► PDF417
       │
3. Firma XMLDSig ────────────────► Firma Enveloped con .PFX del Representante Legal
       │
4. Doble Sobre EnvioDTE ─────────► Sobre 1 (SII: 60803000-K) + Sobre 2 (Receptor Comercial)
       │
5. Autenticación & Upload ───────► GetSeed ──► GetToken ──► POST Multipart ──► Track ID
       │
6. Conciliación Asíncrona ───────► Worker QueryEstUp (EPR) + IMAP Acuses (Ley 19.983)
```

1. **Construcción del XML del Documento:**
   * Cabecera obligatoria: `<?xml version="1.0" encoding="ISO-8859-1"?>`.
   * Estructura `<Documento ID="DTE-33-FXX">` con `<Encabezado>` (`IdDoc`, `Emisor`, `Receptor`, `Totales`) y `<Detalle>` (líneas de ítems con cantidades, precios y descuentos).
   * Validación estricta contra `DTE_v10.xsd`.

2. **Generación del Timbre Electrónico (TED):**
   * Asignación del folio correlativo disponible mediante reserva transaccional.
   * Extracción de datos clave, generación del nodo `<DD>`, cálculo de hash SHA-1 y firmado con la llave RSA privada contenida en el CAF. Inserción del `<TED>` al final de `<Documento>`.

3. **Firma del DTE Individual:**
   * Firma del nodo `<Documento>` mediante XMLDSig Enveloped con el `.pfx` del representante legal.
   * Generación del nodo `<Signature>` hermano de `<Documento>` dentro de `<DTE version="1.0">`.

4. **Empaquetado en Doble Sobre EnvioDTE:**
   * El SII nunca recibe DTEs sueltos; exige envolverlos dentro de `<EnvioDTE>`.
   * **Sobre SII:** Carátula con `RutReceptor` = `60803000-K`.
   * **Sobre Cliente:** Carátula con `RutReceptor` = RUT del receptor para intercambio entre contribuyentes.
   * El nodo `<SetDTE>` completo se firma nuevamente con el certificado digital.

5. **Autenticación (Semilla & Token) y Upload al SII:**
   * Consumo del webservice SOAP `GetSeed` para obtener una semilla numérica.
   * Firma digital de la semilla con el `.pfx` y envío a `GetTokenFromSeed` para recibir el `TOKEN` de sesión (vigencia ~1 hora).
   * Envío del archivo XML mediante `POST multipart/form-data` con la cabecera `Cookie: TOKEN=...` al endpoint de subida del SII (`maullin.sii.cl` o `palena.sii.cl`).
   * El SII responde inmediatamente con un **Track ID** (número de atención de 10 dígitos).

6. **Consulta de Estado e Intercambio Comercial:**
   * Proceso asíncrono: el Track ID solo acredita la recepción física del archivo, no su validez.
   * Un worker en segundo plano consulta `QueryEstUp` periódicamente hasta obtener `EPR` (*Envío Procesado*), o gestionar reparos (`SOE`) o rechazos (`RCH`).
   * Simultáneamente, se despacha el segundo sobre a la casilla de correo de intercambio registrada por el receptor en el SII y se genera la representación impresa con el código **PDF417**.

---

## 4. Arquitectura de Software Recomendada (Microservicios / Colas)

```
                       ┌─────────────────────────┐
                       │   Frontend / ERP / POS  │
                       └────────────┬────────────┘
                                    │ HTTPS (JSON)
                                    ▼
                       ┌─────────────────────────┐
                       │    API Gateway (Core)   │
                       │ (Validaciones + Folios) │
                       └────────────┬────────────┘
                                    │ Encola Trabajo
                                    ▼
                       ┌─────────────────────────┐
                       │  Cola RabbitMQ / BullMQ │
                       │   (DLQ + Backoff Retry) │
                       └────────────┬────────────┘
                                    │ Procesa Trabajo
                                    ▼
┌───────────────────────┐      ┌─────────────────────────┐
│ Bóveda de Secretos    │◄────►│   Motor Criptográfico   │
│ (KMS / AES-256-GCM)   │      │ (ISO-8859-1 + XMLDSig)  │
│  - Certificados .PFX  │      └────────────┬────────────┘
│  - Archivos CAF       │                   │
└───────────────────────┘                   ▼
                       ┌─────────────────────────┐
                       │  Worker de Despacho SII │
                       └──────┬───────────┬──────┘
                              │           │
     SOAP GetSeed & POST UPL  │           │ SMTP / IMAP
                              ▼           ▼
                   ┌──────────────┐   ┌───────────────────────┐
                   │ SII (Maullín │   │ Casilla Intercambio   │
                   │  o Palena)   │   │ Contribuyente (8 días)│
                   └──────┬───────┘   └───────────────────────┘
                          │ Polling QueryEstUp
                          ▼
                   ┌──────────────┐
                   │ Worker de    │
                   │ Conciliación │──► S3 / R2 (XML Storage)
                   │ (EPR / SOE)  │
                   └──────────────┘
```

---

## 5. El Proceso de Certificación ("Ambiente Maullín")

El proceso de postulación ante el SII exige superar 4 etapas rigurosas en `maullin.sii.cl` (DTE) y `pangal.sii.cl` (Boletas REST):

1. **Set de Pruebas Básico:**
   * Generación de casos de prueba entregados por el SII (3 Facturas Afectas Tipo 33 con recargos y descuentos globales, 1 Nota de Crédito Tipo 61 que anula la Factura 1, y 1 Nota de Crédito Tipo 61 que corrige texto de la Factura 2).
   * Empaquetado en un solo `EnvioDTE` logrando **cero reparos (EPR estricto)**.
2. **Simulación de Operación Real:**
   * Emisión continua de **20 a 200 documentos** simulando el giro regular de la empresa, validando la estabilidad de la cola y la correlación de folios.
3. **Intercambio de Información Comercial:**
   * Recepción de un XML de un proveedor ficticio del SII y emisión obligatoria de los **3 XMLs de respuesta comercial**:
     * `EnvioRecibos`: Recibo de mercaderías o servicios prestados (**Ley 19.983**).
     * `ResultadoDTE`: Aceptación o rechazo técnico del XML recibido.
     * `RespuestaDTE`: Aceptación o reclamo comercial del contenido (plazo 8 días).
4. **Muestras Impresas:**
   * Generación y carga de las representaciones impresas en PDF (Formato Carta y Formato Térmico 80mm) con el código **PDF417** validado ópticamente y la leyenda reglamentaria obligatoria: **"CEDIBLE CON SU FACTURA"**.

### Dato Clave de Arquitectura: Automatización Multi-Tenant
Una vez certificado el motor con la primera empresa emisora, las etapas 1, 2 y 3 se ejecutan mediante un **script automatizado**, permitiendo certificar a futuros clientes (nuevos RUTs) en cuestión de **minutos**.

---

## 6. Matriz de Requerimientos PMV/DTE Implementados

| Req # | Componente / Requerimiento | Categoría | Norma SII | Ruta de Módulo |
| :---: | :--- | :--- | :--- | :--- |
| **#1** | Certificado Digital & Firma .pfx/.p12 | Criptografía Base | Res. Ex. SII N° 11 / 2003 | `/admin/boveda` |
| **#2** | Código de Autorización de Folios (CAF) | Criptografía Base | Manual Técnico DTE v1.0 | `/admin/boveda` |
| **#3** | Timbre TED (RSA-SHA1) & Barcode PDF417 | Criptografía Base | Res. Ex. SII N° 45 / 2003 | `/admin/emitir` |
| **#4** | Firma XMLDSig Enveloped & Canonicalización C14N | Criptografía Base | W3C XMLDSig Standard | `/admin/emitir` |
| **#5** | Construcción XML ISO-8859-1 & Schema XSD | Flujo Emisión DTE | Esquema DTE_v10.xsd | `/admin/emitir` |
| **#6** | Doble Sobre EnvioDTE (SII vs Intercambio) | Flujo Emisión DTE | Circular N° 21 / 2004 | `/admin/ciclo-de-vida` |
| **#7** | Autenticación Semilla & Token SII | Flujo Emisión DTE | Webservice Autenticación SII | `/admin/ciclo-de-vida` |
| **#8** | Upload Multipart & Obtención de Track ID | Flujo Emisión DTE | Servicio Subida DTE SII | `/admin/emitir` |
| **#9** | Worker Asíncrono de Conciliación (QueryEstUp) | Arquitectura Backend | Webservice QueryEstUp | `/admin` |
| **#10** | Intercambio Comercial (Ley 19.983 - 8 días) | Intercambio Comercial | Ley N° 19.983 / Circular 4 | `/admin/intercambio` |
| **#11** | Los 3 XMLs de Respuesta (EnvioRecibos, ResultadoDTE, RespuestaDTE) | Intercambio Comercial | Formato Intercambio SII | `/admin/intercambio` |
| **#12** | Renderizador PDF (Carta / Térmico) con Timbre y Cedible | Flujo Emisión DTE | Instrucciones Impresión SII | `/admin/emitir` |
| **#13** | Arquitectura Desacoplada con Colas y Exponential Backoff | Arquitectura Backend | Resiliencia Microservicios | `/admin/ciclo-de-vida` |
| **#14** | Suite de Certificación Ambiente Maullín & Script Multi-RUT | Certificación Maullín | Certificación Mercado SII | `/admin/certificacion` |

---

## 7. Ejecución del Prototipo Interactivo

```bash
cd facturas/Facturas-requerimiento
npm install
npm run dev
```

La aplicación se ejecutará localmente en `http://localhost:5173/`, permitiendo navegar e interactuar con todos los módulos, probar la emisión en vivo, inspeccionar los XMLs firmados en ISO-8859-1, visualizar los timbres PDF417 oficiales y recorrer el simulador interactivo de mensajería.
