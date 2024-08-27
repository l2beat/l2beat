import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Value } from '../../kysely/generated/types'

export interface ValueRecord {
  projectId: ProjectId
  timestamp: UnixTime
  dataSource: string
  canonical: bigint
  canonicalAssociated: bigint
  canonicalForTotal: bigint
  canonicalAssociatedForTotal: bigint
  external: bigint
  externalAssociated: bigint
  externalForTotal: bigint
  externalAssociatedForTotal: bigint
  native: bigint
  nativeAssociated: bigint
  nativeForTotal: bigint
  nativeAssociatedForTotal: bigint
  ether: bigint
  stablecoin: bigint
}

export function toRow(record: ValueRecord): Insertable<Value> {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    data_source: record.dataSource,
    native: record.native.toString(),
    native_associated: record.nativeAssociated.toString(),
    native_for_total: record.nativeForTotal.toString(),
    native_associated_for_total: record.nativeAssociatedForTotal.toString(),
    canonical: record.canonical.toString(),
    canonical_associated: record.canonicalAssociated.toString(),
    canonical_for_total: record.canonicalForTotal.toString(),
    canonical_associated_for_total:
      record.canonicalAssociatedForTotal.toString(),
    external: record.external.toString(),
    external_associated: record.externalAssociated.toString(),
    external_for_total: record.externalForTotal.toString(),
    external_associated_for_total: record.externalAssociatedForTotal.toString(),
    ether: record.ether.toString(),
    stablecoin: record.stablecoin.toString(),
  }
}

export function toRecord(row: Selectable<Value>): ValueRecord {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    dataSource: row.data_source,
    native: row.native ? BigInt(row.native) : BigInt(0),
    nativeAssociated: BigInt(row.native_associated),
    nativeForTotal: row.native_for_total
      ? BigInt(row.native_for_total)
      : BigInt(0),
    nativeAssociatedForTotal: BigInt(row.native_associated_for_total),
    canonical: row.canonical ? BigInt(row.canonical) : BigInt(0),
    canonicalAssociated: BigInt(row.canonical_associated),
    canonicalForTotal: row.canonical_for_total
      ? BigInt(row.canonical_for_total)
      : BigInt(0),
    canonicalAssociatedForTotal: BigInt(row.canonical_associated_for_total),
    external: row.external ? BigInt(row.external) : BigInt(0),
    externalAssociated: BigInt(row.external_associated),
    externalForTotal: row.external_for_total
      ? BigInt(row.external_for_total)
      : BigInt(0),
    externalAssociatedForTotal: BigInt(row.external_associated_for_total),
    ether: BigInt(row.ether),
    stablecoin: BigInt(row.stablecoin),
  }
}
