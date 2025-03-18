import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsBlockTimestamp } from '../../kysely/generated/types'

export interface TvsBlockTimestampRecord {
  timestamp: UnixTime
  configurationId: string
  chain: string
  blockNumber: number
}

export function toRecord(
  entity: Selectable<TvsBlockTimestamp>,
): TvsBlockTimestampRecord {
  return {
    timestamp: UnixTime.fromDate(entity.timestamp),
    configurationId: entity.configurationId,
    chain: entity.chain,
    blockNumber: entity.blockNumber,
  }
}

export function toRow(
  blockTimestamp: TvsBlockTimestampRecord,
): Insertable<TvsBlockTimestamp> {
  return {
    timestamp: UnixTime.toDate(blockTimestamp.timestamp),
    configurationId: blockTimestamp.configurationId,
    chain: blockTimestamp.chain,
    blockNumber: blockTimestamp.blockNumber,
  }
}
