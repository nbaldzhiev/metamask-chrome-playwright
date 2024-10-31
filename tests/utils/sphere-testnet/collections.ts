/** This module contains functions for working with Collections */
import { Page, expect } from "@playwright/test"

/**
 * Opens a collection by searching for it via the search input bar.
 * @param collectionName The name of the collection to search for
 * @param description The description (can be partial) of the collection to verify that the correct one was opened
 */
export async function openCollectionViaSearchBar(
  { page, collectionName, description }: { page: Page, collectionName: string, description: string }
) {
  await page.locator('input[placeholder="Search"]').fill(collectionName)
  await expect(page.locator('input[placeholder="Search"]')).toHaveValue(collectionName)

  await page.locator('a[data-testid="autocomplete-hit"]', { hasText: collectionName }).click()
  await expect(page.locator('p', { hasText: description })).toBeVisible()
}
