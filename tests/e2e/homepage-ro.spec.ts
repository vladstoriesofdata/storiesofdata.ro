import { expect, test } from "@playwright/test";

test("renders the Romanian homepage copy", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await expect(page.getByText("Servicii și produse", { exact: true })).toBeVisible();
  await expect(page.getByText("Echipa noastră", { exact: true })).toBeVisible();
  await expect(page.getByText("Portofoliu", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("Mărturiile au fost traduse din limba engleză.", { exact: true }),
  ).toBeVisible();
});
