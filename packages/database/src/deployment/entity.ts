import { Insertable, Selectable } from 'kysely'
import { Deployment as DeploymentEntity } from '../kysely/generated/types'

export interface Deployment {
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

export function toRecord(row: Selectable<DeploymentEntity>): Deployment {
  return row
}

export function toRow(record: Deployment): Insertable<DeploymentEntity> {
  return record
}
