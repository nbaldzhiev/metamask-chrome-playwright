/** This module contains utility functions for operating with a Metamask extension (in chromium) */
import { Page, expect } from '@playwright/test';

/**
 * Createsa a new Metamask wallet. The starting point of the process is the Metamask welcome screen, so the function
 * should be called on that screen. 
 *
 * @param password The password to be used for the wallet
 * @param secureWhen When to secure the wallet. If 'now', the wallet will be secured immediately, otherwise it will be
 * created non-secured
 */
export async function createMetamaskWallet (
  { page, password, secureWhen }: { page: Page, password: string, secureWhen: 'later' | 'now' }
) {
  // pass the initial screen
  await page.getByTestId('onboarding-terms-checkbox').click();
  await expect(page.getByTestId('onboarding-terms-checkbox')).toHaveClass(new RegExp('.*check-box__checked.*'));
  await page.getByTestId('onboarding-create-wallet').click();
  await page.getByTestId('metametrics-i-agree').click();

  // create a new password
  await page.getByTestId('create-password-new').fill(password);
  await page.getByTestId('create-password-confirm').fill(password);
  await page.getByTestId('create-password-terms').click();
  await expect(page.getByTestId('create-password-terms')).toHaveClass(new RegExp('.*mm-checkbox__input--checked.*'));
  await page.getByTestId('create-password-wallet').click();

  // secure the wallet
  if (secureWhen === 'now') {
    // TODO: Implement when needed
    new Error('Not implemented')
  } else {
    await page.getByTestId('secure-wallet-later').click()
    await page.locator('.popover-container [data-testid="skip-srp-backup-popover-checkbox"]').click();
    await expect(
      page.locator('.popover-container [data-testid="skip-srp-backup-popover-checkbox"]')
    ).toHaveClass(new RegExp('.*check-box__checked.*'))
    await page.locator('.popover-container [data-testid="skip-srp-backup"]').click();
  }

  // finalise wallet creation
  await expect(page.locator('h2', { hasText: 'Wallet creation successful' })).toBeVisible();
  await page.getByTestId('onboarding-complete-done').click();
  await expect(page.locator('h2', { hasText: 'Your MetaMask install is complete!' })).toBeVisible();
  await page.getByTestId('pin-extension-next').click();
  await page.getByTestId('pin-extension-done').click();

  await expect(page.getByTestId('pin-extension-done')).toBeHidden();
}

/**
 * Completes the process of connecting a site with Metamask. The starting point of the process is the "Connect with
 * Metamask" screen, so the function should be called on that screen.
 *
 * @param siteUrl The URL of the site requesting the connection
 */
export async function connectSiteWithMetamask ({ page, siteUrl }: { page: Page, siteUrl: string }) {
  await expect(page.locator('h3', { hasText: 'Connect with MetaMask' })).toBeVisible()
  await expect(page.locator('p', { hasText: siteUrl })).toBeVisible()
  // TODO: Verify the listed account as well
  await page.getByTestId('page-container-footer-next').click()

  await expect(page.locator('h3', { hasText: 'Permissions' })).toBeVisible()
  await page.getByTestId('page-container-footer-next').click()
}

/**
 * Completes the process of allowing a site to add a network to Metamask. The starting point of the process is the
 * "Allow this site to add a network?" screen, so the function should be called on that screen.
 *
 * @param networkUrl The URL of the network to be added
 * @param networkName The name of the network to be added
 * @param chainId The chain ID of the network to be added 
 */
export async function allowSiteToAddNetwork (
  { page, networkUrl, networkName, chainId }: { page: Page, networkUrl: string, networkName: string, chainId: number }
) {
  await expect(page.locator('h3', { hasText: 'Allow this site to add a network?' })).toBeVisible()
  await expect(page.locator('dd', { hasText: networkUrl })).toBeVisible()
  await expect(page.locator('dd', { hasText: chainId.toString() })).toBeVisible()
  await page.getByTestId('confirmation-submit-button').click()

  await expect(page.locator('p', { hasText: networkName })).toBeVisible()
  await page.getByTestId('confirmation-submit-button').click()

  await expect(page.locator(`[aria-label="Network Menu ${networkName}"]`)).toBeVisible()
}