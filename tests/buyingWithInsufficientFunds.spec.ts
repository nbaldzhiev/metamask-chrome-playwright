import { expect } from '@playwright/test';
import { test } from './fixtures';
import playwrightConfig from '../playwright.config';

import { selectSignInWallet, verifySignedInAccount } from './utils/sphere-testnet/common';
import {
  allowSiteToAddNetwork,
  confirmSignatureRequest,
  connectSiteWithMetamask,
  createMetamaskWallet
} from './utils/metamaskExtension';
import { sphereNetworkInfo, waitForMetamaskPage } from './utils/generic';
import {
  assertCheckoutInsufficientFundsIsVisible,
  buyNowCollectionNFTItem,
  openCollectionNFTItem,
  openCollectionViaSearchBar
} from './utils/sphere-testnet/collections';

const collection = {
  name: 'Rumble Arcade Testnet',
  description: 'A unique PvP squad-battler for mobile & PC.',
  nftItem: 'Javelina Rank 2'
}

test('Should not be able to buy NFTs with insufficient funds', async ({ page }) => {
  const password = `Beam-${Date.now()}!`

  const metamaskPage = await waitForMetamaskPage({ context: page.context() })
  expect(metamaskPage).toBeDefined()

  await test.step('Open the Sphere testnets page and select Metamask as the Sign In wallet', async () => {
    // the page seems to load indefinitely, hence the waitUntil: 'domcontentloaded' instead of 'load'
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await selectSignInWallet({ page, wallet: 'MetaMask' });
  });

  await test.step('Create a new MetaMask wallet via the Metamask Chromium extension', async () => {
    await createMetamaskWallet({ page: metamaskPage!, password, secureWhen: 'later' });
  });

  await test.step('Connect the Sphere testnet with the Metamask wallet & allow the network', async () => {
    await connectSiteWithMetamask({ page: metamaskPage!, siteUrl: playwrightConfig!.use!.baseURL as string });
    await allowSiteToAddNetwork(
      {
        page: metamaskPage!,
        networkUrl: sphereNetworkInfo.url,
        networkName: sphereNetworkInfo.name,
        chainId: sphereNetworkInfo.chainId
      }
    );
  });

  await test.step('Request account verification from Sphere & confirm request in Metamask', async () => {
    await page.locator('[data-testid="connect-wallet-modal-body"] button', { hasText: 'Verify' }).click()
    await confirmSignatureRequest({ page: metamaskPage!, requester: sphereNetworkInfo.requestingAs });
  });

  await test.step('Verify that the sign in to Sphere has been successful', async () => {
    await verifySignedInAccount(page);
  })

  await test.step('Open a NFT collection via the search bar', async () => {
    await openCollectionViaSearchBar(
      { page, collectionName: collection.name, description: collection.description }
    );
  })

  await test.step('Open a specific NFT item from the collection & attempt to buy it with insufficient funds', async () => {
    await openCollectionNFTItem({ page, itemName: collection.nftItem });
    await buyNowCollectionNFTItem({ page, itemName: collection.nftItem });
    await assertCheckoutInsufficientFundsIsVisible(page);
  })
});
