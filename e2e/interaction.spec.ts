import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("shows errors next to fields and focuses the first", async ({ page }) => {
    await page.goto("/#schreiben");
    await page.locator(".cf button[type=submit]").click();
    await expect(page.locator("#cf-name")).toBeFocused();
    for (const f of ["name", "email", "message", "consent"]) {
      await expect(page.locator(`#cf-${f}-err`)).toBeVisible();
      await expect(page.locator(`#cf-${f}`)).toHaveAttribute("aria-invalid", "true");
    }
    await page.fill("#cf-name", "Maria K.");
    await page.fill("#cf-email", "maria@");
    await page.locator(".cf button[type=submit]").click();
    await expect(page.locator("#cf-email")).toBeFocused();
  });

  test("sends a valid message and confirms", async ({ page }) => {
    await page.goto("/#schreiben");
    await page.fill("#cf-name", "Maria K.");
    await page.fill("#cf-email", "maria@example.de");
    await page.fill("#cf-message", "Bitte um Rückruf wegen eines Termins.");
    await page.check("#cf-consent");
    await page.waitForTimeout(3200); // the server drops faster submissions as bots
    await page.locator(".cf button[type=submit]").click();
    await expect(page.locator(".cf-status")).toHaveText(/Danke! Ihre Nachricht ist angekommen/);
    await expect(page.locator("#cf-name")).toHaveValue("");
  });
});

test("reviews: without approved reviews only the Google links show", async ({ page }) => {
  await page.goto("/#stimmen");
  const section = page.locator("#stimmen");
  await expect(section.locator("h2")).toHaveText("Ihre Erfahrung zählt");
  await expect(section.locator(".review")).toHaveCount(0);
  await expect(section.locator(".rev-actions a")).toHaveCount(2);
});

test("FAQ opens with the keyboard", async ({ page }) => {
  await page.goto("/#fragen");
  const first = page.locator(".faq details").first();
  await first.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(first).not.toHaveAttribute("open", "");
});

test("care finder updates with the age", async ({ page }) => {
  await page.goto("/#vorsorge");
  await page.fill("#age", "75");
  await expect(page.locator(".care-count")).toHaveText("Mit 75 Jahren: 17 Empfehlungen – einige nur für Frauen oder nur für Männer");
  await page.fill("#age", "17");
  await expect(page.locator("#age-err")).toBeVisible();
  await expect(page.locator(".care-count")).toHaveText("Mit 75 Jahren: 17 Empfehlungen – einige nur für Frauen oder nur für Männer");
});
