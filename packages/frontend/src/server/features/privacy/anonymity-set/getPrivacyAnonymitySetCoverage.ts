import type { Database } from '@l2beat/database'
import { UnixTime, unique } from '@l2beat/shared-pure'
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
  const trackedBucketIds = unique(
    getPrivacyAnonymitySetSeries(project).map((series) => series.bucketId),
  )
  const [attributed, total] = await Promise.all([
    db.privacyAnonymitySetEvent.getDepositCount(
      project.id,
      trackedBucketIds,
      from,
      currentDay,
    ),
    db.privacyFlowEvent.getNonZeroDepositCount(
      project.id,
      trackedBucketIds,
      from,
      currentDay,
    ),
  ])

  // Totals come from the flow indexer, which may lag behind the anonymity set one.
  if (attributed > total) return undefined

  return { attributed, total }
}
