# Sphere market <> Metamask wallet

A repository containing a small Playwright (TS) project for working with a
Chrome extension - Metamask wallet.

The project contains a single test where the Sphere market is signed into using
a newly created Metamask wallet (used as a Chrome extension).

## Installation & running the test

    $ pnpm install
    $ pnpm install:chromium
    $ pnpm test

## Known issues/limitations

Playwright's support for browser extensions is not great, currently only
possible with the Chrome browser - https://playwright.dev/docs/chrome-extensions.

This project is completed only using Playwright, without 3rd party tools.

A really unpleasant issue that I've observed is the arbitrary number of pages
that get automatically opened upon initialisation - sometimes 2, other times 3.
I haven't investigated long enough why that happens, but the function 
`waitForMetamaskPage` that I created seems stable enough & works well regardless of this issue.