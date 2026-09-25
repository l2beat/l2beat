import type { RealTimeAnomalyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'

type GroupedAnomalies = Record<string, RealTimeAnomalyRecord[]>

export async function getApprovedOngoingAnomalies(): Promise<GroupedAnomalies> {
  if (env.MOCK) {
    return getMockedApprovedOngoingAnomalies()
  }

  const db = getDb()
  const anomalies = await db.realTimeAnomalies.getApprovedOngoingAnomalies()

  return groupBy(anomalies, (anomaly) => anomaly.projectId)
}

function getMockedApprovedOngoingAnomalies(): GroupedAnomalies {
  const now = UnixTime.now()
  return {
    kinto: [
      {
        projectId: 'kinto',
        subtype: 'stateUpdates',
        start: now - 3 * UnixTime.DAY,
        status: 'ongoing',
        isApproved: true,
      },
    ],
    blobstream: [
      {
        projectId: 'blobstream',
        subtype: 'proofSubmissions',
        start: now - 6 * UnixTime.HOUR,
        status: 'ongoing',
        isApproved: true,
      },
    ],
  }
}
