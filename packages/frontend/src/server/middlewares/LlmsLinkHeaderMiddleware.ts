import type { NextFunction, Request, Response } from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { getMarkdownAlternatePath } from '~/server/routers/MarkdownAlternatesRouter'

/**
 * Tells agents where the site's llms.txt is and, for pages that have one,
 * where the markdown version lives, via the link relations the llms.txt spec
 * recommends. Applied to extension-less paths only, so assets are untouched.
 */
export function LlmsLinkHeaderMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isPageRequest(req) && !hasExtension(req.path)) {
      res.header('Link', getLinkHeader(req.path))
    }
    next()
  }
}

export function getLinkHeader(path: string): string {
  const links = [`<${PRODUCTION_ORIGIN}/llms.txt>; rel="describedby"`]
  const alternate = getMarkdownAlternatePath(path)
  if (alternate) {
    links.unshift(
      `<${PRODUCTION_ORIGIN}${alternate}>; rel="alternate"; type="text/markdown"`,
    )
  }
  return links.join(', ')
}

function isPageRequest(req: Request) {
  return req.method === 'GET' || req.method === 'HEAD'
}

function hasExtension(path: string) {
  return /\.[a-z0-9]+$/i.test(path)
}
