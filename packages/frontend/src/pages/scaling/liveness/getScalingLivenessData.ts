import { UnixTime } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import {
  getScalingLivenessEntries,
  type ScalingLivenessEntry,
} from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import type { TabbedScalingEntries } from '../utils/groupByScalingTabs'

export async function getScalingLivenessData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'liveness', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingLivenessEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Liveness - L2BEAT',
        description:
          'Monitor liveness metrics of Ethereum scaling projects and recent anomalies.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/liveness/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingLivenessPage',
      props: {
        ...appLayoutProps,
        entries,
        projectsWithAnomalies: getProjectsWithAnomalies(entries),
      },
    },
  }
}

function getProjectsWithAnomalies(
  entries: TabbedScalingEntries<ScalingLivenessEntry>,
) {
  return Object.values(entries)
    .flat()
    .flatMap((entry) => {
      const recentAnomalies = entry.anomalies.filter(
        (anomaly) =>
          anomaly.isApproved &&
          (anomaly.end === undefined ||
            anomaly.end >
              UnixTime.toStartOf(UnixTime.now(), 'day') - 2 * UnixTime.DAY),
      )

      if (recentAnomalies.length === 0) {
        return undefined
      }

      return {
        name: entry.name,
        slug: entry.slug,
        recentAnomalies,
      }
    })
    .sort((a, b) => {
      const aOngoing = a?.recentAnomalies.some(
        (anomaly) => anomaly.end === undefined,
      )
      const bOngoing = b?.recentAnomalies.some(
        (anomaly) => anomaly.end === undefined,
      )

      if (aOngoing && !bOngoing) {
        return -1
      }

      if (!aOngoing && bOngoing) {
        return 1
      }

      return 0
    })
    .filter((entry) => entry !== undefined)
}
