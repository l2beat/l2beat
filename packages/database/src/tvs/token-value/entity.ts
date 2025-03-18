import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TokenValue } from '../../kysely/generated/types'

export interface TokenValueRecord {
  timestamp: UnixTime
  configurationId: string
  project: string
  amount: number
  value: number
  valueForProject: number
  valueForSummary: number
}

export function toRecord(row: Selectable<TokenValue>): TokenValueRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    configurationId: row.configurationId,
    project: row.project,
    amount: row.amount,
    value: row.value,
    valueForProject: row.valueForProject,
    valueForSummary: row.valueForSummary,
  }
}

export function toRow(record: TokenValueRecord): Insertable<TokenValue> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    configurationId: record.configurationId,
    project: record.project,
    amount: record.amount,
    value: record.value,
    valueForProject: record.valueForProject,
    valueForSummary: record.valueForSummary,
  }
}
