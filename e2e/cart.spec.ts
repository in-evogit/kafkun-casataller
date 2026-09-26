import { test, expect } from "@playwright/test";

/**
 * Carrito y checkout.
 *
 * Reescrito el 26-sep-2026: los tests viejos probaban /tienda y /tienda/<producto>,
 * rutas que dejaron de existir con la reestructura a /a-pedido + /cursos. Fallaban
 * por eso, no porque el carrito estuviera roto.
 *
 * Lo que SI hay que vigilar aca es el monto. El bug que cobraba 1/100 del precio
 * ($45.000 → $450, porque el codigo dividia por 100 y el peso chileno no tiene
 * decimales) estuvo publicado meses sin que nadie lo notara. Esa vigilancia real
 * solo se puede hacer con MercadoPago en sandbox; mientras tanto se comprueba que
 * el checkout avise que NO esta cobrando.
 */

test.describe("Carrito y checkout", () => {
  test("el carrito vacio lo dice y ofrece salida", async ({ page }) => {
    await page.goto("/carrito");
    await expect(page.getByText(/tu carrito está vacío/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /curso|clase|explora/i }).first()).toBeVisible();
  });

  test("el checkout de un taller avisa que esta en modo desarrollo", async ({ page }) => {
    // Con MP_ACCESS_TOKEN sin configurar el checkout no cobra nada. Que lo diga en
    // pantalla es lo que impide que alguien crea que compro.
    await page.goto("/checkout?curso=tu-primer-telar");
    await expect(page.getByText(/modo desarrollo/i)).toBeVisible();
  });

  test("el checkout sin curso no es un callejon sin salida", async ({ page }) => {
    // Lo era: /checkout sin ?curso= mostraba una pagina muerta. Ahora resuelve el
    // carrito o manda a los cursos.
    await page.goto("/checkout");
    await expect(page.getByRole("link", { name: /curso/i }).first()).toBeVisible();
  });
});
