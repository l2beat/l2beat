import express from 'express'
import { getCollection } from '~/content/getCollection'
import { shouldHaveNoBridgePage } from '~/server/features/data-availability/utils/shouldHaveNoBridgePage'
import { ps } from '~/server/projects'

const BASE_URL = 'https://l2beat.com'

const STATIC_PATHS = [
  '/scaling/summary',
  '/scaling/activity',
  '/scaling/risk',
  '/scaling/risk/state-validation',
  '/scaling/tvs',
  '/scaling/tvs/breakdown',
  '/scaling/data-availability',
  '/scaling/liveness',
  '/scaling/costs',
  '/scaling/archived',
  '/scaling/upcoming',
  '/interop/summary',
  '/interop/non-minting',
  '/interop/lock-and-mint',
  '/interop/burn-and-mint',
  '/data-availability/summary',
  '/data-availability/risk',
  '/data-availability/throughput',
  '/data-availability/liveness',
  '/data-availability/archived',
  '/zk-catalog',
  '/governance',
  '/governance/ethereum-connect',
  '/faq',
  '/about-us',
  '/brand-kit',
  '/changelog',
  '/donate',
  '/glossary',
  '/da-risk-framework',
  '/multisig-report',
  '/terms-of-service',
  '/stages',
  '/publications',
]

export function createSitemapRouter() {
  const router = express.Router()

  router.get('/sitemap.xml', async (_req, res) => {
    const dynamicPaths = await getDynamicPaths()
    const allPaths = [...STATIC_PATHS, ...dynamicPaths]

    const urls = allPaths
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

async function getDynamicPaths(): Promise<string[]> {
  const [
    scalingProjects,
    zkCatalogProjects,
    ecosystemProjects,
    daLayers,
    daBridges,
  ] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
      optional: ['tvsConfig'],
    }),
    ps.getProjects({ select: ['zkCatalogInfo'] }),
    ps.getProjects({ where: ['ecosystemConfig'] }),
    ps.getProjects({ select: ['daLayer'], whereNot: ['archivedAt'] }),
    ps.getProjects({ select: ['daBridge'] }),
  ])

  const paths: string[] = []

  for (const project of scalingProjects) {
    paths.push(`/scaling/projects/${project.slug}`)
    if (project.tvsConfig) {
      paths.push(`/scaling/projects/${project.slug}/tvs-breakdown`)
    }
  }

  for (const project of zkCatalogProjects) {
    paths.push(`/zk-catalog/${project.slug}`)
  }

  for (const project of ecosystemProjects) {
    paths.push(`/ecosystems/${project.slug}`)
  }

  for (const layer of daLayers) {
    const layerBridges = daBridges.filter(
      (b) => b.daBridge.daLayer === layer.id,
    )
    for (const bridge of layerBridges) {
      paths.push(`/data-availability/projects/${layer.slug}/${bridge.slug}`)
    }
    if (shouldHaveNoBridgePage(layer.daLayer, layerBridges.length)) {
      paths.push(`/data-availability/projects/${layer.slug}/no-bridge`)
    }
  }

  const governancePublications = getCollection('governance-publications')
  for (const entry of governancePublications) {
    paths.push(`/publications/${entry.id}`)
  }

  const monthlyUpdates = getCollection('monthly-updates')
  for (const entry of monthlyUpdates) {
    paths.push(`/publications/${entry.id}`)
  }

  return paths
}

function escapeXml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll("'", '&apos;')
    .replaceAll('"', '&quot;')
}
