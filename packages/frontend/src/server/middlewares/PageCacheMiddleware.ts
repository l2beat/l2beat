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
 * Marks successfully rendered pages as edge-cacheable. The header is decided
 * when the response headers are written, so only 200 responses to GET/HEAD
 * get it: 404s (unknown slug or unknown path), redirects and errors are never
 * cached. A route that sets its own Cache-Control (e.g. "/") keeps it.
 */
export function PageCacheMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next()
      return
    }
    const writeHead = res.writeHead
    res.writeHead = function (this: Response, ...args: unknown[]) {
      const statusCode = typeof args[0] === 'number' ? args[0] : res.statusCode
      if (statusCode === 200 && !res.getHeader('Cache-Control')) {
        res.setHeader('Cache-Control', PAGE_CACHE_CONTROL)
      }
      return writeHead.apply(this, args as Parameters<typeof writeHead>)
    } as typeof res.writeHead
    next()
  }
}
