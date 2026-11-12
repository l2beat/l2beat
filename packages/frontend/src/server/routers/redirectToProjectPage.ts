import type { Request, Response } from 'express'

/**
 * A day, not forever: browsers keep a 301 without it indefinitely, which is
 * what made `?migration=1` necessary.
 */
const CACHE_CONTROL = 'public, max-age=86400'

/**
 * Sends an old project URL to its page for good, with the query string kept.
 * `path` is the page's path, without a query string.
 */
export function redirectToProjectPage(
  req: Request,
  res: Response,
  path: string,
  options: { addQuery?: Record<string, string>; hash?: string } = {},
) {
  const search = new URL(req.originalUrl, 'http://x').searchParams
  for (const [key, value] of Object.entries(options.addQuery ?? {})) {
    search.set(key, value)
  }
  const query = search.size > 0 ? `?${search}` : ''
  res.setHeader('Cache-Control', CACHE_CONTROL)
  res.redirect(301, `${path}${query}${options.hash ?? ''}`)
}
