# 🇨🇱 DTE Chile - Sistema Propio de Facturación Electrónica & Certificación SII

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-black?style=flat&logo=vercel)](https://facturas-requerimiento.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-joytan12%2FFacturas--requerimiento-blue?style=flat&logo=github)](https://github.com/joytan12/Facturas-requerimiento)
![SII DTE](https://img.shields.io/badge/SII-DTE__v10.xsd-blue)
![Criptografía](https://img.shields.io/badge/XMLDSig-RSA--SHA1%20%7C%20C14N-emerald)
![Encoding](https://img.shields.io/badge/Encoding-ISO--8859--1-amber)

🔗 **Demo en Producción (Vercel):** [https://facturas-requerimiento.vercel.app](https://facturas-requerimiento.vercel.app)  
📦 **Repositorio GitHub:** [https://github.com/joytan12/Facturas-requerimiento](https://github.com/joytan12/Facturas-requerimiento)

Plataforma interactiva de especificación, arquitectura y prototipo operativo de un **motor propio de facturación electrónica (DTE) en Chile** ante el **Servicio de Impuestos Internos (SII)**.

El sistema modela y ejecuta criptografía XMLDSig, esquemas XML estrictos en codificación `ISO-8859-1`, timbrado bidimensional PDF417 (TED), comunicación asíncrona mediante SOAP/REST con el SII, el proceso completo de certificación en **Ambiente Maullín** y los acuses de intercambio comercial de la **Ley 19.983**.

---

## 🔐 1. Los 4 Componentes Criptográficos Base

Antes de escribir la lógica de negocio, el motor gestiona e interactúa con cuatro componentes de seguridad fundamentales:

1. **Certificado Digital (Firma Electrónica Simple / Avanzada)**:
   * Archivo `.pfx` o `.p12` del representante legal de la empresa emisora.
   * Su clave privada se utiliza para firmar la semilla de autenticación (`GetSeed`), los DTEs individuales y el sobre de envío (`EnvioDTE`).
2. **CAF (Código de Autorización de Folios)**:
   * Archivo XML timbrado por el SII al solicitar timbraje (ej. folios 1 al 100 para Factura Electrónica Tipo 33).
   * Contiene el rango autorizado y una **llave privada RSA** exclusiva entregada por el SII para firmar dicho rango.
3. **TED (Timbre Electrónico del DTE)**:
   * Nodo XML resumen (`<TED><DD>...`) con RUT emisor, tipo DTE, folio, fecha, RUT receptor, monto total, primer ítem y datos del CAF.
   * Se firma con la **llave privada RSA del CAF**. Este nodo firmado se convierte en el código de barras bidimensional **PDF417** impreso en el PDF.
4. **Firma XMLDSig (Enveloped Signature)**:
   * Estándar W3C para firmar nodos XML usando `RSA-SHA1` (exigido por el estándar del SII).
   * Requiere **Canonicalización C14N estricta**: un solo cambio de espacio o salto de línea (\r\n vs \n) invalida el documento (*Error de Schema o Firma Inválida*).

---

## ⚡ 2. Flujo Técnico de Emisión de un DTE

Para emitir una factura válida, el backend ejecuta la siguiente secuencia exacta de pasos:

```
[ ERP / JSON ] 
      │ (SELECT ... FOR UPDATE)
      ▼
1. Construcción XML (ISO-8859-1) ──► Valida contra DTE_v10.xsd
      │
2. Generación TED ───────────────► Digest SHA-1 + Firma RSA del CAF ──► PDF417
      │
3. Firma XMLDSig ────────────────► Firma Enveloped con .PFX del Representante
      │
4. Doble Sobre EnvioDTE ─────────► Sobre SII (60803000-K) + Sobre Intercambio Cliente
      │
5. Autenticación & Upload ───────► GetSeed ──► GetToken ──► POST Multipart ──► Track ID
      │
6. Conciliación Asíncrona ───────► Worker QueryEstUp (EPR) + Casilla Intercambio (8 días)
```

1. **Construcción del XML del Documento**: Codificación estricta `ISO-8859-1`. Estructura `<Documento>` con `<Encabezado>` (`IdDoc`, `Emisor`, `Receptor`, `Totales`) y `<Detalle>` (líneas de ítems). Validación contra `DTE_v10.xsd`.
2. **Generación del Timbre Electrónico (TED)**: Asigna un folio disponible dentro del CAF vigente. Extrae datos clave, calcula el hash SHA-1 de `<DD>` y lo firma con la clave privada RSA del CAF. Inserta el `<TED>` al final de `<Documento>`.
3. **Firma del DTE Individual**: Firma el nodo `<Documento>` completo con el Certificado Digital (`.pfx`) mediante W3C XMLDSig, generando el bloque `<Signature>` hermano de `<Documento>`.
4. **Empaquetado en Sobre Electrónico (EnvioDTE)**: Doble envío:
   * **Sobre 1 (SII)**: Carátula con `RutReceptor` = `60803000-K`.
   * **Sobre 2 (Intercambio)**: Carátula con `RutReceptor` = RUT del cliente final. El nodo `<SetDTE>` se firma con el certificado digital.
5. **Autenticación (Semilla y Token) y Upload al SII**: Solicita semilla (`GetSeed`), la firma con el `.pfx`, obtiene el `TOKEN` de sesión (vigencia 1 hora) y realiza un `POST multipart/form-data` con cabecera `Cookie: TOKEN=...`. El SII responde inmediatamente con un **Track ID** (10 dígitos).
6. **Consulta de Estado e Intercambio Comercial**: Proceso asíncrono. Un worker en background consulta periódicamente el Track ID (`QueryEstUp`) hasta obtener `EPR` (*Envío Procesado*). Simultáneamente, despacha el segundo sobre a la casilla de correo del cliente receptor y genera el PDF con el código PDF417.

---

## 🏗️ 3. Arquitectura de Software Recomendada (Microservicios / Colas)

Dado que el SII procesa los documentos de manera asíncrona y sus servidores presentan latencia o caídas frecuentes, la emisión nunca se acopla al ciclo síncrono HTTP del usuario final.

| Capa / Servicio | Responsabilidad Técnica | Tecnologías Sugeridas |
| :--- | :--- | :--- |
| **API Gateway / Core** | Recibe JSON limpio del ERP, valida reglas (IVA 19%, cuadraturas) y asigna folio con bloqueo transaccional (`SELECT ... FOR UPDATE`). | Node.js (NestJS / Fastify), Go o Python (FastAPI) + PostgreSQL |
| **Cola de Mensajería** | Desacopla la creación del documento de su envío al SII. Gestiona reintentos con exponential backoff. | RabbitMQ, Redis (BullMQ) o AWS SQS |
| **Motor Criptográfico & XML** | Construye el XML en ISO-8859-1, genera el TED, aplica firma XMLDSig (C14N) y valida contra esquemas XSD. | PHP (LibreDTE), Node.js (xml-crypto, libxmljs), Python (lxml, signxml) o Go |
| **Bóveda de Secretos (Vault)** | Almacena cifrados (AES-256-GCM o KMS) los archivos .pfx, contraseñas y CAFs de cada empresa (multi-tenant). | AWS KMS / Secrets Manager, HashiCorp Vault o cifrado a nivel de app |
| **Worker de Conciliación SII** | Consulta periódicamente Track IDs pendientes (QueryEstUp), procesa acuses de recibo (8 días Ley 19.983) y lee casilla IMAP. | Cron jobs / Workers dedicados + Almacenamiento en S3 / Cloudflare R2 |
| **Renderizador PDF** | Genera la representación impresa (Formato Carta u 80mm térmico) con timbre PDF417 y leyenda obligatoria *"CEDIBLE CON SU FACTURA"*. | Playwright / Puppeteer o PDFKit + librería `bwip-js` para PDF417 |

---

## 🏆 4. El Proceso de Certificación ("Ambiente Maullín")

El SII cuenta con dos ambientes completamente separados:
* **Certificación (Pruebas)**: `maullin.sii.cl` (DTE) y `pangal.sii.cl` (Boletas REST).
* **Producción**: `palena.sii.cl` (DTE) y `rahue.sii.cl` (Boletas REST).

Para postular al sistema de mercado y emitir en Producción, el software debe superar las 4 etapas:
1. **Set de Pruebas Básico**: Casos entregados por el SII (ej. 3 facturas afectas, 1 nota de crédito que anula la factura 1, 1 nota de crédito que corrige el giro de la factura 2, descuentos globales y recargos). Empaquetados en un solo `EnvioDTE` con **cero reparos**.
2. **Simulación**: Emisión continua de 20 a 200 documentos simulando la operación regular del giro.
3. **Intercambio de Información**: Recepción de un XML de proveedor ficticio y generación automática de los 3 XMLs de respuesta comercial:
   * `EnvioRecibos`: Acuse de mercaderías o servicios prestados (**Ley 19.983**).
   * `ResultadoDTE`: Aceptación o rechazo técnico del XML recibido.
   * `RespuestaDTE`: Aceptación o reclamo comercial del contenido (plazo de 8 días).
4. **Muestras Impresas**: Subida de PDFs para validar que el código PDF417 sea legible y cumpla con las medidas reglamentarias mínimas (55mm x 20mm).

> **💡 Dato Clave de Arquitectura:** Una vez que certificas tu motor con la primera empresa emisora, puedes automatizar las etapas 1, 2 y 3 mediante un script para certificar a tus futuros clientes (nuevos RUTs) en cuestión de minutos.

---

## 📱 Módulos & Rutas Implementadas en el Frontend

1. **Portal de Acceso & Roles** (`/`): Selección de entorno (*Maullín* vs *Palena*) y roles (*Administrador Emisor*, *Auditor Certificación*, *Receptor Comercial*).
2. **Matriz de Requerimientos Normativos** (`/requirements`): Matriz interactiva de los 14 requerimientos obligatorios con filtros por categoría y acceso directo a probar cada módulo en vivo.
3. **Dashboard Operativo & Monitor SII** (`/admin`): KPIs de emisión, monitoreo de latencia de web services SII en tiempo real, tabla operativa de DTEs y reconsulta de Track IDs.
4. **Emisión & Motor Criptográfico** (`/admin/emitir`): Formulario completo con cálculo de IVA 19%, desglose de ítems, simulador en 6 pasos criptográficos y vistas previas de XML y PDF417.
5. **Simulador Ciclo de Vida y Mensajería** (`/admin/ciclo-de-vida`): Diagrama interactivo paso a paso con reproducción automática e inspección de payloads (JSON, XML ISO-8859-1, SOAP, Multipart).
6. **Ambiente Maullín (Certificación)** (`/admin/certificacion`): Consola de ejecución de las 4 etapas del SII y script de certificación rápida multi-tenant.
7. **Bóveda Criptográfica** (`/admin/boveda`): Gestión y desencapsulado de certificados `.pfx` y archivos CAF con inspección de llave privada RSA.
8. **Intercambio Comercial (Ley 19.983)** (`/admin/intercambio`): Bandeja de entrada de facturas recibidas de proveedores y generación de los 3 acuses de recibo en 8 días.
9. **Consulta Pública de Track ID** (`/consulta`): Búsqueda por número de atención de 10 dígitos o folio con bitácora cronológica de auditoría.

---

## 🚀 Instalación y Ejecución Local

```bash
# Navegar al directorio del proyecto
cd facturas/Facturas-requerimiento

# Instalar dependencias
npm install
# o con pnpm:
pnpm install

# Iniciar servidor de desarrollo en Vite
npm run dev

# Compilar para producción (TypeScript + Vite)
npm run build
```
