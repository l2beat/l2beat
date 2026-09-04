import type { NextFunction, Request, Response } from 'express'

/**
 * Edge (Cloudflare) TTL for SSR pages. Shorter than the FrontendInMemoryCache
 * TTL (5 min) so freshness as seen by users is unchanged.
 */
export const DEFAULT_EDGE_SECONDS = 60

const STALE_WHILE_REVALIDATE_SECONDS = 300
const STALE_IF_ERROR_SECONDS = 3600

/**
 * The Cloudflare cache rule for l2beat.com caches HTML only when the origin
 * sends Cache-Control. Browsers keep revalidating (max-age=0) so a deploy is
 * visible immediately once the edge is purged. The edge serves the old copy
 * while one request refreshes it and keeps the site up if the origin returns
 * 5xx. The edge is purged by a Coolify post-deployment command on the
 * production frontend app, so a new build is visible within seconds.
 */
export function pageCacheControl(edgeSeconds: number): string {
  return `public, max-age=0, s-maxage=${edgeSeconds}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}, stale-if-error=${STALE_IF_ERROR_SECONDS}`
}

export function setPageCacheHeaders(
  res: Response,
  options: { edgeSeconds: number },
) {
  res.set('Cache-Control', pageCacheControl(options.edgeSeconds))
}

/**
 * Sets the default page cache headers on GET and HEAD. Routes that must not
 * be edge-cached (e.g. "/") override Cache-Control later in the chain.
 * Pair with ClearPageCacheMiddleware after the page routes so requests that
 * fall through (e.g. /api/*) leave without the header.
 */
export function PageCacheMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      setPageCacheHeaders(res, { edgeSeconds: DEFAULT_EDGE_SECONDS })
    }
    next()
  }
}

/** Removes the page cache headers from requests no page route handled. */
export function ClearPageCacheMiddleware() {
  return (_: Request, res: Response, next: NextFunction) => {
    res.removeHeader('Cache-Control')
    next()
  }
}
