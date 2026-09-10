import { expect, test } from "@playwright/test";

test("renders the Romanian homepage copy", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await expect(page.getByText("Servicii și produse", { exact: true })).toBeVisible();
  await expect(page.getByText("Echipa noastră", { exact: true })).toBeVisible();
  await expect(page.getByText("Portofoliu", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("tab", { name: "Articole", exact: true })).toBeVisible();
  await expect(
    page.getByText("O poveste despre date și Premiul Nobel", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator(".portfolio-card-more").first()).toHaveText(/MAI MULTE DETALII/);
  await expect(
    page.locator('#portfolio [data-tab-panel="portfolio"] [data-carousel-prev]').first(),
  ).toHaveText("Anterior");
  await expect(page.getByPlaceholder("Numele tău", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Schimbă limba în engleză", exact: true })).toBeVisible();
  await expect(
    page.getByText("Mărturiile au fost traduse din limba engleză.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Afișează pagina 1 de mărturii", exact: true }),
  ).toBeVisible();
});

test("renders Romanian work navigation labels", async ({ page }) => {
  await page.goto("/portfolio/btr-business-case-study/");

  const pager = page.getByRole("navigation", { name: "Navigare între articole" });
  await expect(pager.getByRole("link", { name: "Anterior", exact: true })).toBeVisible();
  await expect(pager.getByRole("link", { name: "Următor", exact: true })).toBeVisible();

  const zoom = page.getByRole("navigation", { name: "Nivel de detaliu" });
  await expect(zoom.getByRole("button", { name: "Mai puține detalii" })).toBeVisible();
  await expect(zoom.getByRole("button", { name: "Mai multe detalii" })).toBeVisible();
});
