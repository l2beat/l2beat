import type { DiscoveryDiff } from '@l2beat/discovery'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { UpdateNotifier } from '../../kysely/generated/types'

export interface UpdateNotifierRecord {
  id: number
  createdAt: UnixTime
  updatedAt: UnixTime
  projectId: string
  blockNumber: number
  diff: DiscoveryDiff[]
  chainId: ChainId
}

export function toRow(
  record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Insertable<Omit<UpdateNotifier, 'id' | 'created_at' | 'updated_at'>> {
  return {
    projectId: record.projectId,
    blockNumber: record.blockNumber,
    diffJsonBlob: JSON.stringify(record.diff),
    chainId: +record.chainId,
  }
}

export function toRecord(
  row: Selectable<UpdateNotifier>,
): UpdateNotifierRecord {
  return {
    id: row.id,
    createdAt: UnixTime.fromDate(row.createdAt),
    updatedAt: UnixTime.fromDate(row.updatedAt),
    projectId: row.projectId,
    blockNumber: row.blockNumber,
    diff: row.diffJsonBlob as unknown as DiscoveryDiff[],
    chainId: ChainId(row.chainId),
  }
}
