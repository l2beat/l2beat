import type { Insertable, Selectable } from 'kysely'
import type { ImplementationChange } from '../../kysely/generated/types'

export type ImplementationChangeType =
  | 'upgradeChange'
  | 'implementationChange'
  | 'fieldHighSeverityChange'

export interface ImplementationChangeRecord {
  type: ImplementationChangeType
  address: string
}

export function toRow(
  record: ImplementationChangeRecord,
): Insertable<ImplementationChange> {
  return {
    address: record.address,
    type: record.type,
  }
}

export function toRecord(
  row: Selectable<ImplementationChange>,
): ImplementationChangeRecord {
  return {
    address: row.address,
    type: row.type as ImplementationChangeType,
  }
}
