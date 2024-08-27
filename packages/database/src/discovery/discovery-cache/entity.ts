import { Insertable, Selectable } from 'kysely'
import { DiscoveryCache } from '../../kysely/generated/types'

export interface DiscoveryCacheRecord {
  key: string
  value: string
  chain: string
  blockNumber: number
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
