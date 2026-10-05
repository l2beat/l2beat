import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getHomeCropsProjects } from '../home/getHomeCropsProjects'
import { getRecentProjectsForHome } from '../home/getHomeData'
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
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['landing', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedData(manifest),
    ),
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
