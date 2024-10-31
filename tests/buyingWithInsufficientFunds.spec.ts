import { Page, expect as oobExpect } from '@playwright/test';
import { test, expect } from './fixtures';
import playwrightConfig from '../playwright.config';

import { selectSignInWallet } from './utils/sphere-testnet/common';
import { allowSiteToAddNetwork, confirmSignatureRequest, connectSiteWithMetamask, createMetamaskWallet } from './utils/metamaskExtension';

const networkInfo = {
  url: 'https://build.onbeam.com/rpc/testnet',
  name: 'Beam Testnet',
  chainId: 13337,
  requestingAs: 'testnet.sphere.market'
}

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

  await test.step('Allow the Sphere network to be added to the Metamask wallet', async () => {
    await allowSiteToAddNetwork(
      { page: metamaskPage!, networkUrl: networkInfo.url, networkName: networkInfo.name, chainId: networkInfo.chainId }
    );
  })

  await test.step('Request account verification from Sphere', async () => {
    await page.locator('[data-testid="connect-wallet-modal-body"] button', { hasText: 'Verify' }).click()
  });

  await test.step('Confirm the account verification request in the Metamask wallet', async () => {
    await confirmSignatureRequest({ page: metamaskPage!, requester: networkInfo.requestingAs });
  })
});
