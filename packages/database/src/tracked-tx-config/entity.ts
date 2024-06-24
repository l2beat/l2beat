import {
  TrackedTxConfigEntry,
  TrackedTxId,
  TrackedTxUseWithId,
} from '@l2beat/shared'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { TrackedTxsConfig as TrackedTxsConfigRow } from '../kysely/generated/types'

export interface TrackedTxsConfig {
  id: TrackedTxId
  projectId: ProjectId
  type: TrackedTxsConfigType
  subtype?: TrackedTxsConfigSubtype
  sinceTimestampInclusive?: UnixTime
  untilTimestampExclusive?: UnixTime
  lastSyncedTimestamp?: UnixTime
  debugInfo: string
}

export function toRow(
  record: TrackedTxsConfig,
): Insertable<TrackedTxsConfigRow> {
  return {
    id: record.id.toString(),
    project_id: record.projectId.toString(),
    type: record.type,
    subtype: record.subtype ?? null,
    since_timestamp_inclusive: record.sinceTimestampInclusive?.toDate() ?? null,
    until_timestamp_exclusive: record.untilTimestampExclusive?.toDate() ?? null,
    last_synced_timestamp: null,
    debug_info: record.debugInfo,
  }
}

export function toRecord(
  row: Selectable<TrackedTxsConfigRow>,
): TrackedTxsConfig {
  const untilTimestamp = row.until_timestamp_exclusive
    ? UnixTime.fromDate(row.until_timestamp_exclusive)
    : undefined

  const lastSyncedTimestamp = row.last_synced_timestamp
    ? UnixTime.fromDate(row.last_synced_timestamp)
    : undefined

  const sinceTimestampInclusive = row.since_timestamp_inclusive
    ? UnixTime.fromDate(row.since_timestamp_inclusive)
    : undefined

  return {
    id: TrackedTxId.unsafe(row.id),
    projectId: ProjectId(row.project_id),
    type: TrackedTxsConfigType.parse(row.type),
    subtype: row.subtype
      ? TrackedTxsConfigSubtype.parse(row.subtype)
      : undefined,
    sinceTimestampInclusive: sinceTimestampInclusive,
    untilTimestampExclusive: untilTimestamp,
    lastSyncedTimestamp,
    debugInfo: row.debug_info,
  }
}

export function trackedTxConfigEntryToRecord(
  entry: TrackedTxConfigEntry,
  entryUse: TrackedTxUseWithId,
): TrackedTxsConfig {
  return {
    id: entryUse.id,
    debugInfo: toDebugInfo(entry),
    projectId: entry.projectId,
    type: entryUse.type,
    subtype: entryUse.subtype,
    sinceTimestampInclusive: entry.sinceTimestampInclusive,
    untilTimestampExclusive: entry.untilTimestampExclusive ?? undefined,
    lastSyncedTimestamp: undefined,
  }
}

function toDebugInfo(value: TrackedTxConfigEntry): string {
  if (value.formula === 'transfer') {
    return `Transfer: ${value.from.toString()} -> ${value.to.toString()}`
  } else {
    return `Function call: ${value.address.toString()} : ${value.selector.toString()}`
  }
}
