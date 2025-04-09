import { type ProjectValueType, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { ProjectValue } from '../../kysely/generated/types'

export interface ProjectValueRecord {
  timestamp: UnixTime
  project: string
  type: ProjectValueType
  value: number
  canonical: number
  external: number
  native: number
  ether: number
  stablecoin: number
  other: number
  associated: number
}

export function toRecord(row: Selectable<ProjectValue>): ProjectValueRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: ProjectValueRecord): Insertable<ProjectValue> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}
