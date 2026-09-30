import type { NextFunction, Request, Response } from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { PAGE_CACHE_CONTROL } from '~/server/middlewares/PageCacheMiddleware'

/** Resolves to undefined when the page does not exist. */
export type MarkdownSource<P> = (req: Request<P>) => Promise<string | undefined>

/** Handles `GET {page}.md`: the page as markdown, for agents that cannot negotiate by header. */
export function serveMarkdown<P>(getMarkdown: MarkdownSource<P>) {
  return async (req: Request<P>, res: Response) => {
    sendMarkdownDocument(res, await getMarkdown(req))
  }
}

/**
 * Put before the HTML handler of a page: requests whose Accept header prefers
 * text/markdown get the markdown, the rest fall through to the HTML.
 */
export function serveMarkdownIfPreferred<P>(getMarkdown: MarkdownSource<P>) {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    res.vary('Accept')
    if (!prefersMarkdown(req)) {
      next()
      return
    }
    const markdown = await getMarkdown(req)
    // The page cache is keyed by URL alone (Cloudflare ignores Vary), so a
    // cached markdown response would be served to browsers. The Link header
    // is left as LlmsLinkHeaderMiddleware set it for the page URL.
    res
      .status(markdown === undefined ? 404 : 200)
      .header('Cache-Control', 'private, no-store')
      .header('Content-Type', MARKDOWN_CONTENT_TYPE)
      .send(markdown ?? NOT_FOUND_MARKDOWN)
  }
}

/**
 * The response of every `.md` URL, so they all carry the same headers. The
 * `.md` routes are reached by different middleware chains (some are mounted
 * before the page cache and the Link header middlewares), hence set here.
 */
export function sendMarkdownDocument(
  res: Response,
  markdown: string | undefined,
) {
  if (markdown === undefined) {
    // A 404 must not be edge-cached, same as the HTML not-found page.
    res.removeHeader('Cache-Control')
  } else {
    res.header('Cache-Control', PAGE_CACHE_CONTROL)
  }
  res
    .status(markdown === undefined ? 404 : 200)
    .header('Content-Type', MARKDOWN_CONTENT_TYPE)
    .header('Link', LLMS_TXT_LINK)
    .send(markdown ?? NOT_FOUND_MARKDOWN)
}

// Not text/markdown: ChatGPT's fetcher answers 400 Unsupported content-type to ours.
export const MARKDOWN_CONTENT_TYPE = 'text/plain; charset=utf-8'

/** The link relation the llms.txt spec recommends for pointing at it. */
export const LLMS_TXT_LINK = `<${PRODUCTION_ORIGIN}/llms.txt>; rel="describedby"`

/** Browsers and clients without a preference (wildcard or no Accept) get HTML, the first listed type. */
function prefersMarkdown(req: Request<unknown>) {
  return req.accepts(['text/html', 'text/markdown']) === 'text/markdown'
}

const NOT_FOUND_MARKDOWN = '# Not found\n'
