import type { NextFunction, Request, Response } from 'express'

/**
 * The Cloudflare cache rule for l2beat.com caches HTML only when the origin
 * sends Cache-Control. The edge is purged by a Coolify post-deployment command
 * on the production frontend app, so a new build is visible within seconds.
 *
 * - public: any cache, including Cloudflare, may store the response.
 * - max-age=0: browsers revalidate on every use, so a deploy is visible
 *   immediately once the edge is purged.
 * - s-maxage=60: the edge TTL. Shorter than the FrontendInMemoryCache TTL
 *   (5 min), so freshness as seen by users is unchanged.
 * - stale-while-revalidate=300: the edge keeps serving the expired copy for
 *   up to 5 min while a single request refreshes it from the origin.
 * - stale-if-error=3600: the edge keeps serving the expired copy for up to
 *   1 h if the origin returns 5xx, so the site stays up.
 */
const PAGE_CACHE_CONTROL =
  'public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600'

/**
 * Sets the page cache header on GET and HEAD. Routes that must not be
 * edge-cached (e.g. "/") override Cache-Control later in the chain. Pair with
 * ClearPageCacheMiddleware after the page routes so requests that fall through
 * (e.g. /api/*) leave without the header.
 */
export function PageCacheMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      res.set('Cache-Control', PAGE_CACHE_CONTROL)
    }
    next()
  }
}

/** Removes the page cache header from requests no page route handled. */
export function ClearPageCacheMiddleware() {
  return (_: Request, res: Response, next: NextFunction) => {
    res.removeHeader('Cache-Control')
    next()
  }
}
