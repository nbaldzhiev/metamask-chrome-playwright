import { BrowserContext, Page } from "@playwright/test"

export const sphereNetworkInfo = {
  url: 'https://build.onbeam.com/rpc/testnet',
  name: 'Beam Testnet',
  chainId: 13337,
  requestingAs: 'testnet.sphere.market'
}

/** Waits for the Metamask extension page to be opened & loaded */
export async function waitForMetamaskPage (
  { context, attempts = 15, interval = 1_000 }:
  { context: BrowserContext, attempts?: number, interval?: number }
): Promise<Page | undefined> {
  for (let i = 0; i < attempts; i++) {
    for (const page of context.pages()) {
      await page.waitForLoadState()
      if (await page.title() === 'MetaMask') {
        await page.waitForLoadState() // wait for loadState again in case the page reloaded from blank to metamask
        return page
      }
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
}
