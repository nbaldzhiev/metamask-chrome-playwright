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

/** Searches a given collection for a specific NFT item specified by its name */
export async function searchCollectionNFTItem (
  { page, itemName, expResults = 1 }: { page: Page, itemName: string, expResults?: number }
) {
  await page.locator('input[placeholder="Search NFTs"]').fill(itemName)
  await expect(page.locator('[data-testid^="nft-card-beam-testnet"]')).toHaveCount(expResults)
}

/** Searches for and opens a specific NFT item from a collection. */
export async function openCollectionNFTItem ({ page, itemName }: { page: Page, itemName: string }) {
  await searchCollectionNFTItem({ page, itemName })

  await page.locator('[data-testid^="nft-card-beam-testnet"]', { hasText: itemName }).click()

  await expect(page.locator('h1', { hasText: itemName })).toBeVisible()
}

/**
 * Clicks on the "Buy now" button for a given already opened collection NFT item.
 * 
 * ⚠️ NOTE: ⚠️ This function does not complete the checkout; it only clicks the "Buy now" button for a NFT item so that
 * it can be reused in different scenarios - complete checkout, insufficient funds, close checkout, etc.
 */
export async function buyNowCollectionNFTItem ({ page, itemName }: { page: Page, itemName: string }) {
  await page.getByTestId('buy-button-pdp').click()
  await expect(page.locator('div[role="dialog"] span', { hasText: itemName })).toBeVisible()
}

/** Asserts that the "insufficient funds" message is present in the checkout dialog */
export async function assertCheckoutInsufficientFundsIsVisible (page: Page) {
  await expect(
    page.locator('div[role="dialog"] span', { hasText: 'Insufficient Balance, select another token or add funds' })
  ).toBeVisible()
  await expect(page.locator('button', { hasText: 'Add Funds' })).toBeVisible()
}
