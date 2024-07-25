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
    project_name: record.projectName,
    block_number: record.blockNumber,
    diff_json_blob: JSON.stringify(record.diff),
    chain_id: +record.chainId,
  }
}

export function toRecord(
  row: Selectable<UpdateNotifier>,
): UpdateNotifierRecord {
  return {
    id: row.id,
    createdAt: UnixTime.fromDate(row.created_at),
    updatedAt: UnixTime.fromDate(row.updated_at),
    projectName: row.project_name,
    blockNumber: row.block_number,
    diff: row.diff_json_blob as unknown as DiscoveryDiff[],
    chainId: ChainId(row.chain_id),
  }
}
