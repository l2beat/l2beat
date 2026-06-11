import compact from 'lodash/compact'
import { getCollection } from '~/content/getCollection'
import { ps } from '~/server/projects'

/**
 * Resolves every page that should render successfully in the frontend mock app.
 * Dynamic routes are resolved from the same project/content sources used by
 * the old test-all-pages script.
 */
export async function resolvePages(): Promise<string[]> {
  const [
    scalingProjects,
    daLayerProjects,
    daBridgeProjects,
    zkCatalogProjects,
  ] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      optional: ['tvsConfig'],
    }),
    ps.getProjects({
      where: ['daLayer'],
      select: ['daLayer'],
    }),
    ps.getProjects({
      select: ['daBridge'],
    }),
    ps.getProjects({
      where: ['zkCatalogInfo'],
    }),
  ])
  const governancePublications = getCollection('governance-publications')
  const monthlyUpdates = getCollection('monthly-updates')

  return compact([
    '/scaling/summary',
    '/scaling/risk',
    '/scaling/tvs',
    '/scaling/activity',
    '/scaling/risk/data-availability',
    '/scaling/risk/state-validation',
    '/scaling/risk/sequencing',
    '/scaling/liveness',
    '/scaling/costs',
    '/scaling/archived',
    ...scalingProjects.flatMap((x) => [
      `/scaling/projects/${x.slug}`,
      x.tvsConfig && `/scaling/projects/${x.slug}/tvs-breakdown`,
    ]),
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
}
