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

test.describe("review slider", () => {
  for (const { path, forward } of [{ path: "/", forward: "ArrowRight" }, { path: "/ar", forward: "ArrowLeft" }]) {
    test(`${path}: buttons, dots and keys`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${path}#stimmen`);
      const dots = page.locator(".dot-btn");
      const current = () => dots.evaluateAll((d) => d.findIndex((b) => b.getAttribute("aria-current") === "true"));
      await expect(page.locator(".rev-prev")).toBeDisabled();
      await page.locator(".rev-next").click();
      await expect.poll(current).toBe(1);
      await dots.nth(2).click();
      await expect.poll(current).toBe(2);
      await expect(page.locator(".rev-next")).toBeDisabled();
      await page.locator(".reviews").focus();
      await page.keyboard.press(forward === "ArrowRight" ? "ArrowLeft" : "ArrowRight");
      await expect.poll(current).toBe(1);
      await page.keyboard.press(forward);
      await expect.poll(current).toBe(2);
    });
  }
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
  await expect(page.locator(".care-count")).toHaveText("Mit 75 Jahren: 15 Empfehlungen");
  await page.fill("#age", "17");
  await expect(page.locator("#age-err")).toBeVisible();
  await expect(page.locator(".care-count")).toHaveText("Mit 75 Jahren: 15 Empfehlungen");
});
