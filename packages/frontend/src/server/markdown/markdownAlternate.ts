import type { NextFunction, Request, Response } from 'express'

/** Resolves to undefined when the page does not exist. */
export type MarkdownSource<P> = (req: Request<P>) => Promise<string | undefined>

/** Handles `GET {page}.md`: the page as markdown, for agents that cannot negotiate by header. */
export function serveMarkdown<P>(getMarkdown: MarkdownSource<P>) {
  return async (req: Request<P>, res: Response) => {
    const markdown = await getMarkdown(req)
    res
      .status(markdown === undefined ? 404 : 200)
      .header('Content-Type', 'text/markdown; charset=utf-8')
      .send(markdown ?? NOT_FOUND_MARKDOWN)
  }
}

/**
 * Put before the HTML handler of a page: requests whose Accept header prefers
 * text/markdown get the markdown, the rest fall through to the HTML.
 */
export function serveMarkdownIfPreferred<P>(getMarkdown: MarkdownSource<P>) {
  const sendMarkdown = serveMarkdown(getMarkdown)
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    res.vary('Accept')
    if (!prefersMarkdown(req)) {
      next()
      return
    }
    // The page cache is keyed by URL alone (Cloudflare ignores Vary), so a
    // cached markdown response would be served to browsers.
    res.set('Cache-Control', 'private, no-store')
    await sendMarkdown(req, res)
  }
}

/** Browsers and clients without a preference (wildcard or no Accept) get HTML, the first listed type. */
function prefersMarkdown(req: Request<unknown>) {
  return req.accepts(['text/html', 'text/markdown']) === 'text/markdown'
}

const NOT_FOUND_MARKDOWN = '# Not found\n'
