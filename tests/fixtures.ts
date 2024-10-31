import path from 'path';

import { test as base, chromium, type BrowserContext } from '@playwright/test';

const metamaskExtensionPath = path.join(__dirname, 'metamask-extension');

// for reference - https://playwright.dev/docs/chrome-extensions
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskExtensionPath}`,
        `--load-extension=${metamaskExtensionPath}`,
      ],
    });

    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;