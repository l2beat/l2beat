import { Insertable, Selectable } from 'kysely'
import { DiscoveryCache as DiscoveryCacheRow } from '../kysely/generated/types'

export interface DiscoveryCache {
  key: string
  value: string
  chain: string
  blockNumber: number
}

export function toRecord(row: Selectable<DiscoveryCacheRow>): DiscoveryCache {
  return {
    key: row.key,
    value: row.value,
    chain: row.chain,
    blockNumber: row.block_number,
  }
}

export function toRow(record: DiscoveryCache): Insertable<DiscoveryCacheRow> {
  return {
    key: record.key,
    value: record.value,
    chain: record.chain,
    block_number: record.blockNumber,
  }
}
