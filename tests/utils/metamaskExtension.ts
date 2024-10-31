/** This module contains utility functions for operating with a Metamask extension (in chromium) */
import { Page, expect } from '@playwright/test';

/**
 * Createsa a new Metamask wallet. The starting point of the process is the Metamask welcome screen, so the function
 * should be called at this moment.
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
