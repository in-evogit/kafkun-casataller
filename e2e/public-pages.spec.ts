import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("landing page loads with hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(/kafkun/i);
  });

  test("cursos page loads course catalog", async ({ page }) => {
    await page.goto("/cursos");
    await expect(page.getByRole("heading", { name: /cursos/i })).toBeVisible();
    const courseLinks = page.locator("a[href^='/cursos/']");
    await expect(courseLinks.first()).toBeVisible();
  });

  test("curso detail page loads with buy button", async ({ page }) => {
    await page.goto("/cursos/tu-primer-telar");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /comprar ahora/i })).toBeVisible();
  });

  test("sitemap.xml is reachable", async ({ page }) => {
    const res = await page.goto("/sitemap.xml");
    expect(res?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("urlset");
  });

  test("robots.txt is reachable", async ({ page }) => {
    const res = await page.goto("/robots.txt");
    expect(res?.status()).toBe(200);
  });

  test("security headers are present", async ({ page }) => {
    const res = await page.goto("/");
    const csp = res?.headers()["content-security-policy"];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src");
    const hsts = res?.headers()["strict-transport-security"];
    expect(hsts).toBeDefined();
    const xframe = res?.headers()["x-frame-options"];
    expect(xframe).toBe("DENY");
  });
});
