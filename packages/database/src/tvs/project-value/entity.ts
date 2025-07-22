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
  btc: number
  rwaRestricted: number
  rwaPublic: number
  other: number
  associated: number
}

export function toRecord(row: Selectable<ProjectValue>): ProjectValueRecord {
  return {
    ...row,
    type: row.type as ProjectValueType,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: ProjectValueRecord): Insertable<ProjectValue> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export type SummedByTimestampProjectValueRecord = Omit<
  ProjectValueRecord,
  'project' | 'type'
>

export function toSummedByTimestampRecord(
  row: Selectable<Omit<ProjectValue, 'project' | 'type'>>,
): SummedByTimestampProjectValueRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}
