import { test, expect, type Page, type Locator } from "@playwright/test";
import routeExpectations from "../../scripts/route-expectations.json";

async function progress(page: Page, selector: string, value: number) {
  await page.locator(selector).evaluate((element, value) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + Math.max(0, element.clientHeight - window.innerHeight) * value,
      behavior: "instant",
    });
  }, value);
}
async function readable(locator: Locator) {
  await expect(locator).toBeVisible();
  await expect
    .poll(() => locator.evaluate((el) => Number(getComputedStyle(el).opacity)))
    .toBeGreaterThan(0.95);
}
async function insideViewport(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(
    page.viewportSize()!.width + 1,
  );
  expect(box!.y).toBeGreaterThanOrEqual(-1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(
    page.viewportSize()!.height + 1,
  );
}

test("homepage content, responsive scroll scenes, artwork spacing and video", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".verendo-intro")).toHaveCount(0);
  await expect(page.locator("h1")).toContainText("More leads.");
  const video = page.locator(".growth-studio-video");
  await expect(video).toHaveAttribute("loop", "");
  await expect(video).toHaveAttribute("playsinline", "");
  expect(await video.evaluate((el: HTMLVideoElement) => el.muted)).toBe(true);
  const short = page.viewportSize()!.height <= 540;
  if (!short) {
    await progress(page, ".friction-section", 0.86);
    for (const badge of await page.locator(".friction-badge").all()) {
      await readable(badge);
      await insideViewport(page, badge);
    }
    for (const [value, title] of [
      [0.02, "Uncover"],
      [0.29, "Plan"],
      [0.54, "Build"],
      [0.83, "Launch"],
      [0.3, "Plan"],
    ] as const) {
      await progress(page, ".process-sequence", value);
      await expect(page.locator(".process-copy h3")).toHaveText(title);
      await readable(page.locator(".process-copy > div"));
      await insideViewport(page, page.locator(".process-copy"));
      await insideViewport(page, page.locator(".process-art"));
    }
    await progress(page, ".difference-section", 0.5);
    await readable(page.locator(".difference-cards"));
    await readable(page.locator(".difference-verendo"));
    await insideViewport(page, page.locator(".difference-verendo"));
    await progress(page, ".difference-section", 0.9);
    await readable(page.locator(".difference-other"));
    await insideViewport(page, page.locator(".difference-other"));
  } else {
    await expect(page.locator(".process-mobile-card")).toHaveCount(4);
    for (const card of await page.locator(".difference-card").all()) {
      await card.scrollIntoViewIfNeeded();
      await readable(card);
    }
  }
  for (const card of await page.locator(".pillar-card").all()) {
    await card.scrollIntoViewIfNeeded();
    const art = await card.locator(".pillar-art").boundingBox();
    const title = await card.locator("h3").boundingBox();
    expect(art!.y + art!.height).toBeLessThanOrEqual(title!.y + 1);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("home-review.png"),
    fullPage: true,
  });
});

test("contact form confirms success, resets, and preserves data on failure", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        message: "Thank you. Your project details have been sent.",
      }),
    }),
  );
  await page.goto("/contact?service=website-development");
  await expect(page.locator(".verendo-intro")).toHaveCount(0);
  await expect(page.locator('[name="service"]')).toHaveValue(
    "website-development",
  );
  const budgets = await page
    .locator('[name="budget"] option')
    .evaluateAll((options) =>
      options
        .map((option) => (option as HTMLOptionElement).value)
        .filter(Boolean),
    );
  expect(budgets).toEqual(["$5k", "$10k", "$15k", "$20k+"]);
  async function fill() {
    await page.getByLabel("Your name", { exact: true }).fill("QA Visitor");
    await page.getByLabel("Email", { exact: true }).fill("qa@example.com");
    await page.getByLabel("Business name", { exact: true }).fill("QA Business");
    await page.locator('[name="service"]').selectOption("website-development");
    await page.locator('[name="budget"]').selectOption("$10k");
    await page
      .locator('[name="message"]')
      .fill("Testing the website contact submission flow.");
  }
  await fill();
  await page.getByRole("button", { name: "Send project details" }).click();
  await expect(page.locator(".contact-form .form-status")).toHaveAttribute(
    "data-state",
    "success",
  );
  await expect(page.locator('[name="name"]')).toHaveValue("");
  await expect(page.locator('[name="budget"]')).toHaveValue("");
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Please try again." }),
    }),
  );
  await fill();
  await page.getByRole("button", { name: "Send project details" }).click();
  await expect(page.locator(".contact-form .form-status")).toHaveAttribute(
    "data-state",
    "error",
  );
  await expect(page.locator('[name="name"]')).toHaveValue("QA Visitor");
});

test("normal internal navigation does not replay the opening logo", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".verendo-intro")).toHaveCount(0);
  await page
    .locator(".hero-actions")
    .getByRole("link", { name: "Explore our services" })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator(".verendo-intro")).toHaveCount(0);
  await expect(page.locator("h1")).toBeVisible();
});

test("every page renders with no horizontal overflow", async ({
  page,
}, testInfo) => {
  test.skip(
    ![
      "desktop-chromium",
      "iphone-webkit",
      "android-412",
      "ipad-webkit",
    ].includes(testInfo.project.name),
  );
  test.setTimeout(180000);
  for (const route of routeExpectations.pages) {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      route.path,
    ).toBe(true);
  }
});

test("reduced motion still exposes all content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".process-mobile-card")).toHaveCount(4);
  await expect(page.locator(".friction-badge")).toHaveCount(4);
  await expect(page.locator(".difference-card")).toHaveCount(2);
  for (const card of await page.locator(".difference-card").all()) {
    await card.scrollIntoViewIfNeeded();
    await readable(card);
  }
});
