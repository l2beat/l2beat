import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import type { OpenApi } from '../../OpenApi'
import { getScalingSummary } from './getScalingSummary'
import { ScalingSummarySchema } from './types'

export function addScalingRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
  cache: InMemoryCache,
) {
  openapi.get(
    '/v1/scaling/summary',
    {
      summary: 'Assessment and TVS of every active layer 2 and layer 3',
      description:
        'Stage, risks and under-review status match the ETHBEAT website. TVS excludes restricted RWA tokens and includes associated tokens, like the scaling summary page. A project whose TVS is not tracked or not yet synced has `tvs: null`; a project whose `tvs.timestamp` is older than `tvsTimestamp` is lagging. `change7d` is a fraction (0.05 is +5%) and null when there is no value from seven days before.',
      tags: ['scaling'],
      result: ScalingSummarySchema,
    },
    async (_, res) => {
      const data = await cache.get(
        {
          key: ['scaling', 'summary'],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getScalingSummary(ps, db),
      )
      res.json(data)
    },
  )
}
