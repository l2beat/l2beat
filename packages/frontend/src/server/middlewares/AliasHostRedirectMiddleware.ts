import type { NextFunction, Request, Response } from 'express'

/**
 * Sends requests for the listed alias hosts (www and the like) to the same
 * path and query on the canonical origin, so every page has one address for
 * search engines, caches and shared links. Other hosts, such as the direct
 * origin host, are served as they are, and so is the health check.
 */
export function AliasHostRedirectMiddleware(
  canonicalOrigin: string,
  aliasHosts: string[],
) {
  const canonicalHost = new URL(canonicalOrigin).hostname
  const redirectedHosts = new Set(
    aliasHosts
      .map((host) => host.trim().toLowerCase())
      // Redirecting the canonical host to itself would loop.
      .filter((host) => host !== canonicalHost),
  )

  return (req: Request, res: Response, next: NextFunction) => {
    if (
      !redirectedHosts.has(req.hostname.toLowerCase()) ||
      req.path === '/health'
    ) {
      return next()
    }
    // 308 so a redirected POST stays a POST; 301 is what crawlers expect.
    const status = req.method === 'GET' || req.method === 'HEAD' ? 301 : 308
    res.redirect(status, canonicalOrigin + req.originalUrl)
  }
}
