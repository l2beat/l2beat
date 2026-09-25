import { UnixTime } from '@l2beat/shared-pure'
import express from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { getPages, type Page } from '~/server/pagePaths'

interface SitemapSources {
  getPages: () => Promise<Page[]>
}

export function createSitemapRouter(sources: SitemapSources = { getPages }) {
  const router = express.Router()

  router.get('/sitemap.xml', async (_req, res) => {
    const pages = await sources.getPages()
    const urls = pages.map(renderUrl).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    res.header('Content-Type', 'application/xml').send(xml)
  })

  return router
}

function renderUrl(page: Page) {
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
