import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Page } from '~/server/pagePaths'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createSitemapRouter } from './SitemapRouter'

// Method: serve the sitemap over HTTP with injected pages and changelog, then
// read back each <url> entry's <loc> and <lastmod>.
describe(createSitemapRouter.name, () => {
  const CHANGELOG = [
    { publishedAt: new Date('2026-03-05T12:00:00Z') },
    { publishedAt: new Date('2026-05-28T12:00:00Z') },
    { publishedAt: new Date('2026-04-20T12:00:00Z') },
  ]

  it('serves XML', async () => {
    const response = await fetchSitemap([{ path: '/faq' }], CHANGELOG)

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type') ?? '').toMatchRegex(
      /^application\/xml/,
    )
    expect(await response.text()).toInclude(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    )
  })

  it('dates a page by its own last modification', async () => {
    const pages: Page[] = [
      {
        path: '/layer2s/projects/arbitrum',
        lastModified: UnixTime.fromDate(new Date('2026-06-15T09:30:00Z')),
      },
    ]

    const entries = await getEntries(pages, CHANGELOG)

    expect(entries).toEqual([
      {
        loc: 'https://l2beat.com/layer2s/projects/arbitrum',
        lastmod: '2026-06-15',
      },
    ])
  })

  it('dates a page without its own date by the latest changelog entry', async () => {
    const entries = await getEntries([{ path: '/faq' }], CHANGELOG)

    expect(entries).toEqual([
      { loc: 'https://l2beat.com/faq', lastmod: '2026-05-28' },
    ])
  })

  it('ignores changelog entries scheduled for the future', async () => {
    const changelog = [
      ...CHANGELOG,
      { publishedAt: new Date('2999-01-01T00:00:00Z') },
    ]

    const entries = await getEntries([{ path: '/faq' }], changelog)

    expect(entries).toEqual([
      { loc: 'https://l2beat.com/faq', lastmod: '2026-05-28' },
    ])
  })

  it('omits lastmod when neither the page nor the changelog has a date', async () => {
    const entries = await getEntries([{ path: '/faq' }], [])

    expect(entries).toEqual([{ loc: 'https://l2beat.com/faq', lastmod: null }])
  })
})

async function fetchSitemap(pages: Page[], changelog: { publishedAt: Date }[]) {
  const router = createSitemapRouter({
    getPages: () => Promise.resolve(pages),
    getChangelogEntries: () => changelog,
  })
  return fetchFromRouter(router, '/sitemap.xml')
}

async function getEntries(pages: Page[], changelog: { publishedAt: Date }[]) {
  const xml = await (await fetchSitemap(pages, changelog)).text()

  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, url]) => ({
    loc: url?.match(/<loc>(.*)<\/loc>/)?.[1] ?? null,
    lastmod: url?.match(/<lastmod>(.*)<\/lastmod>/)?.[1] ?? null,
  }))
}
