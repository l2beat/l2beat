/**
 * Size budgets for server-rendered pages, measured against the mock server
 * (`pnpm start:mock`). The single budgeted metric is uncompressed HTML: it
 * is what the browser parses and React hydrates, it includes the inline SSR
 * data, and compression would hide exactly the duplicated objects that cause
 * regressions. The failure message still reports SSR data size, brotli wire
 * size and the largest SSR props keys for diagnosis.
 *
 * Config-driven pages (project pages, zk-catalog, tvs breakdown) serialize
 * the same data as production, so mock sizes match production within a few
 * KB. DB-driven pages (home, charts, interop) are smaller in mock mode because
 * chart data is synthetic; their budgets guard the code path, not the
 * production number. Run with BASE_URL=https://l2beat.com to measure
 * production instead.
 *
 * Budgets are ~25-30% above the size measured when they were set (main at
 * a35dcf63dd, 2026-09-16), so a doubled or duplicated payload fails while
 * normal config growth passes. Lower the budget when you shrink a page; raise
 * it only with a reason.
 */

/** Uncompressed response body, in bytes. */
export type SizeBudget = number

const KB = 1024

function budget(htmlKb: number): SizeBudget {
  return htmlKb * KB
}

/** Representative pages with tight budgets, in KB of uncompressed HTML. */
export const PAGE_BUDGETS: Record<string, SizeBudget> = {
  '/': budget(650),
  '/layer2s/summary': budget(1200),
  '/layer2s/activity': budget(1250),
  '/layer2s/risk': budget(800),
  '/layer2s/tvs': budget(750),
  '/layer2s/costs': budget(500),
  '/layer2s/archived': budget(1650),
  '/data-availability/summary': budget(300),
  '/interop/token-frameworks': budget(450),
  // The three protocol-type pages ship every protocol (~755K) for one view.
  '/interop/lock-and-mint': budget(1050),
  '/interop/burn-and-mint': budget(1050),
  '/interop/non-minting': budget(1050),
  '/privacy/summary': budget(400),
  '/zk-catalog': budget(480),
  '/glossary': budget(450),
  '/ecosystems/superchain': budget(900),
  '/layer2s/projects/arbitrum': budget(1750),
  '/layer2s/projects/base': budget(2050),
  '/layer2s/projects/arbitrum/tvs-breakdown': budget(3500),
  '/data-availability/projects/ethereum/ethereum': budget(320),
  '/privacy/projects/tornado-cash': budget(530),
  '/defi/projects/liquityv2': budget(530),
  '/zk-catalog/stone': budget(400),

  // Known oversized pages, pinned at current size + ~10% so they cannot grow
  // further. Root causes:
  // - starknet / stwo: verifier `usedIn` entries embed whole project objects
  //   (contracts, permissions...) instead of id/name/slug, and L2 pages emit
  //   the programHashes section twice.
  // - /layer2s/tvs/breakdown: renders every token row server-side (~17 MB in
  //   production).
  // Lower these once fixed.
  '/layer2s/projects/starknet': budget(4000),
  '/zk-catalog/stwo': budget(1750),
  '/layer2s/tvs/breakdown': budget(16500),
}

export interface CategoryBudget {
  name: string
  matches: (url: string) => boolean
  budget: SizeBudget
}

/**
 * Ceilings for the sweep over every configured page. These catch a new or
 * changed project whose config blows up its page, so they sit just above the
 * heaviest page in each category rather than the typical one. Tighten them
 * as the known offenders above are fixed.
 */
export const CATEGORY_BUDGETS: CategoryBudget[] = [
  {
    name: 'scaling project tvs breakdown',
    matches: (url) => /^\/layer2s\/projects\/[^/]+\/tvs-breakdown$/.test(url),
    budget: budget(2500),
  },
  {
    name: 'scaling project',
    matches: (url) => /^\/layer2s\/projects\/[^/]+$/.test(url),
    budget: budget(3400),
  },
  {
    name: 'zk-catalog project',
    matches: (url) => /^\/zk-catalog\/[^/]+$/.test(url),
    budget: budget(1500),
  },
  {
    name: 'data availability project',
    matches: (url) => url.startsWith('/data-availability/projects/'),
    budget: budget(500),
  },
  {
    name: 'privacy project',
    matches: (url) => url.startsWith('/privacy/projects/'),
    budget: budget(1300),
  },
  {
    name: 'defi project',
    matches: (url) => url.startsWith('/defi/projects/'),
    budget: budget(1100),
  },
  {
    name: 'ecosystem',
    matches: (url) => url.startsWith('/ecosystems/'),
    budget: budget(800),
  },
  {
    name: 'publication',
    matches: (url) => /^\/publications\/[^/]+$/.test(url),
    budget: budget(400),
  },
  {
    name: 'top-level page',
    matches: () => true,
    budget: budget(900),
  },
]

export function resolveBudget(url: string): {
  name: string
  budget: SizeBudget
} {
  const pageBudget = PAGE_BUDGETS[url]
  if (pageBudget) {
    return { name: 'page budget', budget: pageBudget }
  }
  const category = CATEGORY_BUDGETS.find((c) => c.matches(url))
  if (!category) {
    throw new Error(`No size budget category matches ${url}`)
  }
  return { name: category.name, budget: category.budget }
}
