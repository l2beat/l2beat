# test-prefetches

Verifies that tRPC SSR prefetching works end-to-end across the frontend.

Run with:

```sh
pnpm test-prefetches
```

It builds the app, starts the mock server, and runs two checks per page:

- **Layer 1 — dehydrated state (server).** Fetches each page's HTML, parses
  `window.__SSR_DATA__.props.queryState`, and verifies the page dehydrated the
  procedure paths listed in `pages.ts`, asserting each discovered query has
  `status: 'success'` with non-null data. Catches prefetches that threw, were
  left pending, returned empty data, or disappeared from a page's expected
  prefetch list.
- **Layer 2 — client refetch (browser).** Loads each page in headless Chromium
  and watches `/api/trpc` traffic, feeding in the exact inputs discovered in
  Layer 1:
  - **FAIL** if a prefetched query's *exact* key is requested over the wire —
    hydration failed to serve it (the tRPC-migration regression signal).
  - **WARN** (non-failing) if the same procedure is fetched with a *different*
    input than was prefetched. This is either a wasted prefetch (the view needs
    a different key than the server prefetched) or an unrelated per-item query
    (e.g. a per-cell detail). Both inputs are printed so you can judge.

## Maintaining the list

List **page URLs and expected tRPC procedure paths** in `pages.ts`:

```ts
page('/scaling/tvs', [
  'tvs.detailedChart',
  'tvs.table',
  'tvs.chartStats',
])
```

The checker still discovers the exact inputs from each page's dehydrated state,
so you only maintain procedure paths here. Add a page when it server-side
prefetches tRPC queries. Dynamic pages (one representative ecosystem / privacy
project) are resolved at runtime.

## Notes & limitations

- **Hover prefetches** — `BadgesSection.tsx` and `InitialChainSelector.tsx`
  prefetch on mouseover, not during SSR, so they don't appear in the dehydrated
  state and aren't covered. Verify manually via the Network tab.
- Layer 2 observes initial load plus a scroll to trigger below-the-fold charts.
  Queries gated behind further user interaction are not exercised.
- A WARN cannot, from network traffic alone, distinguish a genuinely wasted
  prefetch from an unrelated same-procedure query — read the printed inputs.
