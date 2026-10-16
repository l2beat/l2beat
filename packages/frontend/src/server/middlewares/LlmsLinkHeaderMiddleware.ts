import type { NextFunction, Request, Response } from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { LLMS_TXT_LINK } from '~/server/markdown/markdownAlternate'
import { getMarkdownAlternatePath } from '~/utils/getMarkdownAlternatePath'

/**
 * Tells agents where the site's llms.txt is and, for pages that have one,
 * where the markdown version lives, via the link relations the llms.txt spec
 * recommends. Applied to extension-less paths only, so assets are untouched.
 */
export function LlmsLinkHeaderMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isPageRequest(req) && !hasExtension(req.path)) {
      res.header('Link', getLinkHeader(req.path))
      dropAlternateFromErrorResponses(res)
    }
    next()
  }
}

export function getLinkHeader(path: string): string {
  const links = [LLMS_TXT_LINK]
  const alternate = getMarkdownAlternatePath(path)
  if (alternate) {
    links.unshift(
      `<${PRODUCTION_ORIGIN}${alternate}>; rel="alternate"; type="text/markdown"`,
    )
  }
  return links.join(', ')
}

/**
 * The alternate is derived from the URL, before any handler ran. Whether the
 * page exists is known only once the status is, so an error response loses
 * the alternate as it is sent: it would point agents at another 404. Done
 * here rather than by each handler that can answer with an error; like
 * `SafeSendHandler`, it hooks `send`, which every page and error response
 * goes through.
 */
function dropAlternateFromErrorResponses(res: Response) {
  const send = res.send.bind(res)
  res.send = (body) => {
    if (res.statusCode >= 400) res.setHeader('Link', LLMS_TXT_LINK)
    return send(body)
  }
}

function isPageRequest(req: Request) {
  return req.method === 'GET' || req.method === 'HEAD'
}

function hasExtension(path: string) {
  return /\.[a-z0-9]+$/i.test(path)
}
