import { expect, test } from "@playwright/test";

for (const path of ["/", "/ar"]) {
  test(`${path}: no third-party request until "Karte laden"`, async ({ page, baseURL }) => {
    const origins = new Set<string>();
    page.on("request", (r) => origins.add(new URL(r.url()).origin));
    await page.goto(path);
    // Scroll through the whole page so lazy images and islands load.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    await page.waitForLoadState("networkidle");
    expect([...origins]).toEqual([new URL(baseURL!).origin]);
    expect(await page.locator("iframe").count()).toBe(0);

    await page.locator(".map-actions button").click();
    const frame = page.locator(".map iframe");
    await expect(frame).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\/embed\?/);
    await expect(frame).toHaveAttribute("title", path === "/" ? /^Karte:/ : /^خريطة:/);
  });
}
