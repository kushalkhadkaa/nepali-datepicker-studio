const path = require("path");
const fs = require("fs");
const { test, expect } = require("@playwright/test");

const root = path.resolve(__dirname, "..");
const screenshotDir = path.join(__dirname, "screenshots");
fs.mkdirSync(screenshotDir, { recursive: true });

function fileUrl(file) {
  return `file://${path.join(root, file)}`;
}

async function hideAnimations(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0s !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `,
  });
}

test.describe("public browser smoke tests", () => {
  test("playground opens a picker, selects a date, and captures screenshots", async ({ page }, testInfo) => {
    await page.goto(fileUrl("index.html"));
    await hideAnimations(page);

    await expect(page.locator("h1")).toContainText("Nepali DatePicker");
    await page.locator("#single-picker-input").scrollIntoViewIfNeeded();
    await page.locator("#single-picker-input").click();
    await expect(page.locator(".ndp-picker").last()).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotDir, `playground-open-${testInfo.project.name}.png`),
      fullPage: false,
    });

    const activeDay = page.locator(".ndp-picker").last().locator(".ndp-day:not(.ndp-disabled):not(.ndp-day-empty)").first();
    await activeDay.click();
    await expect(page.locator("#single-picker-input")).not.toHaveValue("");
  });

  test("customizer generates developer snippets and captures preview", async ({ page }, testInfo) => {
    await page.goto(fileUrl("customizer.html"));
    await hideAnimations(page);

    await expect(page.locator("h1")).toContainText("Live Theme Customizer");
    await page.locator("#opt-preset").selectOption("hotel");
    await page.locator("#opt-dev-mode").selectOption("advanced");
    await expect(page.locator("#snippet-output")).toContainText("NepaliDatePicker");
    await expect(page.locator("#snippet-output")).toContainText("exportAdInput");

    await page.screenshot({
      path: path.join(screenshotDir, `customizer-generator-${testInfo.project.name}.png`),
      fullPage: false,
    });
  });

  test("converter widget and static helpers are available", async ({ page }) => {
    await page.goto(fileUrl("index.html"));
    await hideAnimations(page);

    await expect(page.locator("#converter-widget-container")).toBeVisible();

    const result = await page.evaluate(() => ({
      hasPicker: typeof window.NepaliDatePicker === "function",
      bs: window.AD2BS("2026-06-26"),
      ad: window.BS2AD("2083-03-12"),
      today: window.NepaliDatePicker.today(),
    }));

    expect(result.hasPicker).toBe(true);
    expect(result.bs).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.ad).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.today).toEqual(
      expect.objectContaining({
        year: expect.any(Number),
        month: expect.any(Number),
        day: expect.any(Number),
      })
    );
  });
});
