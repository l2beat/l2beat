import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateDiff } from '../../kysely/generated/types'

export type UpdateDiffType =
  | 'ultimateUpgraderChange'
  | 'implementationChange'
  | 'highSeverityFieldChange'

export interface UpdateDiffRecord {
  type: UpdateDiffType
  chain: string
  address: string
  projectName: string
  timestamp: UnixTime
}

export function toRow(record: UpdateDiffRecord): Insertable<UpdateDiff> {
  return {
    projectName: record.projectName,
    chain: record.chain,
    address: record.address,
    type: record.type,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(row: Selectable<UpdateDiff>): UpdateDiffRecord {
  return {
    projectName: row.projectName,
    chain: row.chain,
    address: row.address,
    type: row.type as UpdateDiffType,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}
