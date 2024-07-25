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
  return {
    key: row.key,
    value: row.value,
    chain: row.chain,
    blockNumber: row.block_number,
  }
}

export function toRow(
  record: DiscoveryCacheRecord,
): Insertable<DiscoveryCache> {
  return {
    key: record.key,
    value: record.value,
    chain: record.chain,
    block_number: record.blockNumber,
  }
}
