import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { Value } from '../../kysely/generated/types'

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
    projectId: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    dataSource: record.dataSource,
    native: record.native.toString(),
    nativeAssociated: record.nativeAssociated.toString(),
    nativeForTotal: record.nativeForTotal.toString(),
    nativeAssociatedForTotal: record.nativeAssociatedForTotal.toString(),
    canonical: record.canonical.toString(),
    canonicalAssociated: record.canonicalAssociated.toString(),
    canonicalForTotal: record.canonicalForTotal.toString(),
    canonicalAssociatedForTotal: record.canonicalAssociatedForTotal.toString(),
    external: record.external.toString(),
    externalAssociated: record.externalAssociated.toString(),
    externalForTotal: record.externalForTotal.toString(),
    externalAssociatedForTotal: record.externalAssociatedForTotal.toString(),
    ether: record.ether.toString(),
    stablecoin: record.stablecoin.toString(),
  }
}

export function toRecord(row: Selectable<Value>): ValueRecord {
  return {
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    dataSource: row.dataSource,
    native: row.native ? BigInt(row.native) : BigInt(0),
    nativeAssociated: BigInt(row.nativeAssociated),
    nativeForTotal: row.nativeForTotal ? BigInt(row.nativeForTotal) : BigInt(0),
    nativeAssociatedForTotal: BigInt(row.nativeAssociatedForTotal),
    canonical: row.canonical ? BigInt(row.canonical) : BigInt(0),
    canonicalAssociated: BigInt(row.canonicalAssociated),
    canonicalForTotal: row.canonicalForTotal
      ? BigInt(row.canonicalForTotal)
      : BigInt(0),
    canonicalAssociatedForTotal: BigInt(row.canonicalAssociatedForTotal),
    external: row.external ? BigInt(row.external) : BigInt(0),
    externalAssociated: BigInt(row.externalAssociated),
    externalForTotal: row.externalForTotal
      ? BigInt(row.externalForTotal)
      : BigInt(0),
    externalAssociatedForTotal: BigInt(row.externalAssociatedForTotal),
    ether: BigInt(row.ether),
    stablecoin: BigInt(row.stablecoin),
  }
}
