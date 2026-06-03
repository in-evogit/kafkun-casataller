import { test, expect } from "@playwright/test";

test.describe("Auth flows", () => {
  test("login page renders and shows form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /iniciar sesión/i })).toBeVisible();
    await expect(page.getByLabel(/correo/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /iniciar sesión/i })).toBeVisible();
  });

  test("registro page renders and shows form", async ({ page }) => {
    await page.goto("/registro");
    await expect(page.getByRole("heading", { name: /crear cuenta/i })).toBeVisible();
    await expect(page.getByLabel(/correo/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /crear cuenta/i })).toBeVisible();
  });

  test("protected routes redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/mis-cursos");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("aprende routes redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/aprende/tu-primer-telar/intro-al-telar");
    await expect(page).toHaveURL(/\/login/);
  });
});
