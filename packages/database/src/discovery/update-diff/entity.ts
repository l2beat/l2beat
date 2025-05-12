import type { Insertable, Selectable } from 'kysely'
import type { UpdateDiff } from '../../kysely/generated/types'

export type UpdateDiffType =
  | 'upgradeChange'
  | 'implementationChange'
  | 'fieldHighSeverityChange'

export interface UpdateDiffRecord {
  type: UpdateDiffType
  address: string
}

export function toRow(record: UpdateDiffRecord): Insertable<UpdateDiff> {
  return {
    address: record.address,
    type: record.type,
  }
}

export function toRecord(row: Selectable<UpdateDiff>): UpdateDiffRecord {
  return {
    address: row.address,
    type: row.type as UpdateDiffType,
  }
}
