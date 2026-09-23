import { expect, test } from "@playwright/test";

test("layout has no horizontal overflow", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const metrics = await page.evaluate(() => ({
    bodyScrollWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));

  expect(metrics.documentScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.clientWidth + 2);
  expect(metrics.bodyScrollWidth, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.clientWidth + 2);
});

test("mobile menu, portfolio tabs, FAQ, modal, and WhatsApp form work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Interaction smoke test only needs the mobile menu viewport.");

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Buka menu" }).click();
  await expect(page.getByRole("link", { name: "Kontak" })).toBeVisible();

  await page.getByRole("link", { name: "Portfolio" }).click();
  await expect(page.getByRole("heading", { name: "Portfolio Interior" })).toBeVisible();
  await page.getByRole("tab", { name: "Kitchen Set" }).click();
  await expect(page.getByText("Modern Kitchen Set")).toBeVisible();

  await page.getByText("Modern Kitchen Set").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Buka menu" }).click();
  await page.getByRole("link", { name: "FAQ" }).click();
  await page.getByRole("button", { name: "Apakah bisa survey lokasi?" }).click();
  await expect(page.getByText("Ya, alur project dapat dimulai dari konsultasi dan survey lokasi.")).toBeVisible();

  await page.getByRole("button", { name: "Buka menu" }).click();
  await page.getByRole("link", { name: "Kontak" }).click();
  await page.getByPlaceholder("Nama Anda").fill("QA Tester");
  await page.getByPlaceholder("08xx xxxx xxxx").fill("08123456789");
  await page.getByPlaceholder("Kota / area project").fill("Bandung");
  await page.getByPlaceholder("Ceritakan kebutuhan interior atau kemitraan Anda").fill("Test responsive form");

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Kirim via WhatsApp" }).click();
  const popup = await popupPromise;

  expect(popup.url()).toMatch(/(wa\.me|api\.whatsapp\.com)/);
});
