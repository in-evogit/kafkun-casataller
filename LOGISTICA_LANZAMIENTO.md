# Logística del lanzamiento · Casa Taller Kafkún

Documento de trabajo Gabo ↔ Luca ↔ Katy.
Estado del código: rama `main`, commit `99eeaee` (5-ago-2026).

**Premisa del lanzamiento:** la página sale a la calle **antes** de que exista el
primer curso. Entonces hoy tiene un solo trabajo: convertir la marca personal de
Katy en (a) encargos agendados y (b) lista de espera del curso. Todo lo que no
sirva a esos dos objetivos es peso muerto para la v1.

### Decisiones tomadas (20-ago-2026)

1. **No se vende nada online.** No hay pasarela de pago en la v1. El único
   camino comercial es el encargo, y el encargo se cierra en una reunión.
   → Se caen tienda, carrito y checkout.
2. **Los cursos quedan en "próximamente".** No se configuran, no se venden, no
   se listan con precio. Solo se anuncia que vienen y se capta la lista de
   espera.
3. Todo lo demás de este documento se ordena bajo esas dos decisiones.

---

## 1. Bloqueadores duros (sin esto no se lanza)

| # | Problema | Dónde | Estado |
|---|---|---|---|
| 1 | ~~**`/contacto` no existe**~~ | 7 links apuntaban ahí | El CTA del encargo, las obras, el navbar, el footer y el cierre caían en 404. → **Resuelto el 22-ago-2026** (`51ac26c`): la página existe, con formulario y hora por Cal.com. |
| 2 | **Se pueden comprar 3 cursos que no existen** | `lib/data/seed.ts:1-44` | Precio (45.000 / 72.000 / 68.000) y flujo de compra activos; las 46 lecciones tienen `mux_playback_id: null`, o sea cero video. → **Resuelto por decisión 2:** los cursos pasan a "próximamente" sin compra. |
| 3 | **La tienda contradice a las obras** | `/tienda` vs. portada | La misma foto aparece como *"obra entregada, no está en venta"* en la portada y como *producto con precio y carrito* en `/tienda`. → **Resuelto por decisión 1:** la tienda se cae. |
| 4 | **La portada no tiene foto arriba** | `page.tsx:52` | El hero y "quién teje" caen en el placeholder "Foto en camino". Depende de que Katy entregue las 2 fotos horizontales. |

---

## 2. Cómo va a ser la interfaz

### 2.1 Navegación

De 6 links a 4. Cada uno tiene que ganarse el lugar:

```
KAFKÚN     Obras · Quién es Katy · Clases · Hacer mi pedido
```

- **Obras** → ancla al muestrario de la portada.
- **Quién es Katy** → `/sobre-mi`.
- **Clases** → `/cursos`, en modo "próximamente".
- **Hacer mi pedido** → `/contacto`. Es el botón sólido, el único destacado.

Se caen del menú: *Tienda* (no existe más), *Diario* (el blog no aporta al
lanzamiento; las 2 entradas quedan publicadas pero fuera del menú), *Login* y
*Registro* (no hay nada que loguear hasta que exista el curso).

### 2.2 La portada, sección por sección

```
1. HERO             foto horizontal de Katy + promesa + 2 botones
2. QUIÉN TEJE       retrato + quién es ella y qué hace         ← sube
3. OBRAS A PEDIDO   muestrario por familia (chalecos primero)
4. EL PROCESO       los 5 pasos del encargo (ya está escrito)
5. AGENDAR          bloque de reunión — el CTA del negocio de hoy
6. EL CURSO         "en preparación" + lista de espera
7. CIERRE           footer
```

**1 · Hero.** Foto horizontal de Katy en el witral, texto encima. Un titular con
la promesa real ("no tejo un chaleco típico, tejo el que tú quieres"), una bajada
de dos líneas, y dos botones: *Hacer mi pedido* (sólido) y *Ver las obras*
(secundario, ancla a la sección 3). El componente ya está armado texto-primero,
solo le falta la foto.

**2 · Quién teje.** Retrato horizontal + el texto de Katy: quién es, desde cuándo
teje, qué la hace distinta. Esto sube de posición: si el sitio vende marca
personal, la persona no puede aparecer en el sexto scroll. Cuando exista el video
de saludo, va acá, con el retrato de póster y play manual.

**3 · Obras a pedido.** Muestrario en grilla, **una fila por familia**: Chalecos,
y Bufandas — **Correas salió**. Chalecos primero porque es lo que más se encarga
hoy. Cada obra: foto vertical 3:4, nombre, y al pasar el cursor aparece la
segunda toma. Sin precio y sin carrito: cada una lleva a *"Quiero uno así"*, que
abre `/contacto` con la obra ya anotada en la URL (`?ref=chaleco-verde`), así
Katy llega a la reunión sabiendo qué le gustó a esa persona.

**4 · El proceso.** Los 5 pasos: nos juntamos **por videollamada** y vemos
medidas → me muestras referencias si tienes → definimos lana y materiales →
recién ahí hay precio y plazo → lo tejo y te lo entrego. Esta sección es la que responde la pregunta que hoy Katy contesta
una y otra vez por WhatsApp: *"¿cuánto sale?"*. La respuesta honesta —"depende, y
por eso conversamos"— tiene que estar escrita antes de que la persona la
pregunte.

**5 · Agendar.** El bloque comercial. Explica las condiciones reales (reuniones
de lunes a viernes después de las 18:00) y lleva al calendario.

**6 · El curso.** Una sola tarjeta: nombre, promesa, temario visible, y en vez de
precio y botón de compra, un **"avísame cuando abra"** con el correo. Mostrar el
temario sin vender es a propósito: demuestra que el curso es real y en
preparación, no una promesa vaga.

**7 · Cierre.** Footer con Instagram, correo y el link a encargar.

Se caen de la v1: **testimonios** (vacío a propósito, los anteriores eran
inventados y se borraron), **FAQ** (vacío a propósito, las respuestas anteriores
afirmaban políticas que Katy nunca confirmó) y la **newsletter genérica**, que se
reemplaza por la lista de espera del curso.

### 2.3 Las páginas

| Ruta | Qué es | Estado |
|---|---|---|
| `/` | La portada de arriba | existe, hay que reordenar |
| `/sobre-mi` | La historia larga de Katy | existe, tiene sus 2 fotos |
| `/contacto` | Formulario del pedido + hora por Cal.com | ✅ creada (`51ac26c`) |
| `/cursos` | El curso inicial en "próximamente" + lista de espera | existe, hay que sacarle la compra |
| `/diario` | Las 2 entradas del blog | queda publicada, fuera del menú |
| `/tienda` `/carrito` `/checkout` | Venta online | **se caen** |
| `/login` `/registro` `/mi-cuenta` `/mis-cursos` `/aprende` | Área de alumnas | **quedan dormidas** hasta que exista el curso |

Lo del área de alumnas: no se borra, se deja tal cual y sin links que lleven
ahí. Cuando el curso exista se despierta. Borrarla sería tirar trabajo hecho.

### 2.4 Lo que NO se toca ahora

El progreso con checklist del curso (marcar lección vista, barra de avance en el
perfil) **no existe** y no se construye todavía: no hay curso que seguir. Queda
anotado como el primer trabajo del día después del lanzamiento. Son 3 partes:
tabla `lesson_progress`, botón de "marcar vista" en el reproductor, y la barra en
`mis-cursos`.

### Hero: **foto, no video**

Recomendación clara: **foto horizontal de Katy en el witral**. Razones:

- Un video de portada pesa, empeora el tiempo de carga en móvil (que es por
  donde va a llegar el 80% del tráfico de Instagram) y se reproduce sin sonido,
  o sea comunica menos que una buena foto.
- No tenemos el video todavía. Un video malo en la portada destruye más
  confianza de la que construye una foto buena.
- El hero ya está construido **texto primero** (`components/sections/hero.tsx`),
  la foto acompaña. Con foto funciona; con video habría que rehacerlo.

**El video sí va, pero abajo:** un saludo de Katy de 30-60 s dentro de "quién
teje", con el retrato como póster y play manual. El código ya lo tiene previsto
(`about-mini.tsx:15` dice literalmente "sirve también de póster del video de
saludo") y `components/video-player.tsx` ya existe.

### Fotos de obras: **grilla por familia, no carrusel automático**

Sobre el carrusel que se desliza solo: **no lo recomiendo como galería principal.**

- Los carruseles automáticos tienen mala conversión: la gente no espera a que
  pase la foto que le interesaba, y en móvil pelean contra el scroll del dedo.
- Se pierde el escaneo: con grilla el ojo compara 6 obras de una; con carrusel
  ve una a la vez.

**Lo que sí recomiendo, ahora que van a haber hartas fotos de chalecos:**

- **Grilla por familia.** Cada familia (Chalecos, Bufandas) es su propia fila. Escala bien: llegan 20 fotos de chalecos y la
  sección no se rompe, se hace más rica. La estructura ya existe en
  `lib/data/obras.ts` (`familiasEncargo`), solo hay que llenarla.
- **Si quieren movimiento:** una tira horizontal de desplazamiento continuo
  (tipo muestrario que corre lento), que se detiene al pasar el cursor y que
  respeta `prefers-reduced-motion`. Eso sí funciona, porque no oculta nada: la
  foto siempre vuelve.
- **Carrusel manual sí, pero adentro de una obra:** cuando se abre un chaleco
  específico y hay 4 tomas del mismo, ahí el carrusel deslizable con el dedo es
  lo correcto.

> **Corregido el 20-ago-2026.** Antes existía una familia inventada, "Fajas",
> y todo estaba repartido dentro de "Piezas enteras". Las familias reales son
> **dos: chalecos y bufandas** — correas se sacó el 21-ago-2026 por decisión de
> Gabo. Ya quedaron así en `lib/data/obras.ts`, esperando las fotos buenas.

---

## 3. Encargos: cómo se agenda la reunión

Reglas del negocio (definidas por Katy):

- **Disponibilidad:** lunes a viernes, **después de las 18:00**.
- **No hay pasarela de pago.** El precio se define en la reunión porque el
  tejido es 100% personalizado.
- **Producto principal hoy:** chalecos a medida.
- Después de la reunión: 50% de abono para entrar al telar, 50% a la entrega
  (ya está escrito en `how-it-works.tsx`, paso 04 y 05).

**Recomendación de implementación — no construir un motor de agenda.**

**Decidido el 22-ago-2026: Cal.com.** Va embebido en `/contacto` como iframe, no
con `@calcom/embed-react`: así no entra una dependencia más ni un script de
terceros, y en la CSP basta con abrir `frame-src` en vez de `script-src`.

El flujo va en dos tiempos a propósito: **primero los datos, después la hora.**
Así el pedido le llega a Katy aunque la persona abandone antes de agendar, y el
calendario aparece precargado con lo que acaba de escribir.

Mientras `NEXT_PUBLIC_CAL_LINK` no exista, `/contacto` muestra el correo de
Kafkún (`kafkuntelares@gmail.com`) en vez del calendario y funciona igual. Por
eso se puede desplegar antes de que Katy cree la cuenta.

**Las fotos de referencia no se suben:** se ven en la videollamada. Evita montar
Supabase Storage y su superficie de ataque para la v1.

Antes del calendario, un formulario corto de calificación (4 campos, no más):

1. Nombre + WhatsApp
2. ¿Qué te gustaría que te teja? (chaleco / bufanda / otro tejido)
3. ¿Para cuándo la necesitas?
4. Referencias (subir fotos, opcional)

Ese formulario es el que hace que la reunión de las 18:30 valga la pena: Katy
llega sabiendo qué le van a pedir. El link de la obra ya viaja en la URL
(`/contacto?ref=chaleco-verde`, ver `obra-card.tsx:41`), así que ella también
sabe qué pieza le gustó a esa persona.

---

## 4. Cursos: qué mostrar mientras no existe el curso

Al lanzamiento hay **un solo curso**: el inicial de técnicas básicas
(`tu-primer-telar` en el seed: 4 módulos, 12 lecciones, técnica llano).

Para la v1:

- **Sacar los otros 2 cursos** (`telar-mapuche`, `diseno-propio`). No existen y
  hoy se pueden comprar.
- El curso inicial se muestra **sin botón de compra**: temario visible + "abre
  en [mes]" + **lista de espera**. La lista de espera es el activo más
  importante del pre-lanzamiento: es la gente a la que le vas a vender el día 1.
- El formulario de newsletter ya existe (`components/newsletter-form.tsx`), solo
  hay que cambiarle la promesa: de "novedades y descuentos" a "avísame cuando
  abra el curso".

**Lo del perfil con checklist de progreso: hoy no existe.** Revisado el código:
hay tabla `enrollments` (quién está inscrito) pero **no hay tabla de progreso por
lección**, y `mis-cursos` solo lista los cursos con un link, sin porcentaje ni
checklist. Es trabajo por hacer, no algo que esté a medias. No es necesario para
lanzar (no hay curso todavía), pero es lo primero que hay que construir apenas
Katy grabe las clases. Son 3 piezas: tabla `lesson_progress`, acción de "marcar
lección vista" en el reproductor, y la barra de progreso en `mis-cursos`.

---

## 5. Inventario de imágenes

**Desde el 20-ago-2026 estas fotos ya NO están en el repo.** `public/images/`
quedó vacío: eran de relleno, estaban mal categorizadas y se iban a mezclar con
las definitivas. Ahora viven en el Drive de contenido, ordenadas por familia.

Siguen en el historial de git, así que no se perdió nada: `git show
99eeaee:public/images/<archivo>.jpg > <archivo>.jpg` recupera cualquiera.

Eran 20 archivos `.jpg`, 3,4 MB en total, todos comprimidos a 960×1280
(~100-250 KB c/u). **No son los originales.** Los originales de Katy van en
`00-ORIGINALES/` del Drive.

Esta tabla queda como registro de qué era cada archivo, para poder mapearlos
cuando lleguen las versiones buenas.

### 5.1 Las que el sitio mostraba

| Archivo | Medidas | Proporción | Dónde se usaba | Qué muestra |
|---|---|---|---|---|
| `katy-retrato.jpg` | 959×1280 | 3:4 vert | `/sobre-mi` | Retrato de Katy |
| `telar-proceso.jpg` | 960×1280 | 3:4 vert | `/sobre-mi` | Proceso en el telar |
| `prod-chaleco-verde-1.jpg` | 960×1280 | 3:4 vert | Obra "Chaleco verde" + tienda | Chaleco verde |
| `prod-chaleco-verde-2.jpg` | 960×1280 | 3:4 vert | Hover del chaleco + tienda | Chaleco verde, lateral |
| `prod-bufanda-blanca-1.jpg` | 960×1280 | 3:4 vert | Obra "Pieza crema" + tienda | Pieza crema con bandas |
| `prod-bufanda-blanca-2.jpg` | 960×1280 | 3:4 vert | Hover pieza crema + tienda | Pieza crema, otra vista |
| `prod-bufanda-blanca-3.jpg` | 960×1280 | 3:4 vert | Obra "detalle" + tienda | Detalle del tejido |
| `prod-bufanda-roja-1.jpg` | 960×1280 | 3:4 vert | Obra "Pieza roja" + tienda | Pieza roja con flecos |
| `prod-bufanda-roja-2.jpg` | 960×1280 | 3:4 vert | Hover pieza roja + tienda | Pieza roja, caída completa |
| `obra-correas-1.jpg` | 960×1280 | 3:4 vert | Obra "Fajas" (mal nombrada) | Correas morado/amarillo/rosado |
| `obra-correas-4.jpg` | 960×1280 | 3:4 vert | Obra "Faja en el telar" (mal nombrada) | Correa sobre la espada del telar |
| `lanas-1.jpg` | 960×1280 | 3:4 vert | Tienda (producto lanas) | Lanas e hilos |
| `lanas-2.jpg` | 960×1280 | 3:4 vert | Tienda (producto lanas) | Lanas, segunda vista |
| `obra-clientes.jpg` | 960×1280 | 3:4 vert | **Cargada pero NO visible** | Cordón porta-credencial |

`obra-clientes.jpg` está marcada `publicable: false` por dos razones anotadas en
`obras.ts:101`: está fotografiada sobre un escritorio de oficina con teclado y
vaso de lápices en cuadro, y falta la autorización de la clienta.

### 5.2 Las que estaban cargadas y nadie mostraba (6)

**Revisar antes de pedir fotos nuevas — puede que alguna ya sirva:**

| Archivo | Medidas | Proporción | Qué muestra |
|---|---|---|---|
| `katy-taller.jpg` | 734×1280 | 9:16 vert alta | Katy en el taller |
| `katy-telar.jpg` | 740×1280 | 9:16 vert alta | Katy en el telar |
| `obra-correas-2.jpg` | 960×1280 | 3:4 vert | Correas, otra toma |
| `obra-correas-3.jpg` | 960×1280 | 3:4 vert | Correas, otra toma |
| `obra-langer-1.jpg` | 960×1280 | 3:4 vert | **Chaleco** de la familia Langer |
| `obra-langer-2.jpg` | 960×1280 | 3:4 vert | Chaleco Langer, otra toma |

### 5.3 El hallazgo importante

**No hay ni una sola foto horizontal en todo el repo.** Las 20 son verticales
(17 en 3:4 y 3 en ~9:16). Y las tres ranuras vacías de la página piden
exactamente lo contrario:

| Ranura vacía | Proporción que necesita | Estado |
|---|---|---|
| Hero de la portada | **16:9 panorámica** | no existe ninguna |
| "Quién teje" | **3:2 horizontal** | no existe ninguna |
| Portada del curso | **3:2 horizontal** | no existe ninguna |

Por eso la portada muestra "Foto en camino" arriba: no es un bug, es que
literalmente no hay material del formato que necesita.

---

## 6. Fotos que faltan (lista para Katy)

Ordenadas por urgencia. Las 3 primeras son las que desbloquean la portada.

**Críticas — sin esto la portada no se puede lanzar**

1. **Hero — horizontal 16:9.** Katy tejiendo en el witral, plano abierto que
   muestre el espacio del taller. Que se vea el telar completo y ella trabajando,
   no posando. Dejar aire a un costado: encima va el texto.
2. **Retrato — horizontal 3:2.** Katy mirando a cámara, en el taller, luz
   natural. Sirve doble: sección "quién teje" y póster del video de saludo.
3. **Portada del curso — horizontal 3:2.** Manos en el telar o el witral armado.
   Sin texto encima, el título lo pone la página.

**Importantes — es lo que se vende hoy**

4. **Chalecos entregados.** Contando el de la familia Langer hay dos. Si hay hartas fotos de
   chalecos de encargo, esta es la carga más valiosa del Drive. Por pieza:
   1 foto de la prenda completa + 1 detalle del tejido, **vertical 3:4**, fondo
   neutro, misma distancia y misma luz entre piezas (para que la grilla se lea
   pareja).
5. **Refotografiar los cordones porta-credencial.** Los actuales están sobre un
   escritorio de oficina. Además hay que pedirle autorización a la clienta.
6. **Proceso, vertical 3:4:** manos tejiendo, la urdimbre montada, detalle de la
   trama, muestrario de lanas en la mano.

**Deseables**

7. Video de saludo de Katy, 30-60 s, horizontal.
8. Fotos de alumnas / trabajos de alumnas — para cuando exista el curso.
9. Autorización escrita de cualquier persona identificable que salga en una foto.

---

## 7. Estructura propuesta del Drive

```
KAFKUN-CONTENIDO/
├── 00-ORIGINALES/            ← todo lo que entregue Katy, sin tocar
├── 01-HERO/                  ← horizontal 16:9   [FALTA]
├── 02-KATY/
│   ├── retrato-horizontal/   ← 3:2              [FALTA]
│   └── ambiente-taller/      ← ya hay: katy-taller, katy-telar, katy-retrato
├── 03-OBRAS/
│   ├── chalecos/             ← 3:4 · hay 4 (verde x2, Langer x2)
│   ├── bufandas/             ← 3:4 · hay 5 (crema x3, roja x2)
│   └── correas/              ← 3:4 · hay 5. YA NO se publican: correas salió
│                                del sitio el 21-ago. Las fotos se guardan igual.
├── 04-PROCESO/               ← 3:4 · hay 1 (telar-proceso)
├── 05-CURSO/
│   └── portada/              ← 3:2              [FALTA]
├── 06-MATERIALES/            ← lanas-1, lanas-2
└── 07-AUTORIZACIONES/        ← permisos de clientas por escrito
```

Regla que conviene fijar desde ya, porque después es un dolor: **vertical 3:4**
para piezas, productos y proceso; **horizontal** para hero, retratos de ambiente
y portadas de curso. Está escrita en `lib/media.ts` y los componentes ya la
respetan.

---

## 8. Orden de trabajo sugerido

| Orden | Qué | Estado |
|---|---|---|
| 1 | **Crear `/contacto`** con el pedido y la hora | ✅ hecho (`51ac26c`) |
| 2 | Bajar la venta: sacar tienda, carrito y checkout | pendiente |
| 3 | Cursos a "próximamente" + lista de espera | pendiente |
| 4 | Limpiar el menú y reordenar la portada | pendiente |
| 5 | Enchufar las fotos del hero y "quién teje" | bloqueado por Katy |
| 6 | Cargar las obras nuevas por familia | bloqueado por Katy |
| 7 | *(post-lanzamiento)* progreso y checklist del curso | que exista el curso |

Los pasos 2 a 4 no dependen de ninguna foto: se pueden hacer ya.

---

## 9. Pendientes que no son código

Cosas que alguien tiene que ir a hacer afuera, y sin las cuales el sitio
funciona pero a media máquina.

### Bloquean el lanzamiento

| # | Qué | Quién | Sin esto qué pasa |
|---|---|---|---|
| 1 | **Cuenta de Cal.com**: crearla, conectarla a Google Calendar y a Meet, y dejar la disponibilidad en L-V 18:00-21:00. Después setear `NEXT_PUBLIC_CAL_LINK` (ej. `kafkun/encargo`) | Katy + Gabo | `/contacto` muestra el correo en vez del calendario. Funciona, pero la hora se cuadra a mano por WhatsApp |
| 2 | **Supabase**: terminar de armar el proyecto y cargar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` | Gabo + Luca | **El sitio entero devuelve 500.** Ver el aviso de abajo |
| 3 | **Las 3 fotos horizontales** de Katy: hero 16:9, retrato 3:2 y portada de curso 3:2 | Katy | La portada arriba muestra "Foto en camino" |

> **Ojo con Supabase — esto no es un degradado, es una caída.**
> `proxy.ts` construye el cliente de Supabase sin comprobar que existan las
> variables, y el middleware corre **antes** que cualquier página. Si faltan, no
> es que falle el login: revienta `/`, `/contacto`, todo, con un 500. Comprobado
> el 22-ago-2026 levantando el servidor sin `.env.local`.
> Conviene que `proxy.ts` deje pasar la petición cuando no hay configuración, en
> vez de tumbar el sitio.

### No bloquean, pero conviene

| # | Qué | Quién |
|---|---|---|
| 4 | `RESEND_API_KEY` y `RESEND_FROM` en Vercel. Sin esto el pedido se recibe pero **no le llega el correo a Katy** | Gabo |
| 5 | `PEDIDOS_EMAIL` en Vercel. Por defecto ya apunta a `kafkuntelares@gmail.com` | Gabo |
| 6 | `UPSTASH_REDIS_REST_URL` y `_TOKEN`. Sin esto el límite de envíos del formulario **no se aplica**: cualquiera puede mandar mil pedidos | Gabo |
| 7 | Confirmar que el proyecto de Vercel está conectado al repo (`npx vercel ls`) | Gabo |
| 8 | Refotografiar los cordones porta-credencial y pedir autorización a la clienta | Katy |
| 9 | Nombres de las obras, material y técnica de cada una | Katy |

### Deuda de los skills del repo

| # | Qué | Por qué |
|---|---|---|
| 10 | `.claude/nextjs-app-router/SKILL.md` dice **"Next.js 15"** y habla de `middleware.ts` | El repo corre 16.3.2 y usa `proxy.ts`. Se gatilla al trabajar acá y entrega contexto viejo |
| 11 | No existe un skill del sistema visual | Cada sesión tiene que redescubrir la paleta, las proporciones de foto y las prohibiciones |
