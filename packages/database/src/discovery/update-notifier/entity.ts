import { DiscoveryDiff } from '@l2beat/discovery'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { UpdateNotifier } from '../../kysely/generated/types'

export interface UpdateNotifierRecord {
  id: number
  createdAt: UnixTime
  updatedAt: UnixTime
  projectName: string
  blockNumber: number
  diff: DiscoveryDiff[]
  chainId: ChainId
}

export function toRow(
  record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Insertable<Omit<UpdateNotifier, 'id' | 'created_at' | 'updated_at'>> {
  return {
    projectName: record.projectName,
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
    projectName: row.projectName,
    blockNumber: row.blockNumber,
    diff: row.diffJsonBlob as unknown as DiscoveryDiff[],
    chainId: ChainId(row.chainId),
  }
}
