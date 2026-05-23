# Skills para el Proyecto Telar de Katy

Esta carpeta contiene **7 skills** especializados para Claude Code que cubren las áreas críticas del proyecto. Cada uno tiene su propio `SKILL.md` con frontmatter YAML que se activa automáticamente cuando Claude Code detecta los keywords relevantes.

## Los 7 Skills

| # | Skill | Cubre |
|---|-------|-------|
| 1 | **security-master** | Headers HTTP, CSP, OWASP, autenticación, validación, HMAC, rate limiting, gestión de secretos, checklist completa de seguridad |
| 2 | **supabase-rls** | Row Level Security, políticas, patrones por tabla, testing, debugging, optimización |
| 3 | **seo-master** | Metadata, JSON-LD, sitemap, robots, Core Web Vitals, optimización de imágenes, internal linking |
| 4 | **mercadopago-chile** | Integración Mercado Pago Chile, preferences, webhooks con HMAC, idempotencia, cuotas, refunds |
| 5 | **mux-video-protected** | Signed URLs, JWT, direct upload, webhook Mux, free preview, watermark, costos |
| 6 | **nextjs-app-router** | Server Components, Server Actions, middleware, cache, streaming, performance |
| 7 | **chile-ecommerce-legal** | SII, boletas electrónicas, SERNAC, derecho retracto, Ley 19.628/21.719, cookies, despacho |

## Cómo Instalarlos en Claude Code

Hay dos opciones según cómo tengas configurado Claude Code:

### Opción A — Copiar a tu carpeta de skills personal

Si tu Claude Code lee skills desde una carpeta tipo `~/.claude/skills/` o `~/claude-skills/`:

```bash
# Copiar las 7 carpetas a tu directorio de skills
cp -r ./skills/* ~/.claude/skills/

# Verificar
ls ~/.claude/skills/
# Deberías ver: security-master, supabase-rls, seo-master, mercadopago-chile,
#               mux-video-protected, nextjs-app-router, chile-ecommerce-legal
```

### Opción B — Dentro del repo del proyecto

Si prefieres tenerlos versionados con el proyecto:

```bash
# Crear carpeta de skills en el repo
mkdir -p .claude/skills
cp -r ./skills/* .claude/skills/

# Commitear al repo
git add .claude/skills
git commit -m "feat: add specialized skills for the project"
```

## Cómo Funcionan

Cada `SKILL.md` tiene un YAML frontmatter con:

- **`name`**: identificador único del skill
- **`description`**: descripción detallada con triggers ("USAR SIEMPRE que...") que Claude Code detecta para activar el skill automáticamente

Ejemplo de cómo activar manualmente:
> "Aplica el skill `security-master` para revisar la configuración de headers HTTP de la app"

Pero idealmente NO necesitas activarlos manualmente — los triggers del description hacen que se activen solos cuando trabajas en el área relevante.

## Mapeo Skills → Fases del Proyecto

| Fase del MASTER_INSTRUCTIONS.md | Skills relevantes |
|----------------------------------|-------------------|
| **Fase 0 — Setup** | nextjs-app-router |
| **Fase 1 — Auth + Seguridad** | security-master, supabase-rls, nextjs-app-router |
| **Fase 2 — Landing + SEO** | seo-master, nextjs-app-router |
| **Fase 3 — Checkout + Pagos** | mercadopago-chile, security-master, chile-ecommerce-legal |
| **Fase 4 — Video protegido** | mux-video-protected, security-master |
| **Fase 5 — Admin panel** | nextjs-app-router, supabase-rls, security-master |
| **Fase 6 — Productos físicos** | chile-ecommerce-legal (despacho), seo-master |
| **Fase 7 — Boletas + Pulido** | chile-ecommerce-legal (SII), security-master, seo-master |

## Prompt Sugerido Para Claude Code

Cuando abras Claude Code en el repo del proyecto, después de pegar el `MASTER_INSTRUCTIONS.md`, usa este prompt:

```
He cargado MASTER_INSTRUCTIONS.md en la raíz del repo y 7 skills
especializados en .claude/skills/ (o ~/.claude/skills/, donde corresponda).

Los skills son:
- security-master: seguridad web production-grade
- supabase-rls: Row Level Security
- seo-master: SEO técnico Next.js
- mercadopago-chile: integración pagos Chile
- mux-video-protected: video protegido con signed URLs
- nextjs-app-router: patrones Next.js 15
- chile-ecommerce-legal: cumplimiento SII, SERNAC, datos personales

Tareas:
1. Lee MASTER_INSTRUCTIONS.md completo.
2. Verifica que tienes acceso a los 7 skills (intenta listarlos).
3. Resúmeme en 7 líneas el proyecto.
4. Recítame las 5 reglas absolutas de seguridad.
5. Cuando esté ok, arrancamos Fase 0.

Reglas durante toda la construcción:
- Antes de cada fase, activar los skills relevantes (ver mapeo en
  skills/README.md).
- Nunca commitear .env*. Verificar .gitignore en Fase 0.
- Cada nueva tabla Supabase: RLS + políticas antes de merge.
- Cada nueva página: pasar el checklist SEO antes de merge.
- Cada endpoint API: validación Zod antes de procesar.
```

## Verificación

Para confirmar que los skills están bien:

```bash
# Cada skill debe tener su SKILL.md
for d in skills/*/; do
  if [ -f "$d/SKILL.md" ]; then
    echo "✓ $d"
  else
    echo "✗ FALTA: $d/SKILL.md"
  fi
done
```

Resultado esperado:
```
✓ skills/security-master/
✓ skills/supabase-rls/
✓ skills/seo-master/
✓ skills/mercadopago-chile/
✓ skills/mux-video-protected/
✓ skills/nextjs-app-router/
✓ skills/chile-ecommerce-legal/
```

## Mantenimiento

Estos skills están escritos a fecha de **2026**. Algunas cosas que cambian con el tiempo:

- **Comisiones de Mercado Pago**: verificar anualmente en su dashboard
- **Costos de Mux**: verificar en https://mux.com/pricing
- **Versiones de Next.js**: actualizar al instalar (el skill cubre patrones, no versiones exactas)
- **Cambios regulatorios Chile**: Ley 21.719 tiene plazos graduales, revisar SERNAC y SII anualmente

Si encuentras que algo en un skill quedó desactualizado, edita el `SKILL.md` correspondiente.
