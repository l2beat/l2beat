import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { BlockTimestamp } from '../../kysely/generated/types'

export interface BlockTimestampRecord {
  chain: string
  timestamp: UnixTime
  blockNumber: number
}

export function toRecord(
  entity: Selectable<BlockTimestamp>,
): BlockTimestampRecord {
  return {
    chain: entity.chain,
    timestamp: UnixTime.fromDate(entity.timestamp),
    blockNumber: entity.blockNumber,
  }
}

export function toRow(
  blockTimestamp: BlockTimestampRecord,
): Insertable<BlockTimestamp> {
  return {
    chain: blockTimestamp.chain,
    timestamp: blockTimestamp.timestamp.toDate(),
    blockNumber: blockTimestamp.blockNumber,
  }
}
