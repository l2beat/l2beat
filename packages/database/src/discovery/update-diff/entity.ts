import type { Insertable, Selectable } from 'kysely'
import type { UpdateDiff } from '../../kysely/generated/types'

export type UpdateDiffType =
  | 'ultimateUpgraderChange'
  | 'implementationChange'
  | 'highSeverityFieldChange'

export interface UpdateDiffRecord {
  type: UpdateDiffType
  address: string
  projectName: string
}

export function toRow(record: UpdateDiffRecord): Insertable<UpdateDiff> {
  return {
    projectName: record.projectName,
    address: record.address,
    type: record.type,
  }
}

export function toRecord(row: Selectable<UpdateDiff>): UpdateDiffRecord {
  return {
    projectName: row.projectName,
    address: row.address,
    type: row.type as UpdateDiffType,
  }
}
