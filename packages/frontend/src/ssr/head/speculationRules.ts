const FILE_EXTENSIONS = [
  'md',
  'txt',
  'xml',
  'json',
  'csv',
  'pdf',
  'zip',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'svg',
  'ico',
]

/** URL patterns of same-origin links that are not pages. */
export const NOT_PAGES = [
  '/api{/*}?',
  '/static/*',
  ...FILE_EXTENSIONS.map((ext) => `/*.${ext}`),
]

/**
 * Lets Chromium prerender a page while the pointer rests on a link to it
 * ("moderate": 200 ms on desktop; on mobile, links near the last tap once
 * scrolling stops): it loads, runs its JS and hydrates in a hidden tab, so the
 * click swaps in a page that is already interactive. Hydration is 150–900 ms
 * of main-thread work per page, which a prefetch of the HTML still left to
 * the click. Others ignore the script.
 *
 * - Pages come from the Cloudflare cache, which serves speculative requests
 *   like any other, so the origin sees one only on a miss.
 * - Side effects that must count real visits only (analytics, "recently
 *   viewed") wait for the page to be shown: see `whenPageShown`.
 * - The prefetch rule is the fallback when Chrome won't prerender (Save-Data,
 *   low memory, a full prerender quota), so the click still skips the network.
 */
export const speculationRules = {
  prerender: [{ where: pageLinks(), eagerness: 'moderate' }],
  prefetch: [{ where: pageLinks(), eagerness: 'moderate' }],
}

function pageLinks() {
  return {
    and: [
      // Resolved against the page's URL, so it matches only this origin.
      { href_matches: '/*' },
      { not: { href_matches: NOT_PAGES } },
      { not: { selector_matches: '[download], [target="_blank"]' } },
    ],
  }
}
