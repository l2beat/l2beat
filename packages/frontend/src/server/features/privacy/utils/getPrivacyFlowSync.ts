import type { ProjectPrivacyInfo } from '@l2beat/config'
import type { SyncMetadataRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

/**
 * How far the backend has indexed the flows of a set of buckets, from the
 * sync metadata the privacy module keeps per bucket.
 */
export interface PrivacyFlowSync {
  /** The height the furthest bucket has reached. */
  reached: UnixTime
  /**
   * The height the slowest bucket has reached. A new bucket backfills from
   * its start, and counts as just before it until its first batch lands.
   */
  slowest: UnixTime
}

export interface PrivacyFlowBucket {
  id: string
  sinceTimestamp: UnixTime
}

/** The buckets whose flows the projects' charts sum. */
export function getPrivacyFlowBuckets(
  projects: { privacyInfo: Pick<ProjectPrivacyInfo, 'tokens'> }[],
): PrivacyFlowBucket[] {
  return projects.flatMap((project) =>
    project.privacyInfo.tokens.flatMap((token) =>
      token.buckets.map((bucket) => ({
        id: bucket.id,
        sinceTimestamp: bucket.sinceTimestamp,
      })),
    ),
  )
}

/** Undefined when no bucket has a row, e.g. before the backend writes them. */
export function getPrivacyFlowSync(
  buckets: PrivacyFlowBucket[],
  records: SyncMetadataRecord[],
): PrivacyFlowSync | undefined {
  const syncedUntil = new Map(
    records.map((record) => [record.id, record.syncedUntil]),
  )
  if (!buckets.some((bucket) => syncedUntil.has(bucket.id))) return undefined

  const heights = buckets.map(
    (bucket) => syncedUntil.get(bucket.id) ?? bucket.sinceTimestamp - 1,
  )
  return { reached: Math.max(...heights), slowest: Math.min(...heights) }
}
