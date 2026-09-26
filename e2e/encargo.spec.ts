import { test, expect } from "@playwright/test";

/**
 * El formulario de encargo — NUEVO el 26-sep-2026.
 *
 * No tenia ninguna prueba, y es el flujo que gana plata: es lo unico del sitio que
 * puede cobrar hoy (MercadoPago esta bloqueado hasta que Katty tenga la empresa).
 *
 * No se prueba el ENVIO: eso escribe en Supabase y manda correos. Una prueba que
 * envie de verdad dejaria encargos falsos en la tabla y ocuparia horas reales de la
 * agenda de Katty. Lo que se prueba es que los tres pasos existan, que el boton
 * explique lo que falta en vez de quedarse muerto, y que se pueda avanzar.
 */

test.describe("Encargo a pedido", () => {
  test("los tres pasos estan a la vista desde el principio", async ({ page }) => {
    await page.goto("/a-pedido/empezar");
    await expect(page.getByRole("heading", { name: /empecemos tu pieza/i })).toBeVisible();

    // Ver los tres pasos antes de empezar es lo que dice "esto se acaba pronto".
    for (const paso of [/tu pieza/i, /tus referencias/i, /cuándo nos juntamos/i]) {
      await expect(page.getByText(paso).first()).toBeVisible();
    }
  });

  test("el boton dice lo que falta en vez de quedarse muerto", async ({ page }) => {
    await page.goto("/a-pedido/empezar");

    // Apretar sin elegir nada. Antes el boton se deshabilitaba en silencio y la
    // persona quedaba mirando un boton muerto sin saber por que.
    await page.getByRole("button", { name: /seguir|siguiente|continuar/i }).first().click();
    await expect(page.getByText(/elige qué te gustaría que teja/i)).toBeVisible();
  });

  test("se avanza del paso uno al dos con la pieza elegida", async ({ page }) => {
    await page.goto("/a-pedido/empezar");

    await page.getByText(/un chaleco/i).first().click();
    await page
      .locator("#descripcion")
      .fill("Un chaleco holgado en tonos tierra, para el invierno.");

    await page.getByRole("button", { name: /seguir|siguiente|continuar/i }).first().click();

    // Paso 2: las referencias.
    await expect(page.getByText(/referencia/i).first()).toBeVisible();
  });
});
