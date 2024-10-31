import { test, expect } from './fixtures';

import { selectSignInWallet } from './utils/sphere-testnet/common';
import { createMetamaskWallet } from './utils/metamaskExtension';

test('Should not be able to buy NFTs with insufficient funds', async ({ page }) => {
  const password = `Beam-${Date.now()}!`

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await selectSignInWallet({ page, wallet: 'MetaMask' });

  const metamaskPage = page.context().pages()[1]
  await createMetamaskWallet({ page: metamaskPage, password, secureWhen: 'later' })
});
