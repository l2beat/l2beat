import type { Insertable, Selectable } from 'kysely'
import type { DiscoveryCache } from '../../kysely/generated/types'

export interface DiscoveryCacheRecord {
  key: string
  value: string
}

export function toRecord(
  row: Selectable<DiscoveryCache>,
): DiscoveryCacheRecord {
  return row
}

export function toRow(
  record: DiscoveryCacheRecord,
): Insertable<DiscoveryCache> {
  return record
}
