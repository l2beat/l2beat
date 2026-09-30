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
  const routedPath = toRoutedPath(pagePath)
  if (routedPath.endsWith('.md')) return undefined
  return PAGES_WITH_MARKDOWN.some((page) => matchesPage(page, routedPath))
    ? `${routedPath}.md`
    : undefined
}

export const LIST_PAGES_WITH_MARKDOWN = [
  '/layer2s/summary',
  '/data-availability/summary',
  '/zk-catalog',
  '/privacy/summary',
] as const satisfies StaticPagePath[]

/** Express route patterns, where `:name` stands for one path segment. */
export const PROJECT_PAGES_WITH_MARKDOWN = [
  '/layer2s/projects/:slug',
  '/privacy/projects/:slug',
  '/interop/protocols/:slug',
] as const

export type ListPageWithMarkdown = (typeof LIST_PAGES_WITH_MARKDOWN)[number]
export type ProjectPageWithMarkdown =
  (typeof PROJECT_PAGES_WITH_MARKDOWN)[number]

type StaticPagePath = (typeof STATIC_PAGE_PATHS)[number]

const PAGES_WITH_MARKDOWN: readonly string[] = [
  ...LIST_PAGES_WITH_MARKDOWN,
  ...PROJECT_PAGES_WITH_MARKDOWN,
]

/** Express routing is neither strict nor case-sensitive, so `/Layer2s/Summary/` serves the same page. */
function toRoutedPath(pagePath: string) {
  return pagePath.replace(/\/+$/, '').toLowerCase()
}

function matchesPage(page: string, routedPath: string) {
  const segments = page.replaceAll(/:\w+/g, '[^/]+')
  return new RegExp(`^${segments}$`).test(routedPath)
}
