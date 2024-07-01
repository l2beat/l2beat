import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Value as ValueRow } from '../kysely/generated/types'

export interface Value {
  projectId: ProjectId
  timestamp: UnixTime
  dataSource: string
  canonical: bigint
  canonicalForTotal: bigint
  external: bigint
  externalForTotal: bigint
  native: bigint
  nativeForTotal: bigint
}

export function toRow(record: Value): Insertable<ValueRow> {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    data_source: record.dataSource,
    native: record.native.toString(),
    native_for_total: record.nativeForTotal.toString(),
    canonical: record.canonical.toString(),
    canonical_for_total: record.canonicalForTotal.toString(),
    external: record.external.toString(),
    external_for_total: record.externalForTotal.toString(),
  }
}

export function toRecord(row: Selectable<ValueRow>): Value {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    dataSource: row.data_source,
    native: BigInt(row.native),
    nativeForTotal: BigInt(row.native_for_total),
    canonical: BigInt(row.canonical),
    canonicalForTotal: BigInt(row.canonical_for_total),
    external: BigInt(row.external),
    externalForTotal: BigInt(row.external_for_total),
  }
}
