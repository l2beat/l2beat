import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Page } from '~/server/pagePaths'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createSitemapRouter } from './SitemapRouter'

// Method: serve the sitemap over HTTP with injected pages, then read back each
// <url> entry's <loc> and <lastmod>.
describe(createSitemapRouter.name, () => {
  it('serves XML', async () => {
    const response = await fetchSitemap([{ path: '/faq' }])

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type') ?? '').toMatchRegex(
      /^application\/xml/,
    )
    expect(await response.text()).toInclude(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    )
  })

  it('dates a page only when it has a publication date', async () => {
    const pages: Page[] = [
      {
        path: '/publications/2026-06-update',
        lastModified: UnixTime.fromDate(new Date('2026-06-15T09:30:00Z')),
      },
      { path: '/layer2s/projects/arbitrum' },
    ]

    const entries = await getEntries(pages)

    expect(entries).toEqual([
      {
        loc: 'https://l2beat.com/publications/2026-06-update',
        lastmod: '2026-06-15',
      },
      { loc: 'https://l2beat.com/layer2s/projects/arbitrum', lastmod: null },
    ])
  })
})

async function fetchSitemap(pages: Page[]) {
  const router = createSitemapRouter({
    getPages: () => Promise.resolve(pages),
  })
  return fetchFromRouter(router, '/sitemap.xml')
}

async function getEntries(pages: Page[]) {
  const xml = await (await fetchSitemap(pages)).text()

  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, url]) => ({
    loc: url?.match(/<loc>(.*)<\/loc>/)?.[1] ?? null,
    lastmod: url?.match(/<lastmod>(.*)<\/lastmod>/)?.[1] ?? null,
  }))
}
