import { test, expect } from "@playwright/test";

test.describe("Cart flow", () => {
  test("can add a course to cart from catalog", async ({ page }) => {
    await page.goto("/cursos");
    const firstCourse = page.locator("a[href^='/cursos/']").first();
    await firstCourse.click();
    await expect(page).toHaveURL(/\/cursos\//);

    const addBtn = page.getByRole("link", { name: /comprar ahora|agregar al carrito/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test("cart page shows empty state when cart is empty", async ({ page }) => {
    await page.goto("/carrito");
    await expect(page.getByText(/vacío/i)).toBeVisible();
  });

  test("tienda page loads with products", async ({ page }) => {
    await page.goto("/tienda");
    await expect(page.getByRole("heading", { name: "Tienda" })).toBeVisible();
    const products = page.locator("a[href^='/tienda/']");
    await expect(products.first()).toBeVisible();
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/tienda/telar-maria-mediano");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/agregar al carrito/i)).toBeVisible();
  });

  test("checkout shows dev mode banner when MP not configured", async ({ page }) => {
    await page.goto("/cursos/tu-primer-telar");
    await page.goto("/checkout?curso=tu-primer-telar");
    await expect(page.getByText(/modo desarrollo/i)).toBeVisible();
  });
});
