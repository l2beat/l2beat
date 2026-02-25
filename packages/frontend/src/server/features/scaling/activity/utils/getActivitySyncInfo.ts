import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getActivitySyncState } from '../../../utils/syncState'
import {
  getActivityAdjustedTimestamp,
  getActivitySyncWarning,
} from './syncStatus'

export async function getActivitySyncInfo(
  projectId: ProjectId,
  rangeEnd: UnixTime,
): Promise<{
  syncedUntil: UnixTime
  syncWarning: string | undefined
  hasSyncData: boolean
}> {
  const db = getDb()
  const syncMetadata = await db.syncMetadata.getByFeatureAndId(
    'activity',
    projectId,
  )
  if (!syncMetadata || syncMetadata.syncedUntil === null) {
    return { syncedUntil: rangeEnd, syncWarning: undefined, hasSyncData: false }
  }
  const syncState = getActivitySyncState(syncMetadata, rangeEnd)
  return {
    syncedUntil: getActivityAdjustedTimestamp(syncState.syncedUntil),
    syncWarning: getActivitySyncWarning(syncState),
    hasSyncData: true,
  }
}
