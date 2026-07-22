import type { RealTimeAnomalyRecord } from '@l2beat/database'
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
  return {
    kinto: [],
  }
}
