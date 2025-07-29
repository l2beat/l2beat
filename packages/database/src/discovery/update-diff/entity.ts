import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateDiff } from '../../kysely/generated/types'

type UpdateDiffType =
  | 'ultimateUpgraderChange'
  | 'implementationChange'
  | 'highSeverityFieldChange'
  | 'becameVerified'

export interface UpdateDiffRecord {
  type: UpdateDiffType
  chain: string
  address: string
  projectId: string
  timestamp: UnixTime
  diffBaseTimestamp: number
  diffHeadTimestamp: number
}

export function toRow(record: UpdateDiffRecord): Insertable<UpdateDiff> {
  return {
    projectId: record.projectId,
    chain: record.chain,
    address: record.address,
    type: record.type,
    timestamp: UnixTime.toDate(record.timestamp),
    diffBaseTimestamp: UnixTime.toDate(record.diffBaseTimestamp),
    diffHeadTimestamp: UnixTime.toDate(record.diffHeadTimestamp),
  }
}

export function toRecord(row: Selectable<UpdateDiff>): UpdateDiffRecord {
  return {
    projectId: row.projectId,
    chain: row.chain,
    address: row.address,
    type: row.type as UpdateDiffType,
    timestamp: UnixTime.fromDate(row.timestamp),
    diffBaseTimestamp: UnixTime.fromDate(row.diffBaseTimestamp),
    diffHeadTimestamp: UnixTime.fromDate(row.diffHeadTimestamp),
  }
}
