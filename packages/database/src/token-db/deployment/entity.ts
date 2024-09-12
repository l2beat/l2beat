import { Insertable, Selectable } from 'kysely'
import { Deployment } from '../../kysely/generated/types'

export interface DeploymentRecord {
  id: string
  tokenId: string
  txHash: string | null
  blockNumber: number | null
  timestamp: Date | null
  from: string | null
  to: string | null
  isDeployerEoa: boolean | null
  sourceAvailable: boolean
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<Deployment>): DeploymentRecord {
  return row
}

export function toRow(record: DeploymentRecord): Insertable<Deployment> {
  return record
}
