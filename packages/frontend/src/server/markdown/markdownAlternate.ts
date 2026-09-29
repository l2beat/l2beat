import type { Parser } from '@l2beat/validate'
import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { PAGE_CACHE_CONTROL } from '~/server/middlewares/PageCacheMiddleware'
import type { ProjectPageWithMarkdown } from '~/utils/getMarkdownAlternatePath'
import { validateRoute } from '~/utils/validateRoute'

/**
 * Registers a page together with its markdown version: `{path}.md`, and the
 * page URL itself for requests whose Accept header prefers text/markdown.
 * Owns the route order, so page routers cannot get it wrong.
 */
export function registerPageWithMarkdown<P, Q>(
  router: Router,
  page: {
    path: ProjectPageWithMarkdown
    params: Parser<P>
    query?: Parser<Q>
    /** Resolves to undefined when the page does not exist. */
    getMarkdown: MarkdownSource<P>
    sendHtml: RequestHandler<P, unknown, unknown, Q>
  },
) {
  // Before the page route, which would otherwise take "arbitrum.md" as the slug.
  router.get(
    `${page.path}.md`,
    validateRoute({ params: page.params }),
    serveMarkdownDocument(page.getMarkdown),
  )
  router.get(
    page.path,
    validateRoute({ params: page.params, query: page.query }),
    serveMarkdownIfPreferred<P, Q>(page.getMarkdown),
    page.sendHtml,
  )
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
    .header('Content-Type', MARKDOWN_AS_PLAIN_TEXT)
    .header('Link', LLMS_TXT_LINK)
    .send(markdown ?? NOT_FOUND_MARKDOWN)
}

// Not text/markdown: some agent fetchers (ChatGPT's) reject that type outright.
export const MARKDOWN_AS_PLAIN_TEXT = 'text/plain; charset=utf-8'

/** The link relation the llms.txt spec recommends for pointing at it. */
export const LLMS_TXT_LINK = `<${PRODUCTION_ORIGIN}/llms.txt>; rel="describedby"`

type MarkdownSource<P> = (params: P) => Promise<string | undefined>

function serveMarkdownDocument<P>(
  getMarkdown: MarkdownSource<P>,
): RequestHandler<P> {
  return async (req, res) => {
    sendMarkdownDocument(res, await getMarkdown(req.params))
  }
}

/** Requests whose Accept header prefers text/markdown get the markdown, the rest fall through to the HTML. */
function serveMarkdownIfPreferred<P, Q>(
  getMarkdown: MarkdownSource<P>,
): RequestHandler<P, unknown, unknown, Q> {
  return async (req, res, next: NextFunction) => {
    res.vary('Accept')
    if (!prefersMarkdown(req)) {
      next()
      return
    }
    const markdown = await getMarkdown(req.params)
    // The page cache is keyed by URL alone (Cloudflare ignores Vary), so a
    // cached markdown response would be served to browsers. The Link header
    // is left as LlmsLinkHeaderMiddleware set it for the page URL.
    res
      .status(markdown === undefined ? 404 : 200)
      .header('Cache-Control', 'private, no-store')
      .header('Content-Type', NEGOTIATED_MARKDOWN)
      .send(markdown ?? NOT_FOUND_MARKDOWN)
  }
}

/** Browsers and clients without a preference (wildcard or no Accept) get HTML, the first listed type. */
function prefersMarkdown(req: Pick<Request, 'accepts'>) {
  return req.accepts(['text/html', 'text/markdown']) === 'text/markdown'
}

// Safe to send only because the client asked for this type in Accept.
const NEGOTIATED_MARKDOWN = 'text/markdown; charset=utf-8'
const NOT_FOUND_MARKDOWN = '# Not found\n'
