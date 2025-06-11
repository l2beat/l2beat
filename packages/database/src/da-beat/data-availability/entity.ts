import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { DataAvailability } from '../../kysely/generated/types'

export interface DataAvailabilityRecord {
  timestamp: UnixTime
  projectId: string
  daLayer: string
  configurationId: string
  totalSize: bigint
}

export interface SummedDataAvailabilityRecord {
  timestamp: UnixTime
  daLayer: string
  projectId: string
  totalSize: bigint
}

export interface ProjectsSummedDataAvailabilityRecord {
  timestamp: UnixTime
  daLayer: string
  totalSize: bigint
}

export function toRecord(
  row: Selectable<DataAvailability>,
): DataAvailabilityRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: row.projectId,
    daLayer: row.daLayer,
    configurationId: row.configurationId,
    totalSize: BigInt(row.totalSize),
  }
}

export function toSummedRecord(
  row: Omit<Selectable<DataAvailability>, 'configurationId'>,
): SummedDataAvailabilityRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    daLayer: row.daLayer,
    projectId: row.projectId,
    totalSize: BigInt(row.totalSize),
  }
}

export function toProjectsSummedRecord(
  row: Omit<Selectable<DataAvailability>, 'projectId' | 'configurationId'>,
): ProjectsSummedDataAvailabilityRecord {
  return {
    daLayer: row.daLayer,
    timestamp: UnixTime.fromDate(row.timestamp),
    totalSize: BigInt(row.totalSize),
  }
}

export function toRow(
  record: DataAvailabilityRecord,
): Insertable<DataAvailability> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    projectId: record.projectId,
    daLayer: record.daLayer,
    configurationId: record.configurationId,
    totalSize: record.totalSize.toString(),
  }
}
