import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { BlockTimestamp as BlockTimestampRow } from '../kysely/generated/types'

export interface BlockTimestamp {
  chain: string
  timestamp: UnixTime
  blockNumber: number
}

export function toRecord(
  entity: Selectable<BlockTimestampRow>,
): BlockTimestamp {
  return {
    chain: entity.chain,
    timestamp: UnixTime.fromDate(entity.timestamp),
    blockNumber: entity.block_number,
  }
}

export function toRow(
  blockTimestamp: BlockTimestamp,
): Insertable<BlockTimestampRow> {
  return {
    chain: blockTimestamp.chain,
    timestamp: blockTimestamp.timestamp.toDate(),
    block_number: blockTimestamp.blockNumber,
  }
}
