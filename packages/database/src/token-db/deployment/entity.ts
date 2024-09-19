import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
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

export type UpsertableDeploymentRecord = Omit<
  DeploymentRecord,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRow(
  record: UpsertableDeploymentRecord,
): Insertable<Deployment> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
