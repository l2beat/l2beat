import compact from 'lodash/compact'
import { getCollection } from '~/content/getCollection'
import { ps } from '~/server/projects'
import { testPage } from './testPage'

async function main() {
  const [
    scalingProjects,
    bridgedProjects,
    daLayerProjects,
    daBridgeProjects,
    zkCatalogProjects,
    zkCatalogV1Projects,
  ] = await Promise.all([
    ps.getProjects({
      where: ['isScaling'],
      optional: ['tvsConfig'],
    }),
    ps.getProjects({
      where: ['isBridge'],
    }),
    ps.getProjects({
      where: ['isDaLayer'],
      select: ['daLayer'],
    }),
    ps.getProjects({
      select: ['daBridge'],
    }),
    ps.getProjects({
      where: ['zkCatalogInfo'],
    }),
    ps.getProjects({
      where: ['isZkCatalog'],
      whereNot: ['archivedAt'],
    }),
  ])
  const governancePublications = getCollection('governance-publications')
  const monthlyUpdates = getCollection('monthly-updates')

  const pages = compact([
    '/scaling/summary',
    '/scaling/risk',
    '/scaling/tvs',
    '/scaling/activity',
    '/scaling/data-availability',
    '/scaling/liveness',
    '/scaling/costs',
    '/scaling/archived',
    '/scaling/upcoming',
    ...scalingProjects.flatMap((x) => [
      `/scaling/projects/${x.slug}`,
      x.tvsConfig && `/scaling/projects/${x.slug}/tvs-breakdown`,
    ]),
    '/bridges/summary',
    '/bridges/archived',
    ...bridgedProjects.map((x) => `/bridges/projects/${x.slug}`),
    '/data-availability/summary',
    '/data-availability/risk',
    '/data-availability/throughput',
    '/data-availability/archived',
    ...daLayerProjects.flatMap((p) => {
      const daBridges = daBridgeProjects.filter(
        (da) => da.daBridge.daLayer === p.id,
      )
      return [
        p.daLayer.usedWithoutBridgeIn.length > 0
          ? `/data-availability/projects/${p.slug}/no-bridge`
          : undefined,
        ...daBridges.map(
          (da) => `/data-availability/projects/${p.slug}/${da.slug}`,
        ),
      ].filter(Boolean)
    }),
    '/zk-catalog',
    ...zkCatalogProjects.map((p) => `/zk-catalog/${p.slug}`),
    '/zk-catalog/v1',
    ...zkCatalogV1Projects.map((p) => `/zk-catalog/v1/${p.slug}`),
    '/about-us',
    '/donate',
    '/governance',
    '/publications',
    ...[...governancePublications, ...monthlyUpdates].map(
      (p) => `/publications/${p.id}`,
    ),
    '/terms-of-service',
    '/glossary',
    '/faq',
  ])

  for (const page of pages) {
    console.log(
      `Testing ${page} (${pages.indexOf(page) + 1} of ${pages.length})`,
    )

    const result = await testPage(`http://localhost:3000${page}`)
    if (result.type === 'error') {
      console.error(
        `HTTP ${result.status}: ${result.message} - Failed to fetch ${result.url}`,
      )
      process.exit(1)
    }
  }
}

main().catch(console.error)
