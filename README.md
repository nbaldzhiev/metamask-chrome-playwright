# Sphere market <> Metamask wallet

A repository containing a small Playwright (TS) project for working with a
Chrome extension - Metamask wallet.

The project contains a single test where the Sphere market is signed into using
a newly created Metamask wallet (used as a Chrome extension).

## Installation & running the test

    $ pnpm install
    $ pnpm test

## Known issues/limitations

Playwright's support for browser extensions is not greated, currently only
possible with the Chrome browser - https://playwright.dev/docs/chrome-extensions.

A known issue that has been observed with this project is that, sometimes, a
second Metamask extension page gets opened, instead of only one. This messes up the
interactions with the extension and fails the test. So far, I have not identified
why this happens (when it does), so it is currently treated as a known issue
pending to be resolved.
