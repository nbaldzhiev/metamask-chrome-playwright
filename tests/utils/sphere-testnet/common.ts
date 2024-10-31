/** This module contains utility functions for common operations on the "sphere testnets" web page */
import { Page, expect } from '@playwright/test';

/**
 * Selects a wallet to sign in with.
 *
 * ⚠️ NOTE: ⚠️ This function only selects the wallet to sign it with. The actual sign in process should be handled by
 * dedicated functions.
 */
export async function selectSignInWallet (
  { page, wallet }: { page: Page, wallet: 'Beam' | 'MetaMask' | 'Coinbase Wallet' | 'WalletConnect' }
) {
  const dialog = page.getByTestId('connect-wallet-modal-content');

  await page.getByTestId('sign-in-button').click();

  await expect(dialog.locator('h2', { hasText: 'Connect your wallet' })).toBeVisible();
  await dialog.locator(`span:has-text("${wallet}") + button`).click();
}

/** Verifies that there is a successfully signed in account by checking the Sign In dialog */
export async function verifySignedInAccount (page: Page) {
  await page.getByTestId('sign-in-button').click()
  await expect(page.locator('[role="dialog"] button', { hasText: 'Disconnect' })).toBeVisible()
  await page.getByTestId('sign-in-button').click()
  await expect(page.locator('[role="dialog"] button', { hasText: 'Disconnect' })).toBeHidden()
}
