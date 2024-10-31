import { test } from './fixtures';
import playwrightConfig from '../playwright.config';

import { selectSignInWallet, verifySignedInAccount } from './utils/sphere-testnet/common';
import {
  allowSiteToAddNetwork,
  confirmSignatureRequest,
  connectSiteWithMetamask,
  createMetamaskWallet
} from './utils/metamaskExtension';
import { getMetamaskPage } from './utils/generic';
import {
  assertCheckoutInsufficientFundsIsVisible,
  buyNowCollectionNFTItem,
  openCollectionNFTItem,
  openCollectionViaSearchBar
} from './utils/sphere-testnet/collections';

const networkInfo = {
  url: 'https://build.onbeam.com/rpc/testnet',
  name: 'Beam Testnet',
  chainId: 13337,
  requestingAs: 'testnet.sphere.market'
}
const collection = {
  name: 'Rumble Arcade Testnet',
  description: 'A unique PvP squad-battler for mobile & PC.',
  nftItem: 'Javelina Rank 2'
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

  const metamaskPage = await getMetamaskPage(page.context());

  await test.step('Create a new MetaMask wallet via the Metamask Chromium extension', async () => {
    await createMetamaskWallet({ page: metamaskPage, password, secureWhen: 'later' });
  });

  await test.step('Connect the Sphere testnet with the Metamask wallet', async () => {
    await connectSiteWithMetamask({ page: metamaskPage, siteUrl: playwrightConfig!.use!.baseURL as string });
  });

  await test.step('Allow the Sphere network to be added to the Metamask wallet', async () => {
    await allowSiteToAddNetwork(
      { page: metamaskPage, networkUrl: networkInfo.url, networkName: networkInfo.name, chainId: networkInfo.chainId }
    );
  })

  await test.step('Request account verification from Sphere', async () => {
    await page.locator('[data-testid="connect-wallet-modal-body"] button', { hasText: 'Verify' }).click()
  });

  await test.step('Confirm the account verification request in the Metamask wallet', async () => {
    await confirmSignatureRequest({ page: metamaskPage, requester: networkInfo.requestingAs });
  })

  await test.step('Verify that the sign in to Sphere has been successful', async () => {
    await verifySignedInAccount(page);
  })

  await test.step('Open a NFT collection via the search bar', async () => {
    await openCollectionViaSearchBar(
      { page, collectionName: collection.name, description: collection.description }
    );
  })

  await test.step('Open a specific NFT item from the collection', async () => {
    await openCollectionNFTItem({ page, itemName: collection.nftItem });
  })

  await test.step('Attempt to buy the NFT item with insufficient funds', async () => {
    await buyNowCollectionNFTItem({ page, itemName: collection.nftItem });
    await assertCheckoutInsufficientFundsIsVisible(page);
  })
});
