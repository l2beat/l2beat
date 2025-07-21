import type { RealTimeAnomalyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { InMemoryCache } from '~/server/cache/InMemoryCache'
import { getDb } from '~/server/database'

const cache = new InMemoryCache()

type GroupedAnomalies = Record<string, RealTimeAnomalyRecord[]>

export async function getApprovedOngoingAnomalies(): Promise<GroupedAnomalies> {
  if (env.MOCK) {
    return getMockedApprovedOngoingAnomalies()
  }

  const data = await cache.get(
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
  return data
}

function getMockedApprovedOngoingAnomalies(): GroupedAnomalies {
  return {
    kinto: [],
  }
}
