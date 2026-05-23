---
name: chile-ecommerce-legal
description: >
  Skill experto en cumplimiento legal para e-commerce en Chile. USAR SIEMPRE que el usuario mencione: Chile, chileno, SII, Servicio de Impuestos Internos, boleta electrónica, factura electrónica, DTE, OpenFactura, Bsale, RUT, IVA, impuesto al valor agregado, retención, SERNAC, Ley del Consumidor, Ley 19.496, Ley 19.628, Ley 21.719, protección de datos, derecho de retracto, devolución, garantía legal, Compraqui, Chilexpress, Bluexpress, despacho Chile, envío Chile, cláusulas abusivas, términos y condiciones Chile, política de privacidad Chile, cookies LOPD, consentimiento de datos. También activar al lanzar e-commerce, vender productos digitales en Chile, configurar checkout, redactar políticas legales, o cualquier tema regulatorio chileno.
---

# Cumplimiento Legal E-commerce Chile

Skill para navegar las regulaciones chilenas que aplican a un e-commerce de cursos y productos físicos. **No reemplaza asesoría legal profesional**, pero te indica lo crítico para no meterte en problemas.

## Filosofía Central

**Cumplir desde el día uno.** Las multas del SII, SERNAC y de protección de datos son significativas. Implementar las obligaciones legales no es opcional, es parte del costo de operar.

**Documenta todo.** Términos, política de privacidad, consentimientos. En caso de disputa, el merchant que tiene documentación clara gana.

## Las 8 Obligaciones Absolutas

1. **Emitir boleta o factura electrónica** por toda venta (SII).

2. **Términos y Condiciones** visibles antes de cada compra (SERNAC).

3. **Política de Privacidad** que cumpla Ley 19.628 + 21.719.

4. **Consentimiento explícito opt-in** para marketing (no asumido).

5. **Derecho a retracto de 10 días** para productos físicos no consumidos (con excepción de contenido digital ya accedido).

6. **Banner de cookies** con opciones, analítica y marketing OFF por default.

7. **Garantía legal de 6 meses** para productos físicos (Ley del Consumidor).

8. **Mostrar precios finales con impuestos incluidos** (no agregar IVA después).

## Boleta Electrónica (SII)

### Obligación

Toda venta a consumidor final requiere **boleta electrónica**. Para ventas a empresas con RUT comercial, **factura electrónica**. Sin boleta = evasión de IVA = multa del SII.

### IVA en Chile

- Tasa: 19%
- Aplica a productos físicos: SÍ
- Aplica a servicios digitales (cursos online): SÍ (desde 2020 con la "Ley del IVA Digital")
- Precios mostrados al consumidor deben **incluir IVA** (no agregarlo al final)

### Cálculo del IVA

Si tu curso cuesta $50.000 al consumidor:
- Neto: $42.017 (precio antes de IVA)
- IVA (19%): $7.983
- Total: $50.000

Fórmula: neto = total / 1.19

### Proveedores de boleta electrónica

| Proveedor | Plan inicial | Notas |
|-----------|---------------|-------|
| **OpenFactura (Haulmer)** | ~$10.000/mes | API moderna, buena docs, recomendado |
| **Bsale** | ~$15.000/mes | Más features (inventario, etc.) |
| **Defontana** | Variable | Enterprise, complejo |
| **SII Gratuito** | $0 | Solo si emites < cierto volumen |

### Implementación con OpenFactura

```typescript
// lib/boleta.ts
export async function emitirBoleta(order: Order) {
  const items = await getOrderItems(order.id);
  const user = await getUser(order.user_id);

  const dte = {
    Encabezado: {
      IdDoc: {
        TipoDTE: 39, // 39 = Boleta electrónica
        Folio: 0, // OpenFactura asigna automático
        FchEmis: new Date().toISOString().slice(0, 10),
      },
      Emisor: {
        RUTEmisor: process.env.EMPRESA_RUT!,
        RznSoc: process.env.EMPRESA_RAZON_SOCIAL!,
        GiroEmis: 'COMERCIO ELECTRONICO',
        Acteco: 749000, // código de actividad económica
        DirOrigen: process.env.EMPRESA_DIRECCION!,
        CmnaOrigen: process.env.EMPRESA_COMUNA!,
        CiudadOrigen: process.env.EMPRESA_CIUDAD!,
      },
      Receptor: {
        RUTRecep: user.rut || '66666666-6', // genérico si no tiene
        RznSocRecep: user.full_name,
      },
      Totales: {
        MntNeto: Math.round(order.total_clp / 1.19),
        IVA: Math.round(order.total_clp - order.total_clp / 1.19),
        MntTotal: order.total_clp,
      },
    },
    Detalle: items.map((item, idx) => ({
      NroLinDet: idx + 1,
      NmbItem: item.title.slice(0, 80),
      QtyItem: item.quantity,
      PrcItem: item.unit_price_clp,
      MontoItem: item.unit_price_clp * item.quantity,
    })),
  };

  const response = await fetch('https://api.haulmer.com/v2/dte/document', {
    method: 'POST',
    headers: {
      'apikey': process.env.OPENFACTURA_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dte),
  });

  if (!response.ok) {
    throw new Error(`SII rejected: ${await response.text()}`);
  }

  const result = await response.json();

  // Guardar URL del PDF en la orden
  await supabaseAdmin
    .from('orders')
    .update({
      boleta_url: result.urlPdf,
      boleta_folio: result.folio,
    })
    .eq('id', order.id);

  return result;
}
```

### RUT del cliente

- Si compras productos físicos: pedir RUT en checkout (obligatorio para boleta nominativa)
- Si compra producto digital y no quiere dar RUT: usar RUT genérico `66666666-6` (boleta "sin nombre")
- Validar RUT con dígito verificador antes de aceptar

```typescript
export function validateRut(rut: string): boolean {
  const cleaned = rut.replace(/[^0-9kK]/g, '').toLowerCase();
  if (cleaned.length < 8) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDv = 11 - (sum % 11);
  const expected = expectedDv === 11 ? '0' : expectedDv === 10 ? 'k' : String(expectedDv);

  return expected === dv;
}
```

## SERNAC y Ley del Consumidor (Ley 19.496)

### Derecho de Retracto (Art. 3 bis)

El consumidor tiene **10 días corridos** para arrepentirse desde la entrega del producto. Esto significa devolverlo y recibir el dinero.

**Excepciones (no aplica retracto):**
- Productos personalizados / hechos a medida
- Productos perecibles
- Bienes que se hayan deteriorado o perdido valor por uso
- **Contenido digital ya descargado o accedido** (Art. 3 bis letra b)

### Implementación para cursos online

Esta excepción te protege con cursos: si la alumna ya accedió a la lección, no hay retracto. **PERO** muchos merchants buenos ofrecen "garantía de 7 días" voluntaria como gesto comercial — convierte mejor.

**Política sugerida en Términos:**

> Cursos online: Una vez que el alumno accede a las lecciones del curso, no aplica derecho a retracto según Art. 3 bis letra b) Ley 19.496. Sin perjuicio de lo anterior, ofrecemos garantía voluntaria de satisfacción: dentro de los primeros 7 días desde la compra, si has visto menos del 30% del curso, puedes solicitar la devolución total escribiéndonos a [email]. Esta garantía es un beneficio comercial adicional al derecho que la ley te otorga.

### Garantía Legal (6 meses para productos físicos)

Productos con defecto de origen: 6 meses desde la entrega. Consumidor puede pedir cambio, reparación o devolución.

### Cláusulas abusivas (prohibidas)

NO incluir en términos:
- "El cliente renuncia a todo derecho legal"
- "Cambios sin aviso previo"
- "Tribunal competente: otro país"
- "Sin garantía de ningún tipo"

SERNAC anula contratos con estas cláusulas y aplica multas.

### Información obligatoria en checkout

Antes de cobrar, mostrar al consumidor:
- Identidad del vendedor (RUT, razón social, dirección)
- Precio total con IVA incluido
- Costos de envío y plazos
- Procedimiento de pago
- Política de devolución
- Derecho a retracto
- Contacto del servicio al cliente

## Ley 19.628 + 21.719 (Protección de Datos)

### Cambios clave de la Ley 21.719 (vigente desde 2024-2026 gradual)

La Ley 21.719 moderniza la 19.628 y se asemeja al GDPR europeo. Aplica desde diciembre 2026 con multas significativas.

**Principios:**
- **Consentimiento informado y específico** (no genérico)
- **Finalidad determinada** (no recolectar "por si acaso")
- **Minimización** (solo datos necesarios)
- **Calidad** (datos exactos y actualizados)
- **Seguridad** (medidas técnicas y organizativas)
- **Responsabilidad demostrable** (poder probar cumplimiento)

### Derechos del usuario (ARCO + nuevos)

- **A**cceso: ver qué datos tienes de él
- **R**ectificación: corregirlos
- **C**ancelación / eliminación
- **O**posición a tratamientos específicos
- **P**ortabilidad (nuevo): exportar sus datos
- **No discriminación automatizada** (nuevo)

### Implementación práctica

**1. Política de privacidad** debe declarar:
- Quién es el responsable del tratamiento
- Qué datos se recolectan (email, nombre, rut, IP, cookies)
- Para qué se usan (proveer servicio, marketing, analítica)
- Con quién se comparten (Supabase, Mercado Pago, Resend)
- Cuánto tiempo se guardan
- Cómo el usuario ejerce sus derechos
- Datos de contacto del DPO o responsable

**2. Consentimiento explícito opt-in para marketing**

```typescript
// En registro o checkout
<Checkbox name="marketing_opt_in" required={false}>
  Quiero recibir tips de telar y novedades por email. (Puedes desuscribirte cuando quieras.)
</Checkbox>
```

Por default **NO marcado**. Asumir consentimiento sin opt-in explícito es ilegal.

**3. Endpoint de eliminación de cuenta**

```typescript
// app/api/account/delete/route.ts
export async function POST() {
  const user = await getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  // Anonimizar (no borrar duro si hay datos contables/fiscales)
  await supabaseAdmin
    .from('profiles')
    .update({
      full_name: '[ELIMINADO]',
      phone: null,
      avatar_url: null,
    })
    .eq('id', user.id);

  // Logout
  await supabaseAdmin.auth.admin.deleteUser(user.id);

  // Auditar
  await supabaseAdmin.from('audit_log').insert({
    user_id: user.id,
    action: 'account_deleted',
    metadata: { source: 'user_request' },
  });

  return Response.json({ ok: true });
}
```

**Nota:** datos relacionados con boletas y transacciones DEBES conservarlos 6 años por exigencia SII. Anonimizar el perfil pero mantener `orders` y `boletas` con un user_id genérico.

## Banner de Cookies

```typescript
// components/cookie-banner.tsx
'use client';
import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true, // siempre
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) setShow(true);
    else setPrefs(JSON.parse(saved));
  }, []);

  function save(newPrefs: typeof prefs) {
    localStorage.setItem('cookie_consent', JSON.stringify(newPrefs));
    setShow(false);

    // Activar GA / Meta Pixel SOLO si consintió
    if (newPrefs.analytics && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    if (newPrefs.marketing && typeof window.fbq === 'function') {
      window.fbq('consent', 'grant');
    }
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
      <p>Usamos cookies para mejorar tu experiencia. Puedes elegir qué aceptar.</p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => save({ necessary: true, analytics: true, marketing: true })}>
          Aceptar todo
        </button>
        <button onClick={() => save({ necessary: true, analytics: false, marketing: false })}>
          Solo necesarias
        </button>
        <a href="/cookies">Personalizar</a>
      </div>
    </div>
  );
}
```

**Importante:**
- GA4 y Meta Pixel NO deben cargarse hasta tener consentimiento (Consent Mode v2)
- Cookies necesarias (sesión, seguridad) NO requieren consentimiento

## Despacho y Logística (Productos Físicos)

### Proveedores principales

| Empresa | Cobertura | API | Tarifa aprox (1kg, Stgo a Stgo) |
|---------|-----------|-----|-----------------------------------|
| **Chilexpress** | Nacional, mejor cobertura | Sí (compleja) | $4.500 |
| **Bluexpress** | Nacional, más barato | Sí | $3.500 |
| **Starken** | Nacional, bueno regiones | Sí | $4.000 |
| **Correos de Chile** | Más económico | Limitada | $3.000 |
| **Shipit** | Aggregator de los anteriores | Sí, simple | Variable |

**Recomendación inicial:** integrar **Shipit** (https://shipit.cl/) — agrega varios couriers, una API, cálculo automático.

### Cálculo de envío en checkout

```typescript
async function calcShipping(items: CartItem[], destinationComuna: string) {
  const totalWeight = items.reduce((sum, i) => sum + i.weight_grams * i.quantity, 0);

  // Llamar a Shipit API
  const res = await fetch('https://api.shipit.cl/v/quotation', {
    headers: {
      'X-Shipit-Email': process.env.SHIPIT_EMAIL!,
      'X-Shipit-Token': process.env.SHIPIT_TOKEN!,
    },
    method: 'POST',
    body: JSON.stringify({
      length: 30, width: 20, height: 15, // cm
      weight: totalWeight / 1000, // kg
      destiny: destinationComuna,
    }),
  });

  return res.json();
}
```

### Plazos obligatorios

Si la web dice "entrega 24h", debes cumplirlo. SERNAC sanciona promesas incumplidas. Mejor decir "1-3 días hábiles" y cumplir antes que prometer 1 día y demorar 2.

## Términos y Condiciones — Plantilla Mínima

```markdown
# Términos y Condiciones

Última actualización: [fecha]

## 1. Identificación

[Razón Social], RUT [xx.xxx.xxx-x], con domicilio en [dirección], en adelante "la Empresa".

## 2. Objeto

Estos términos rigen las compras y uso del sitio [dominio.cl].

## 3. Precios

Todos los precios incluyen IVA. Los precios pueden cambiar sin aviso previo, pero las órdenes ya confirmadas mantienen el precio acordado.

## 4. Medios de Pago

Aceptamos tarjeta de crédito, débito y transferencia vía Mercado Pago. El cobro se procesa por Mercado Pago bajo sus términos.

## 5. Despacho

Para productos físicos:
- Plazo: 1-5 días hábiles según destino
- Cobertura: todo Chile vía Chilexpress / Bluexpress
- El cliente recibe número de seguimiento por email

## 6. Cursos Online

Los cursos son contenido digital. El acceso es de por vida (mientras la plataforma exista).

## 7. Derecho a Retracto

**Productos físicos**: 10 días corridos desde la entrega para devolver, según Art. 3 bis Ley 19.496. El producto debe estar sin uso y en empaque original.

**Cursos online**: Una vez que el alumno accede a las lecciones, no aplica derecho a retracto según Art. 3 bis letra b). Ofrecemos garantía voluntaria de 7 días si has visto menos del 30% del curso.

## 8. Garantía Legal

Productos físicos: 6 meses por defecto de origen, según Ley del Consumidor.

## 9. Propiedad Intelectual

El contenido de los cursos es propiedad de [Empresa]. Se prohíbe reproducir, distribuir o compartir sin autorización.

## 10. Protección de Datos

Tratamos tus datos según nuestra [Política de Privacidad].

## 11. Cláusula de resolución de conflictos

Las partes someten cualquier disputa a los tribunales ordinarios de Santiago, Chile.

## 12. Modificaciones

Estos términos pueden actualizarse. Cambios materiales se notifican por email.
```

## Política de Privacidad — Plantilla Mínima

```markdown
# Política de Privacidad

[Empresa] recolecta y procesa datos según Ley 19.628 y Ley 21.719.

## Datos que recolectamos

- Email, nombre, teléfono, RUT (para boleta)
- Datos de pago (procesados por Mercado Pago, no almacenados por nosotros)
- IP, user agent, cookies (con tu consentimiento)
- Progreso en los cursos

## Finalidades

- Cumplir con el contrato de compra
- Emitir boleta electrónica (obligación SII)
- Mejorar la plataforma
- Marketing (solo con tu consentimiento opt-in)

## Compartimos con

- Mercado Pago (procesamiento de pago)
- OpenFactura (emisión de boletas)
- Resend (envío de emails transaccionales)
- Mux (hosting de videos)
- Supabase (base de datos, hosting USA con SCC)
- Vercel (hosting, USA)

## Tus derechos

Puedes acceder, rectificar, eliminar o portar tus datos escribiendo a [email].

## Retención

- Datos de cuenta: hasta que solicites eliminación
- Datos contables (boletas, órdenes): 6 años por exigencia SII
- Cookies analíticas: 12 meses
```

## Checklist Pre-Lanzamiento Legal

- [ ] Boleta electrónica funcionando (probar emisión real)
- [ ] OpenFactura/Bsale conectado y validado por SII
- [ ] Inicio de actividades en SII formalizado
- [ ] RUT empresa visible en footer
- [ ] Términos y Condiciones publicados y accesibles
- [ ] Política de Privacidad publicada y accesible
- [ ] Política de Cookies publicada
- [ ] Política de Devolución publicada
- [ ] Banner de cookies funcionando con Consent Mode v2
- [ ] Checkbox opt-in marketing NO marcado por default
- [ ] Endpoint de eliminación de cuenta funcional
- [ ] Precios mostrados con IVA incluido
- [ ] Costo de envío mostrado antes del pago final
- [ ] Plazos de despacho realistas (no prometer 24h si no se cumple)
- [ ] Datos de contacto visibles (email, WhatsApp)
- [ ] No hay cláusulas abusivas en T&C
- [ ] Validador de RUT funcionando en checkout

## Si Vendes Internacionalmente (fuera de Chile)

- IVA chileno NO aplica a ventas a extranjeros
- Pero el comprador puede tener que pagar impuestos en su país
- Mejor declarar en T&C: "El comprador es responsable de impuestos aplicables en su jurisdicción"

## Reformas Vigentes / Próximas

- **Ley 21.719** (datos personales, similar GDPR): obligaciones plenas desde diciembre 2026
- **Ley 21.398** (Pro-consumidor): refuerza derechos, ya vigente
- **Ley 21.521** (Fintech): aplica a pasarelas de pago, ya vigente

Revisar anualmente cambios regulatorios. SERNAC suele anunciar campañas focalizadas (e-commerce, suscripciones, etc.).

## Anti-patrones

- ❌ No emitir boleta porque "es solo un curso digital"
- ❌ Cobrar IVA aparte después del precio mostrado
- ❌ "Sin devoluciones" como política general
- ❌ Cláusulas en inglés en T&C destinados a chilenos
- ❌ Marketing opt-in por default marcado (ilegal post-Ley 21.719)
- ❌ Borrar boletas pasados los 6 años obligatorios
- ❌ Cookies de analítica/marketing activas sin consentimiento
- ❌ Compartir datos con terceros sin declararlo en privacidad
- ❌ No tener domicilio físico declarado (requerido por SII)
