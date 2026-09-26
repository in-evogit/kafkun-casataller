import { test, expect } from "@playwright/test";

/**
 * Cuentas.
 *
 * Reescrito el 26-sep-2026. Los dos primeros tests buscaban los titulos
 * "Iniciar sesión" y "Crear cuenta", que el rediseno cambio por "Bienvenida de
 * vuelta" y los suyos. Fallaban por el texto, no por el formulario.
 *
 * Para que sirve la cuenta (Gabriel, 26-sep): quien compra un taller entra a ver su
 * clase las veces que quiera, y de paso queda una lista de gente que ya compro a la
 * que se le pueden ofrecer los talleres presenciales. Por eso el login se queda con
 * contrasena Y con enlace por correo: son dos maneras de volver a entrar.
 */

test.describe("Cuentas", () => {
  test("el login pide correo y contrasena, y ofrece el enlace por correo", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email|correo/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^ingresar$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /enlace|link por email/i })).toBeVisible();
  });

  test("el registro pide lo minimo para crear la cuenta", async ({ page }) => {
    await page.goto("/registro");
    await expect(page.getByLabel(/email|correo/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /crear|registr/i }).first()).toBeVisible();
  });

  test("se puede ir del login al registro y volver", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /regístrate/i }).click();
    await expect(page).toHaveURL(/\/registro/);
  });

  test("mis cursos manda al login si no hay sesion", async ({ page }) => {
    await page.goto("/mis-cursos");
    await expect(page).toHaveURL(/\/login/);
  });

  test("el panel manda al login si no hay sesion", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("las lecciones mandan al login si no hay sesion", async ({ page }) => {
    // El video de pago NO puede quedar accesible sin cuenta.
    await page.goto("/aprende/tu-primer-telar/intro-al-telar");
    await expect(page).toHaveURL(/\/login/);
  });

  test("las pantallas nuevas del panel tambien piden sesion", async ({ page }) => {
    // Encargos y mensajes traen nombre, correo, telefono y lo que alguien quiere
    // regalar. Suscriptores es la lista de correos completa.
    for (const ruta of ["/admin/encargos", "/admin/mensajes", "/admin/suscriptores"]) {
      await page.goto(ruta);
      await expect(page, `${ruta} deberia mandar al login`).toHaveURL(/\/login/);
    }
  });

  test("la descarga de correos NO entrega la lista sin sesion", async ({ request }) => {
    // El test que mas importa de este archivo: /admin/suscriptores/csv entrega la
    // lista de correos entera.
    //
    // Lo cubren DOS guardias —el middleware, que redirige con 307 antes de llegar,
    // y la comprobacion dentro del propio handler, que responde 403 si el
    // middleware dejara de cubrirlo (un `route.ts` no pasa por el layout del
    // panel)—. La prueba no fija cual de las dos actua: comprueba lo unico que
    // importa, que NO salga un CSV.
    const res = await request.get("/admin/suscriptores/csv", { maxRedirects: 0 });

    expect(res.status(), "no puede responder 200").not.toBe(200);
    expect(res.headers()["content-type"] ?? "").not.toContain("csv");
    expect(await res.text(), "no puede traer la cabecera del CSV").not.toContain(
      "correo,nombre,origen"
    );
  });
});
