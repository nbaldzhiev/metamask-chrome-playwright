import { test, expect } from './fixtures';

import { selectSignInWallet } from './utils/sphere-testnet/common';
import { createMetamaskWallet } from './utils/metamaskExtension';

test('Should not be able to buy NFTs with insufficient funds', async ({ page }) => {
  const password = `Beam-${Date.now()}!`

  await test.step('Open the Sphere testnets page', async () => {
    // the page seems to load indefinitely, hence the waitUntil: 'domcontentloaded' instead of 'load'
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  await test.step('Select MetaMask as the Sign In wallet', async () => {
    await selectSignInWallet({ page, wallet: 'MetaMask' });
  });

  const metamaskPage = page.context().pages()[1]

  await test.step('Create a new MetaMask wallet via the Metamask Chromium extension', async () => {
    await createMetamaskWallet({ page: metamaskPage, password, secureWhen: 'later' })
  });
});
