import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { locales, widths } from "./helpers";

for (const { path, lang, dir } of locales) {
  for (const width of widths) {
    test(`${path} at ${width}px: lang/dir, no horizontal scroll, no axe violations`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("html")).toHaveAttribute("dir", dir);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBe(0);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
}

for (const path of ["/impressum", "/en/datenschutz", "/ar/impressum"]) {
  test(`${path}: no axe violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
  });
}

test("external booking links open in a new tab", async ({ page }) => {
  await page.goto("/");
  const links = page.locator('a[href*="doctolib.de"]');
  expect(await links.count()).toBeGreaterThan(0);
  for (const a of await links.all()) {
    await expect(a).toHaveAttribute("target", "_blank");
    await expect(a).toHaveAttribute("rel", /noopener/);
  }
});

test("language switch keeps the current section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en#kontakt");
  await page.locator(".lang-bar a[hreflang=ar]").click();
  await expect(page).toHaveURL(/\/ar#kontakt$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator("a.skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#inhalt$/);
});
