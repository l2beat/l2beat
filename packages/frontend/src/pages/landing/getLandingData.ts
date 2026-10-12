import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getHomeCropsProjects } from '../home/getHomeCropsProjects'
import { getCachedHomeData, getRecentProjectsForHome } from '../home/getHomeData'
import { getHomeProjectCounts } from '../home/getHomeProjectCounts'
import { getHomeResearch } from '../home/getHomeResearch'

/** Enough for the marquee to read as a stream. */
const RECENT_PROJECTS_COUNT = 12

export interface LandingCounts {
  l2: number
  privacy: number
  interop: number
  /** 0 while the garden is off; its card then stays hidden. */
  crops: number
}

export async function getLandingData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data, home] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['landing', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedData(manifest),
    ),
    // The home page's charts, under the landing page's own sections. One
    // cache entry for both pages, so neither computes them twice.
    getCachedHomeData(manifest, cache),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'L2BEAT',
        description:
          'Independent, open-source analysis of the Ethereum ecosystem: Layer 2s, privacy protocols, interoperability and the CROPS of Ethereum.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/home/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'LandingPage',
      props: {
        ...appLayoutProps,
        ...data,
        queryState: home.queryState,
        charts: {
          projectCounts: home.projectCounts,
          l2Charts: home.l2Charts,
          topL2Projects: home.topL2Projects,
          privacy: home.privacy,
          ethereumCharts: home.ethereumCharts,
          interopFlowChains: home.interopFlowChains,
          interopDefaultFlowChains: home.interopDefaultFlowChains,
          flowProtocols: home.flowProtocols,
        },
      },
    },
  }
}

async function getCachedData(manifest: Manifest) {
  const [homeCounts, interopProtocols, cropsProjects, recentProjects] =
    await Promise.all([
      getHomeProjectCounts(),
      ps.getProjects({ select: ['interopConfig'] }),
      getHomeCropsProjects(manifest),
      getRecentProjectsForHome(manifest, RECENT_PROJECTS_COUNT),
    ])

  const counts: LandingCounts = {
    l2: homeCounts.l2,
    privacy: homeCounts.privacy,
    interop: interopProtocols.length,
    crops: cropsProjects.length,
  }

  return {
    counts,
    recentProjects,
    research: getHomeResearch(),
  }
}
