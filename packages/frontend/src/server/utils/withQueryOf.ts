import type { Request } from 'express'

/**
 * The redirect target with the request's query string carried over, so old
 * links keep their filters and campaign parameters. The path stays fixed, so
 * the user-provided part can only ever be a query.
 */
export function withQueryOf(req: Request, path: string) {
  const queryStart = req.originalUrl.indexOf('?')
  return queryStart === -1 ? path : path + req.originalUrl.slice(queryStart)
}
