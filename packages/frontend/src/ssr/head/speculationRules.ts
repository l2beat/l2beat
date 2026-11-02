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
 * Lets Chromium fetch a page's HTML while the pointer rests on a link to it
 * ("moderate": 200 ms on desktop; on mobile, links near the last tap once
 * scrolling stops), so the click doesn't wait for the network. Others ignore
 * the script.
 *
 * - Only the HTML: no script runs, so neither analytics nor tRPC see a
 *   prefetch. Pages come from the Cloudflare cache, which serves prefetches
 *   like any other request, so the origin sees one only on a miss.
 * - Chrome keeps the response in memory for the navigation, so the page's
 *   `max-age=0` doesn't make it unusable.
 * - No prerendering: on top of this prefetch it measured no faster, while it
 *   would run every page's JS and tRPC calls for links that are never
 *   followed.
 */
export const speculationRules = {
  prefetch: [
    {
      where: {
        and: [
          // Resolved against the page's URL, so it matches only this origin.
          { href_matches: '/*' },
          { not: { href_matches: NOT_PAGES } },
          { not: { selector_matches: '[download], [target="_blank"]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
}
