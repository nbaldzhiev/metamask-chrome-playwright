import { BrowserContext, Page, expect } from "@playwright/test"

export const sphereNetworkInfo = {
  url: 'https://build.onbeam.com/rpc/testnet',
  name: 'Beam Testnet',
  chainId: 13337,
  requestingAs: 'testnet.sphere.market'
}

/** Returns the page, if such exist, from a BrowserContext's list of pages */
export async function getMetamaskPage (context: BrowserContext): Promise<Page> {
  let metamaskPage : Page | undefined
  for (const page of context.pages()) {
    if (await page.title() === 'MetaMask') {
      metamaskPage = page
      break
    }
  }
  expect(metamaskPage).toBeDefined()

  return metamaskPage!
}
