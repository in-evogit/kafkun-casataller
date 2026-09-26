import { test, expect } from "@playwright/test";

/**
 * Paginas publicas.
 *
 * REESCRITO EL 26-SEP-2026. Los tests anteriores estaban escritos para el sitio de
 * julio y fallaban 7 de 16 sin que hubiera NADA roto: buscaban /tienda (ya no
 * existe), un boton "comprar ahora" (ahora dice "Quiero este taller") y titulos que
 * el rediseno de septiembre cambio. Una prueba que grita cuando todo esta bien es
 * peor que no tenerla: se aprende a ignorarla.
 *
 * REGLA AL ESCRIBIRLOS: nada que dependa de Supabase. La base se borro dos veces y
 * el sitio publico igual funciona porque sale de `lib/data/*.ts`. Si estas pruebas
 * dependieran de la base, dejarian de correr cada vez que eso pase.
 */

test.describe("Paginas publicas", () => {
  test("la portada carga y muestra la oferta con precio", async ({ page }) => {
    await page.goto("/");

    // El titular de la seccion de ofertas, que desde el 19-sep va SEGUNDA: el
    // trafico llega de Instagram ya conociendo a Katty y viene a comprar.
    await expect(
      page.getByRole("heading", { name: /aprende a tejer, o encarga tu pieza/i })
    ).toBeVisible({ timeout: 10_000 });

    // Que el precio se vea sin bajar a buscarlo es el punto de todo el reordenamiento.
    await expect(page.getByText(/\$\s?\d{1,3}\.\d{3}/).first()).toBeVisible();
  });

  test("el menu lleva a las cinco secciones y ninguna da 404", async ({ page }) => {
    // Las cinco del navbar. Arrastrabamos 5 rutas enlazadas que daban 404
    // (/contacto entre ellas, en el propio menu); esto impide que vuelva a pasar.
    for (const ruta of ["/cursos", "/a-pedido", "/diario", "/sobre-mi", "/contacto"]) {
      const res = await page.goto(ruta);
      expect(res?.status(), `${ruta} deberia responder 200`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("el catalogo de clases lleva al detalle del taller", async ({ page }) => {
    await page.goto("/cursos");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const primera = page.locator("a[href^='/cursos/']").first();
    await expect(primera).toBeVisible();
    await primera.click();
    await expect(page).toHaveURL(/\/cursos\/[a-z0-9-]+/);
  });

  test("el detalle del taller tiene el boton de compra", async ({ page }) => {
    await page.goto("/cursos/tu-primer-telar");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // "Quiero este taller" desde el rediseno. Apunta a /checkout?curso=...
    const comprar = page.getByRole("link", { name: /quiero este taller/i }).first();
    await expect(comprar).toBeVisible();
    await expect(comprar).toHaveAttribute("href", /\/checkout\?curso=/);
  });

  test("el encargo NO muestra precio", async ({ page }) => {
    // Decision de negocio, no de estilo: el precio del encargo sale conversando,
    // con la pieza definida. Un "desde $X" aca seria inventarle un numero a Katty.
    await page.goto("/a-pedido");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/desde \$/i)).toHaveCount(0);
  });

  test("el newsletter se puede firmar desde su propia pagina", async ({ page }) => {
    // El enlace del menu dice "Newsletter": la pagina tiene que dejar suscribirse
    // sin buscar, o el enlace miente.
    await page.goto("/diario");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const correo = page.getByPlaceholder(/tu@correo/i).first();
    await expect(correo).toBeVisible();
    await expect(page.getByRole("button", { name: /avísame/i }).first()).toBeVisible();
  });

  test("sitemap y robots responden", async ({ page }) => {
    for (const ruta of ["/sitemap.xml", "/robots.txt"]) {
      const res = await page.goto(ruta);
      expect(res?.status(), ruta).toBe(200);
    }
  });

  test("una ruta inventada da 404", async ({ page }) => {
    // Sin esto, un test que pide una pagina mal escrita puede pasar por
    // accidente creyendo que existe.
    const res = await page.goto("/esta-pagina-no-existe-jamas");
    expect(res?.status()).toBe(404);
  });
});
