import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TokenValue } from '../../kysely/generated/types'

export interface TokenValueRecord {
  timestamp: UnixTime
  configurationId: string
  projectId: string
  tokenId: string
  amount: number
  value: number
  valueForProject: number
  valueForSummary: number
  priceUsd: number
}

export function toRecord(row: Selectable<TokenValue>): TokenValueRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: TokenValueRecord): Insertable<TokenValue> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}
