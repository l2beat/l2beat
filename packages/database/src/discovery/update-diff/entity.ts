import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateDiff } from '../../kysely/generated/types'

type UpdateDiffType =
  | 'ultimateUpgraderChange'
  | 'implementationChange'
  | 'highSeverityFieldChange'
  | 'verificationChange'

export interface UpdateDiffRecord {
  type: UpdateDiffType
  chain: string
  address: string
  projectId: string
  timestamp: UnixTime
}

export function toRow(record: UpdateDiffRecord): Insertable<UpdateDiff> {
  return {
    projectId: record.projectId,
    chain: record.chain,
    address: record.address,
    type: record.type,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(row: Selectable<UpdateDiff>): UpdateDiffRecord {
  return {
    projectId: row.projectId,
    chain: row.chain,
    address: row.address,
    type: row.type as UpdateDiffType,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}
