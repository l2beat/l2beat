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
 * Speculation rules for links between pages of the site, so that following
 * one feels instant in Chromium browsers. Others ignore the script.
 *
 * - Prefetch on hover ("moderate": 200 ms on desktop; on mobile, links near
 *   the last tap once scrolling stops). Pages are served from the Cloudflare
 *   cache, so fetching HTML that is never shown costs the origin nothing.
 *   Chrome keeps the response in memory for the navigation, so the page's
 *   `max-age=0` does not make it unusable.
 * - Prerender on pointerdown ("conservative"), which reuses the prefetched
 *   HTML. A press is followed by the click ~100 ms later almost every time,
 *   so the page's JS and tRPC calls run once per visit, only earlier.
 *   Prerendering on hover would run them for links the visitor only passes
 *   over.
 *
 * Code with side effects that must count only real visits waits for
 * activation: see `onPageActivated`.
 */
export const speculationRules = {
  prefetch: [{ where: pageLinks(), eagerness: 'moderate' }],
  prerender: [{ where: pageLinks(), eagerness: 'conservative' }],
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
