import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { ANONYMITY_SET_WINDOW_DAYS } from './calculateAnonymitySets'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
} from './getPrivacyAnonymitySetSeries'

export interface PrivacyAnonymitySetCoverage {
  /** Deposits whose depositor was identified, so they count towards the set. */
  attributed: number
  total: number
}

/**
 * Only partially attributed projects leave deposits out of the anonymity set,
 * so only they report how many deposits of the latest window were counted.
 */
export async function getPrivacyAnonymitySetCoverage(
  db: Database,
  project: PrivacyAnonymitySetProject,
  currentDay: UnixTime,
): Promise<PrivacyAnonymitySetCoverage | undefined> {
  if (project.privacyInfo.anonymitySet?.type !== 'partially-attributed') {
    return undefined
  }

  const from = currentDay - ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY
  const trackedBucketIds = new Set(
    getPrivacyAnonymitySetSeries(project).map((series) => series.bucketId),
  )
  const [attributed, flows] = await Promise.all([
    db.privacyAnonymitySetEvent.getDepositCount(project.id, from, currentDay),
    db.privacyFlowEvent.getDailyByProjectIds([project.id], from, currentDay),
  ])
  const total = flows
    .filter((flow) => trackedBucketIds.has(flow.bucketId))
    .reduce((sum, flow) => sum + flow.depositCount, 0)

  // Totals come from the flow indexer, which may lag behind the anonymity set one.
  if (attributed > total) return undefined

  return { attributed, total }
}
