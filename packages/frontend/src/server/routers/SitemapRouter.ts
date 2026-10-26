import { UnixTime } from '@l2beat/shared-pure'
import express from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { getPages, type Page } from '~/server/pagePaths'
import { getMarkdownAlternatePath } from '~/utils/getMarkdownAlternatePath'

interface SitemapSources {
  getPages: () => Promise<Page[]>
}

interface SitemapEntry {
  path: string
  lastModified?: UnixTime
}

export function createSitemapRouter(sources: SitemapSources = { getPages }) {
  const router = express.Router()

  router.get('/sitemap.xml', async (_req, res) => {
    const pages = await sources.getPages()
    const urls = [
      { path: '/llms.txt' },
      ...pages.flatMap(withMarkdownAlternate),
    ]
      .map(renderUrl)
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    res.header('Content-Type', 'application/xml').send(xml)
  })

  return router
}

/** The page followed by its `.md` version, if the registry has one. */
function withMarkdownAlternate(page: Page): SitemapEntry[] {
  const markdownPath = getMarkdownAlternatePath(page.path)
  return markdownPath ? [page, { ...page, path: markdownPath }] : [page]
}

function renderUrl(page: SitemapEntry) {
  const lines = [`    <loc>${escapeXml(PRODUCTION_ORIGIN + page.path)}</loc>`]
  if (page.lastModified !== undefined) {
    lines.push(
      `    <lastmod>${UnixTime.toYYYYMMDD(page.lastModified)}</lastmod>`,
    )
  }
  return ['  <url>', ...lines, '  </url>'].join('\n')
}

function escapeXml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll("'", '&apos;')
    .replaceAll('"', '&quot;')
}
