import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsBlockTimestamp } from '../../kysely/generated/types'

export interface TvsBlockTimestampRecord {
  chain: string
  timestamp: UnixTime
  blockNumber: number
  configurationId: string
}

export function toRecord(
  entity: Selectable<TvsBlockTimestamp>,
): TvsBlockTimestampRecord {
  return {
    chain: entity.chain,
    timestamp: UnixTime.fromDate(entity.timestamp),
    blockNumber: entity.blockNumber,
    configurationId: entity.configurationId,
  }
}

export function toRow(
  blockTimestamp: TvsBlockTimestampRecord,
): Insertable<TvsBlockTimestamp> {
  return {
    chain: blockTimestamp.chain,
    timestamp: UnixTime.toDate(blockTimestamp.timestamp),
    blockNumber: blockTimestamp.blockNumber,
    configurationId: blockTimestamp.configurationId,
  }
}
