import { env } from '~/env'
import type { STATIC_PAGE_PATHS } from '~/server/pagePaths'

/**
 * The one place that knows which pages are also served as markdown, at the
 * page URL plus `.md`. The routes, the `Link` header, the `<head>` link, the
 * project links bar and llms.txt all read from here, so a page kind that gains
 * a markdown version registers once and is advertised everywhere.
 *
 * Free of server imports, because the links bar resolves it in the browser.
 */
export function getMarkdownAlternatePath(pagePath: string): string | undefined {
  const path = trimTrailingSlashes(pagePath)
  if (path.toLowerCase().endsWith('.md')) return undefined
  return hasMarkdownVersion(path) ? `${path}.md` : undefined
}

/**
 * For links to markdown documents, e.g. `/defi/projects/{slug}.md`, where a
 * `{name}` placeholder stands for a path segment: false while the page is
 * switched off, as the registry then leaves it out.
 */
export function isServedAsMarkdown(markdownPath: `${string}.md`) {
  return hasMarkdownVersion(markdownPath.slice(0, -'.md'.length))
}

function hasMarkdownVersion(path: string) {
  return PAGES_WITH_MARKDOWN.some((page) => matchesPage(page, path))
}

export const LIST_PAGES_WITH_MARKDOWN = [
  '/layer2s/summary',
  '/data-availability/summary',
  '/zk-catalog',
  '/privacy/summary',
  '/interop/summary',
  // Behind the same flag as the pages: advertised while off, these would be
  // 404s. Everything that lists markdown pages filters by this registry, so
  // the flag is read here only.
  ...(env.CLIENT_SIDE_DEFI_ENABLED ? (['/defi/summary'] as const) : []),
] as const satisfies ListPagePath[]

/**
 * Express route patterns, where `:name` stands for one path segment and
 * `{...}` for a part the URL may leave out.
 */
export const PROJECT_PAGES_WITH_MARKDOWN = [
  '/layer2s/projects/:slug',
  '/data-availability/projects/:layer/:bridge',
  '/privacy/projects/:slug',
  '/interop/protocols/:slug',
  '/zk-catalog/:slug',
  '/interop/tokens/:slug{/:issuer}{/:symbol}',
  ...(env.CLIENT_SIDE_DEFI_ENABLED ? (['/defi/projects/:slug'] as const) : []),
] as const

export type ListPageWithMarkdown = (typeof LIST_PAGES_WITH_MARKDOWN)[number]

/** Static pages plus the flagged ones `STATIC_PAGE_PATHS` cannot list unconditionally. */
type ListPagePath = (typeof STATIC_PAGE_PATHS)[number] | '/defi/summary'

const PAGES_WITH_MARKDOWN: readonly string[] = [
  ...LIST_PAGES_WITH_MARKDOWN,
  ...PROJECT_PAGES_WITH_MARKDOWN,
]

/** A loop, not `/\/+$/`: the regex is quadratic on a request path of many slashes, and every page request goes through here. */
function trimTrailingSlashes(path: string) {
  let end = path.length
  while (end > 0 && path[end - 1] === '/') end--
  return path.slice(0, end)
}

/**
 * Case-insensitive like Express routing, so `/Layer2s/Summary/` finds its
 * page. The path itself keeps its case: slugs and token ids are
 * case-sensitive, so a lowercased alternate would be another resource.
 */
function matchesPage(page: string, path: string) {
  const pattern = page
    .replaceAll('{', '(?:')
    .replaceAll('}', ')?')
    .replaceAll(/:\w+/g, '[^/]+')
  return new RegExp(`^${pattern}$`, 'i').test(path)
}
