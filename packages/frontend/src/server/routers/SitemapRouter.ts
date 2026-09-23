import { UnixTime } from '@l2beat/shared-pure'
import express from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import {
  type ChangelogEntry,
  getChangelogEntries,
} from '~/server/features/changelog/getChangelogEntries'
import { newestTimestamp } from '~/server/lastModified'
import { getPages, type Page } from '~/server/pagePaths'

export type DatedChangelogEntry = Pick<ChangelogEntry, 'publishedAt'>

interface SitemapSources {
  getPages: () => Promise<Page[]>
  getChangelogEntries: () => DatedChangelogEntry[]
}

export function createSitemapRouter(
  sources: SitemapSources = { getPages, getChangelogEntries },
) {
  const router = express.Router()

  router.get('/sitemap.xml', async (_req, res) => {
    const pages = await sources.getPages()
    const siteLastModified = getLatestPublished(sources.getChangelogEntries())

    const urls = pages
      .map((page) =>
        renderUrl(page.path, page.lastModified ?? siteLastModified),
      )
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    res.header('Content-Type', 'application/xml').send(xml)
  })

  return router
}

/** The changelog records site-wide changes, so it dates pages that have no data of their own. */
function getLatestPublished(
  entries: DatedChangelogEntry[],
): UnixTime | undefined {
  const now = UnixTime.now()
  return newestTimestamp(
    entries
      .map((entry) => UnixTime.fromDate(entry.publishedAt))
      .filter((timestamp) => timestamp <= now),
  )
}

function renderUrl(path: string, lastModified: UnixTime | undefined) {
  const lines = [`    <loc>${escapeXml(PRODUCTION_ORIGIN + path)}</loc>`]
  if (lastModified !== undefined) {
    lines.push(`    <lastmod>${UnixTime.toYYYYMMDD(lastModified)}</lastmod>`)
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
