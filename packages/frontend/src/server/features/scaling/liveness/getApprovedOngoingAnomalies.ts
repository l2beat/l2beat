import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { InMemoryCache } from '~/server/cache/InMemoryCache'
import { getDb } from '~/server/database'

const cache = new InMemoryCache()

export function getApprovedOngoingAnomalies() {
  return cache.get(
    {
      key: ['approved-ongoing-anomalies'],
      ttl: 3 * UnixTime.MINUTE,
      staleWhileRevalidate: 7 * UnixTime.MINUTE,
    },
    async () => {
      const db = getDb()
      const anomalies = await db.realTimeAnomalies.getApprovedOngoingAnomalies()

      return groupBy(anomalies, (anomaly) => anomaly.projectId)
    },
  )
}
