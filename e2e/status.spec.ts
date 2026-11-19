import { expect, test } from "@playwright/test";

// Berlin wall-clock times (CET, +01:00); the browser itself runs in Asia/Tokyo.
const cases = [
  { at: "2026-11-23T09:30:00+01:00", headline: "Geöffnet bis 13:00 Uhr", detail: null },
  { at: "2026-11-23T13:30:00+01:00", headline: "Jetzt geschlossen", detail: "Mittagspause – ab 14:00 Uhr wieder geöffnet" },
  { at: "2026-11-25T15:00:00+01:00", headline: "Jetzt geschlossen", detail: "Wieder geöffnet morgen ab 08:00 Uhr" },
  { at: "2026-11-28T10:00:00+01:00", headline: "Jetzt geschlossen", detail: "Wieder geöffnet Montag ab 08:00 Uhr" },
];

for (const c of cases) {
  test(`status at ${c.at}`, async ({ page }) => {
    await page.clock.setFixedTime(new Date(c.at));
    await page.goto("/");
    const status = page.locator('.hero-info a[href="#heute"]');
    await expect(status.locator("b")).toHaveText(c.headline);
    if (c.detail) await expect(status.locator("small")).toHaveText(c.detail);
    await expect(page.locator(".today .status-text")).toHaveText(c.headline);
  });
}
