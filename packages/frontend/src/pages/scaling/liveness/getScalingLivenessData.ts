import { UnixTime } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingLivenessEntries } from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

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

  const projectsWithAnomalies = Object.values(entries)
    .flat()
    .flatMap((entry) => {
      const recentAnomalies = entry.anomalies.filter(
        (anomaly) =>
          anomaly.end === undefined ||
          anomaly.end > UnixTime.now() - UnixTime.DAY * 2,
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

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
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
        projectsWithAnomalies,
      },
    },
  }
}
