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
| 1 | **`/contacto` no existe** | 7 links apuntan ahí | El CTA principal del encargo ("Empezar mi encargo", "Quiero algo así", navbar, footer, CTA final) cae en **404**. El embudo completo muere ahí. **Sigue abierto: es el #1.** |
| 2 | **Se pueden comprar 3 cursos que no existen** | `lib/data/seed.ts:1-44` | Precio (45.000 / 72.000 / 68.000) y flujo de compra activos; las 46 lecciones tienen `mux_playback_id: null`, o sea cero video. → **Resuelto por decisión 2:** los cursos pasan a "próximamente" sin compra. |
| 3 | **La tienda contradice a las obras** | `/tienda` vs. portada | La misma foto aparece como *"obra entregada, no está en venta"* en la portada y como *producto con precio y carrito* en `/tienda`. → **Resuelto por decisión 1:** la tienda se cae. |
| 4 | **La portada no tiene foto arriba** | `page.tsx:52` | El hero y "quién teje" caen en el placeholder "Foto en camino". Depende de que Katy entregue las 2 fotos horizontales. |

---

## 2. Cómo va a ser la interfaz

### 2.1 Navegación

De 6 links a 4. Cada uno tiene que ganarse el lugar:

```
KAFKÚN     Obras · Quién es Katy · Cursos · Encargar una pieza
```

- **Obras** → ancla al muestrario de la portada.
- **Quién es Katy** → `/sobre-mi`.
- **Cursos** → `/cursos`, en modo "próximamente".
- **Encargar una pieza** → `/contacto`. Es el botón sólido, el único destacado.

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
de dos líneas, y dos botones: *Encargar una pieza* (sólido) y *Ver las obras*
(secundario, ancla a la sección 3). El componente ya está armado texto-primero,
solo le falta la foto.

**2 · Quién teje.** Retrato horizontal + el texto de Katy: quién es, desde cuándo
teje, qué la hace distinta. Esto sube de posición: si el sitio vende marca
personal, la persona no puede aparecer en el sexto scroll. Cuando exista el video
de saludo, va acá, con el retrato de póster y play manual.

**3 · Obras a pedido.** Muestrario en grilla, **una fila por familia**: Chalecos,
Piezas enteras, Fajas, Accesorios. Chalecos primero porque es lo que se vende
hoy. Cada pieza: foto vertical 3:4, nombre, y al pasar el cursor aparece la
segunda toma. Sin precio y sin carrito: cada una lleva a *"Quiero algo así"*, que
abre `/contacto` con la pieza ya anotada en la URL (`?ref=chaleco-verde`), así
Katy llega a la reunión sabiendo qué le gustó a esa persona.

**4 · El proceso.** Los 5 pasos ya escritos: nos juntamos y te tomo medidas →
traes referencias → eliges material tocándolo → recién ahí hay precio y plazo →
tejo y entrego. Esta sección es la que responde la pregunta que hoy Katy contesta
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
| `/contacto` | Formulario + calendario del encargo | **hay que crearla** |
| `/cursos` | El curso inicial en "próximamente" + lista de espera | existe, hay que sacarle la compra |
| `/diario` | Las 2 entradas del blog | queda publicada, fuera del menú |
| `/tienda` `/carrito` `/checkout` | Venta online | **se caen** |
| `/login` `/registro` `/mi-cuenta` `/mis-cursos` `/aprende` | Área de alumnas | **quedan dormidas** hasta que exista el curso |

Lo del área de alumnas: no se borra, se deja tal cual y sin links que lleven
ahí. Cuando el curso exista se despierta. Borrarla sería tirar trabajo hecho.

### 2.4 Lo que NO se toca ahora

El progreso con checklist del curso (marcar lección vista, barra de avance en el
perfil) **no existe** y no se construye todavía: no hay curso que seguir. Queda
anotado como el primer trabajo del día después del lanzamiento. Son 3 piezas:
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
- Se pierde el escaneo: con grilla el ojo compara 6 piezas de una; con carrusel
  ve una a la vez.

**Lo que sí recomiendo, ahora que van a haber hartas fotos de chalecos:**

- **Grilla por familia.** Cada familia (Chalecos, Piezas enteras, Fajas,
  Accesorios) es su propia fila. Escala bien: llegan 20 fotos de chalecos y la
  sección no se rompe, se hace más rica. La estructura ya existe en
  `lib/data/obras.ts` (`familiasEncargo`), solo hay que llenarla.
- **Si quieren movimiento:** una tira horizontal de desplazamiento continuo
  (tipo muestrario que corre lento), que se detiene al pasar el cursor y que
  respeta `prefers-reduced-motion`. Eso sí funciona, porque no oculta nada: la
  foto siempre vuelve.
- **Carrusel manual sí, pero adentro de una pieza:** cuando se abre un chaleco
  específico y hay 4 tomas de esa misma pieza, ahí el carrusel deslizable con el
  dedo es lo correcto.

> Ojo con la organización actual: hoy las fajas y los cordones están metidos
> dentro de la familia "Piezas enteras" (`obras.ts:59`), lo cual no es. Al
> cargar las fotos nuevas hay que separar familias de verdad.

---

## 3. Encargos: cómo se agenda la reunión

Reglas del negocio (definidas por Katy):

- **Disponibilidad:** lunes a viernes, **después de las 18:00**.
- **No hay pasarela de pago.** El precio se define en la reunión porque la pieza
  es 100% personalizada.
- **Producto principal hoy:** chalecos a medida.
- Después de la reunión: 50% de abono para entrar al telar, 50% a la entrega
  (ya está escrito en `how-it-works.tsx`, paso 04 y 05).

**Recomendación de implementación — no construir un motor de agenda.**

Opción recomendada: **Cal.com** (plan gratis) o *citas de Google Calendar*,
con la disponibilidad configurada 18:00-21:00 L-V, embebido en `/contacto`.
Ventajas: respeta el calendario real de Katy, no hay que mantener código de
horarios, y se acabó el ida y vuelta por WhatsApp para cuadrar hora.

Antes del calendario, un formulario corto de calificación (4 campos, no más):

1. Nombre + WhatsApp
2. ¿Qué te gustaría que te teja? (chaleco / faja / otra pieza)
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

**Todas están locales, dentro del repo, en `public/images/`.**
Ruta completa desde la raíz del proyecto: `<carpeta-del-repo>/public/images/`

20 archivos `.jpg`, 3,4 MB en total. Ninguna imagen rota: las 14 rutas que el
código referencia existen todas en disco.

> **Importante para el Drive:** estas fotos están comprimidas y redimensionadas
> a 960×1280 (~100-250 KB c/u). **No son los originales.** Al Drive hay que
> subir los originales de Katy, no estos archivos.

### 5.1 En uso hoy

| Archivo | Medidas | Proporción | Dónde se usa | Qué muestra |
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
| `obra-correas-1.jpg` | 960×1280 | 3:4 vert | Obra "Fajas" | Fajas morado/amarillo/rosado |
| `obra-correas-4.jpg` | 960×1280 | 3:4 vert | Obra "Faja en el telar" | Faja sobre la espada del telar |
| `lanas-1.jpg` | 960×1280 | 3:4 vert | Tienda (producto lanas) | Lanas e hilos |
| `lanas-2.jpg` | 960×1280 | 3:4 vert | Tienda (producto lanas) | Lanas, segunda vista |
| `obra-clientes.jpg` | 960×1280 | 3:4 vert | **Cargada pero NO visible** | Cordón porta-credencial |

`obra-clientes.jpg` está marcada `publicable: false` por dos razones anotadas en
`obras.ts:101`: está fotografiada sobre un escritorio de oficina con teclado y
vaso de lápices en cuadro, y falta la autorización de la clienta.

### 5.2 En el repo pero sin usar (6)

Estas están cargadas y nadie las muestra. **Revisar antes de pedir fotos nuevas
— puede que alguna ya sirva:**

| Archivo | Medidas | Proporción | Qué muestra |
|---|---|---|---|
| `katy-taller.jpg` | 734×1280 | 9:16 vert alta | Katy en el taller |
| `katy-telar.jpg` | 740×1280 | 9:16 vert alta | Katy en el telar |
| `obra-correas-2.jpg` | 960×1280 | 3:4 vert | Fajas, otra toma |
| `obra-correas-3.jpg` | 960×1280 | 3:4 vert | Fajas, otra toma |
| `obra-langer-1.jpg` | 960×1280 | 3:4 vert | Pieza langer |
| `obra-langer-2.jpg` | 960×1280 | 3:4 vert | Pieza langer, otra toma |

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

4. **Chalecos entregados.** Hoy hay UNO solo en el sitio. Si hay hartas fotos de
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
│   ├── chalecos/             ← 3:4 · hoy solo 1, hacen falta más
│   ├── piezas-enteras/       ← 3:4 · hay 5
│   ├── fajas/                ← 3:4 · hay 4
│   └── accesorios/           ← 3:4 · hay 1, hay que refotografiar
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

| Orden | Qué | Depende de |
|---|---|---|
| 1 | Bajar la venta: sacar tienda, carrito y checkout | — |
| 2 | Cursos a "próximamente" + lista de espera | — |
| 3 | Crear `/contacto` con formulario + calendario | decidir Cal.com vs. Google |
| 4 | Limpiar el menú y reordenar la portada | 1 y 2 |
| 5 | Enchufar las fotos del hero y "quién teje" | fotos de Katy |
| 6 | Cargar las obras nuevas por familia | fotos de Katy |
| 7 | *(post-lanzamiento)* progreso y checklist del curso | que exista el curso |

Los pasos 1 a 4 no dependen de ninguna foto: se pueden hacer ya. Los pasos 5 y 6
son los únicos bloqueados por Katy.
