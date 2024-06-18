import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { BlockTimestamp as BlockTimestampRow } from '../kysely/generated/types'

export interface BlockTimestamps {
  chain: string
  timestamp: UnixTime
  blockNumber: number
}

export function toRecord(
  entity: Selectable<BlockTimestampRow>,
): BlockTimestamps {
  return {
    chain: entity.chain,
    timestamp: UnixTime.fromDate(entity.timestamp),
    blockNumber: entity.block_number,
  }
}

export function toRow(
  blockTimestamps: BlockTimestamps,
): Insertable<BlockTimestampRow> {
  return {
    chain: blockTimestamps.chain,
    timestamp: blockTimestamps.timestamp.toDate(),
    block_number: blockTimestamps.blockNumber,
  }
}
