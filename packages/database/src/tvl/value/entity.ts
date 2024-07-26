import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Value } from '../../kysely/generated/types'
import { ValueType } from '../../kysely/generated/enums'

export interface ValueRecord {
  projectId: ProjectId
  timestamp: UnixTime
  dataSource: string
  type: ValueType
  forTotal: boolean
  canonical: bigint
  external: bigint
  native: bigint
}

export function toRow(record: ValueRecord): Insertable<Value> {
  return {
    projectId: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    dataSource: record.dataSource,
    type: record.type,
    forTotal: record.forTotal,
    native: record.native.toString(),
    canonical: record.canonical.toString(),
    external: record.external.toString(),
  }
}

export function toRecord(row: Selectable<Value>): ValueRecord {
  return {
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    dataSource: row.dataSource,
    type: row.type,
    forTotal: row.forTotal,
    native: BigInt(row.native),
    canonical: BigInt(row.canonical),
    external: BigInt(row.external),
  }
}
