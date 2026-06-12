import express from 'express'
import { getPagePaths } from '~/server/pagePaths'

const BASE_URL = 'https://l2beat.com'

export function createSitemapRouter() {
  const router = express.Router()

  router.get('/sitemap.xml', async (_req, res) => {
    const paths = await getPagePaths()

    const urls = paths
      .map(
        (path) =>
          `  <url>\n    <loc>${escapeXml(BASE_URL + path)}</loc>\n  </url>`,
      )
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    res
      .header('Content-Type', 'application/xml')
      .header('Cache-Control', 'public, max-age=3600')
      .send(xml)
  })

  return router
}

function escapeXml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll("'", '&apos;')
    .replaceAll('"', '&quot;')
}
