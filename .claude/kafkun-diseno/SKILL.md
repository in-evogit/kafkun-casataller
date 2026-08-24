---
name: kafkun-diseno
description: >
  Sistema visual y reglas de contenido de Casa Taller Kafkún. USAR SIEMPRE al tocar
  cualquier cosa que se vea o se lea en este sitio: componentes, páginas, secciones,
  copy, colores, tipografía, espaciado, botones, formularios, estados vacíos,
  fotos e imágenes, proporciones, placeholders, animaciones, hover, scroll,
  movimiento, responsive, móvil, accesibilidad, textos de la portada, títulos,
  CTA, precios, testimonios, FAQ, galerías, carruseles, obras, chalecos, bufandas,
  encargos, o el diseño en general. También al crear una página nueva, al traducir
  una maqueta a componentes, o cuando alguien pida que la web quede "más choro",
  más bonita o mejor diseñada.
---

# Casa Taller Kafkún — sistema visual y reglas de contenido

Katy teje en telar mapuche. El sitio vende **marca personal**: quien llega tiene que
entender quién es ella y terminar agendando una videollamada para encargar un tejido.

Este skill existe porque el sistema ya está construido y decidido. **No lo
reinventes en cada sesión.** Si algo acá no calza con el código, gana el código —
y entonces actualiza este archivo.

---

## Lo que NUNCA va en este sitio

Estas no son preferencias, son decisiones tomadas. Romperlas es un error, no una
opinión de diseño.

| Prohibido | Por qué |
|---|---|
| **Precios de cualquier tipo** | Cada tejido es a medida. El precio sale de la videollamada, nunca antes |
| **Carrito, checkout, "agregar", "comprar"** | No hay venta online. El único destino es *Hacer mi pedido* |
| **Testimonios** | Los que había eran inventados y se borraron el 3-ago-2026. Sólo vuelven con nombre real y autorización |
| **FAQ** | Las respuestas anteriores afirmaban garantías y políticas que Katy nunca confirmó |
| **"Acceso de por vida", "garantía", "últimos cupos", plazos de entrega** | Nadie los confirmó |
| **Carruseles automáticos** | Mala conversión y pelean con el scroll del dedo en móvil |
| **Datos inventados** | Cifras, nombres de obras, materiales, técnicas. Si no lo dijo Katy, va entre `[CORCHETES]` o no va |

Las cifras que **sí** están confirmadas por Katy: `+50 alumnas presenciales`,
`enseñando desde 2015`, `técnica mapuche`. Ninguna otra.

---

## Paleta

Los valores viven en `app/globals.css` como tokens de Tailwind 4. **Usa la clase,
no el hex.**

| Rol | Clase | Valor | Uso |
|---|---|---|---|
| Papel | `bg-background` | `#FBF9F5` | Fondo base. **Nunca blanco puro** — leía a clínica |
| Tinta | `text-foreground` | `#261C15` | Texto. Negro cálido, no `#000` |
| Lienzo | `bg-secondary` | `#F4EFE7` | Bloques alternos, hero |
| Greige | `bg-muted` | `#E9E3D9` | Ranuras de foto pendiente |
| Carmesí | `bg-primary` | `#9B2335` | El acento. Botón sólido, acentos itálicos |
| Carmesí oscuro | `hover:bg-accent` | `#7C1D2B` | Sólo hover del primario |
| Apagado | `text-muted-foreground` | `#7A7167` | Texto secundario |
| Hairline | `border-border` | `#DED8CF` | Separadores decorativos |
| Borde real | `border-border-strong` | `#8E8479` | Inputs y chips: lo que se toca |

Esa última distinción importa: **`border` es para separar, `border-strong` es para
lo que la persona puede tocar.** No los mezcles.

---

## Tipografía

Dos fuentes, cargadas en `app/layout.tsx`.

- **Fraunces** → `font-heading`. Titulares, números grandes, citas. Peso **300**
  (`font-light`) en los tamaños grandes: a 48px o más, un peso normal se ve tosco.
- **Manrope** → por defecto. Todo el texto corrido.

Escala que ya está en uso:

```
Titular de portada    text-[2.875rem] md:text-[4.25rem] xl:text-[5rem]
                      font-light leading-[0.95] tracking-[-0.025em]
Titular de sección    text-[2.125rem] md:text-[3.25rem]
                      font-light leading-[1.05] tracking-[-0.018em]
Subtítulo             text-[1.3125rem] font-heading
Cuerpo                text-lg leading-relaxed  (bajadas)
                      text-[0.9375rem] leading-relaxed  (texto denso)
Etiqueta de sección    text-[0.6875rem] font-medium uppercase tracking-[0.16em]
```

La etiqueta en mayúsculas con `tracking-[0.16em]` abre casi todas las secciones.
Es la firma del ritmo: no la cambies por un `<h3>` normal.

Titulares largos llevan `text-balance`; párrafos, `text-wrap: pretty`.
Ancho de lectura: `max-w-[52ch]` para bajadas, `max-w-[46ch]` para citas.

---

## Formas y movimiento

- **Esquinas de 2px.** `rounded-[2px]`. Nada de `rounded-xl`.
- **Sin sombras. Sin degradados. Sin iconos decorativos.** El borde de 1px y el
  cambio de fondo hacen todo el trabajo.
- **Nada dura más de 450ms**, salvo lo atado al scroll. Los tiempos están en
  tokens: `--dur-toque` 120ms, `--dur-color` 200ms, `--dur-hilo` 280ms,
  `--dur-foto` 420ms, `--dur-panel` 320ms.

### El gesto firma: el hilo

La clase `.hilo` dibuja un subrayado que crece desde el centro hacia los extremos,
como el hilo de urdimbre al tensarse. **Va sólo donde alguien decide algo:** links,
botones y el paso activo del proceso. Dentro de un botón sólido van las dos clases
juntas, `className="hilo hilo-boton"`, que lo mete adentro en vez de bajo el borde.

No lo pongas en texto decorativo. Pierde el significado.

### La urdimbre

`.textura-telar` son hilos verticales de tres pasos distintos superpuestos, sin
ninguna línea horizontal. Es tejido, no cuadrícula. Va sobre bloques oscuros
(`bg-foreground`) y en las ranuras de foto pendiente.

### Movimiento al bajar

Con `animation-timeline: view()` de CSS. **Cero JavaScript, cero framer-motion.**

```css
.sube { opacity: 1; }                    /* base visible SIEMPRE */
@supports (animation-timeline: view()) {
  .sube {
    animation: aparecer 1ms cubic-bezier(0.34, 1.12, 0.64, 1) forwards;
    animation-timeline: view();
    animation-range: entry 4% cover 26%;
  }
}
```

**Usa `forwards`, nunca `both`.** Con `both`, un bloque cuyo rango de scroll no
resuelve queda en opacidad 0 — contenido invisible. Con `forwards` el peor caso es
que no se note la animación.

`globals.css` ya tiene el bloque de `prefers-reduced-motion`. Cualquier animación
nueva tiene que quedar cubierta ahí.

---

## Fotos

Ninguna foto definitiva existe todavía. `public/images/` está vacío desde el
20-ago-2026: las que había eran de relleno y estaban mal categorizadas.

**La regla de proporción está en `lib/media.ts` y los componentes ya la respetan:**

| Proporción | Para qué |
|---|---|
| **Vertical 3:4** | Obras, prendas, detalle de proceso. Es como se fotografía algo colgado |
| **Vertical alta 9:16** | Retrato de cuerpo entero, video de saludo |
| **Horizontal 3:2** | Retratos de ambiente, portadas de curso |
| **Panorámica 16:9** | Hero de la portada |

Ningún componente escribe una ruta de imagen adentro: recibe un `Media` y lo
dibuja. Cuando lleguen las fotos se cambia **el dato**, no el componente.

Para una ranura sin foto se usa `pendiente(proporcion, nota)`, que dibuja el
recuadro con urdimbre y el texto **"Foto en camino"** abajo a la izquierda. Nunca
uses `placehold.co` ni un servicio externo: responde 400 y deja imágenes rotas.

---

## Las familias del encargo

**Dos, y sólo dos: Chalecos y Bufandas.** Viven en `lib/data/obras.ts`.

No existen "fajas" — fue una categoría mal puesta. **Correas salió del sitio** el
21-ago-2026 por decisión de Gabo; las fotos se guardan pero no se publican.

Cada obra lleva a `/contacto?ref=<slug>`, así Katy llega a la reunión sabiendo qué
le gustó a esa persona. Sin precio, sin carrito: el texto del link es
**"Quiero uno así"**.

Cuando `obrasPublicables` está vacío, `ObrasGallery` se esconde sola. Es
deliberado: mejor sin sección que con siete recuadros grises.

---

## La voz

Katy habla en primera persona, en chileno, sin adornos. El copy real está en los
componentes — léelo antes de escribir nada nuevo.

- **Directo antes que poético.** *"Cómo hacer tu pedido"* le ganó a *"De una
  conversación a una pieza"* porque lo segundo no se entiende de una.
- **La palabra "pieza" no se usa.** Di el tejido, la prenda, el encargo, o el
  nombre de la cosa: un chaleco, una bufanda.
- **La reunión es por videollamada.** No se toca la lana, no hay que ir al taller.
  Lunes a viernes después de las 18:00.
- **Responde la duda antes de que la pregunten.** La sección del proceso existe
  porque *"¿cuánto sale?"* es lo que Katy contesta una y otra vez por WhatsApp. La
  respuesta honesta —"depende, y por eso conversamos"— va escrita.
- **Nada de urgencia falsa.** Ni cupos, ni ofertas por tiempo limitado.

---

## Antes de dar algo por terminado

- [ ] ¿Aparece algún precio, carrito o botón de comprar? → sácalo
- [ ] ¿Inventaste un dato que Katy no confirmó? → `[CORCHETES]` o fuera
- [ ] ¿Usaste el hex en vez de la clase del token?
- [ ] ¿Las esquinas son de 2px y no hay sombras?
- [ ] ¿La etiqueta de sección va en mayúsculas con `tracking-[0.16em]`?
- [ ] ¿Cada ranura de foto declara su proporción?
- [ ] ¿Miraste la página a 390px de ancho? El tráfico llega de Instagram, en móvil
- [ ] ¿El texto va primero que la foto en móvil?
- [ ] ¿Los botones tienen 44px de alto mínimo en táctil?
- [ ] ¿La animación nueva queda cubierta por `prefers-reduced-motion`?
- [ ] ¿Corriste `npx tsc --noEmit`, `npm run lint` y `npm run build`?

---

## De dónde salió todo esto

- `app/globals.css` — la paleta, los tiempos, `.hilo`, `.textura-telar`
- `lib/media.ts` — proporciones y el estado "Foto en camino"
- `lib/data/obras.ts` — las familias del encargo
- `LOGISTICA_LANZAMIENTO.md` — las decisiones de producto y los pendientes
- El canvas de diseño de la interfaz, en los artifacts de Gabo

Cuando cambie una decisión, actualiza **este archivo** además del código. Un skill
que miente es peor que no tener skill: le da confianza falsa a quien lo lea.
