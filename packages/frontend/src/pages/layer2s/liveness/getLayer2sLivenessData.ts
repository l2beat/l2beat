import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getLayer2sLivenessEntries,
  type Layer2sLivenessEntry,
} from '~/server/features/layer2s/liveness/getLayer2sLivenessEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { manifest } from '~/utils/Manifest'
import { isAnomalyOngoing } from '~/utils/project/liveness/isAnomalyOngoing'
import type { TabbedLayer2sEntries } from '../utils/groupByLayer2sTabs'

export async function getLayer2sLivenessData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'liveness', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getLayer2sLivenessEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Liveness - L2BEAT',
        description:
          'Monitor liveness metrics of Ethereum scaling projects and recent anomalies.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/liveness/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'Layer2sLivenessPage',
      props: {
        ...appLayoutProps,
        entries,
        projectsWithAnomalies: getProjectsWithAnomalies(entries),
      },
    },
  }
}

function getProjectsWithAnomalies(
  entries: TabbedLayer2sEntries<Layer2sLivenessEntry>,
) {
  return Object.values(entries)
    .flat()
    .flatMap((entry) => {
      const recentAnomalies = entry.anomalies.filter(
        (anomaly) =>
          anomaly.isApproved &&
          (isAnomalyOngoing(anomaly) ||
            (anomaly.end ?? anomaly.start) >
              UnixTime.toStartOf(UnixTime.now(), 'day') - 2 * UnixTime.DAY),
      )

      if (recentAnomalies.length === 0) {
        return undefined
      }

      return {
        name: entry.name,
        slug: entry.slug,
        iconUrl: manifest.getUrl(`/icons/${entry.slug}.png`),
        recentAnomalies,
      }
    })
    .sort((a, b) => {
      const aOngoing = a?.recentAnomalies.some((anomaly) =>
        isAnomalyOngoing(anomaly),
      )
      const bOngoing = b?.recentAnomalies.some((anomaly) =>
        isAnomalyOngoing(anomaly),
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
