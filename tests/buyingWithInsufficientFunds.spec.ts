import { Page, expect as oobExpect } from '@playwright/test';
import { test, expect } from './fixtures';
import playwrightConfig from '../playwright.config';

import { selectSignInWallet } from './utils/sphere-testnet/common';
import { connectSiteWithMetamask, createMetamaskWallet } from './utils/metamaskExtension';

test('Should not be able to buy NFTs with insufficient funds', async ({ page }) => {
  const password = `Beam-${Date.now()}!`

  await test.step('Open the Sphere testnets page', async () => {
    // the page seems to load indefinitely, hence the waitUntil: 'domcontentloaded' instead of 'load'
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  await test.step('Select MetaMask as the Sign In wallet', async () => {
    await selectSignInWallet({ page, wallet: 'MetaMask' });
  });

  // retrieve the Metamask extension page
  let metamaskPage : Page | undefined
  const pages = page.context().pages()
  for (const page_ of pages) {
    if (await page_.title() === 'MetaMask') {
      metamaskPage = page_
      break
    }
  }
  oobExpect(metamaskPage).toBeDefined()

  await test.step('Create a new MetaMask wallet via the Metamask Chromium extension', async () => {
    await createMetamaskWallet({ page: metamaskPage!, password, secureWhen: 'later' });
  });

  await test.step('Connect the Sphere testnet with the Metamask wallet', async () => {
    await connectSiteWithMetamask({ page: metamaskPage!, siteUrl: playwrightConfig!.use!.baseURL as string });
  });

  await page.waitForTimeout(5000)
});
