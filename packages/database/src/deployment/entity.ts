import { Insertable, Selectable } from 'kysely'
import { Deployment as DeploymentEntity } from '../kysely/generated/types'

export interface Deployment {
  id: string
  tokenId: string
  txHash?: string
  blockNumber?: number
  timestamp?: Date
  from?: string
  to?: string
  isDeployerEoa?: boolean
  sourceAvailable: boolean
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(entity: Selectable<DeploymentEntity>): Deployment {
  return {
    id: entity.id,
    tokenId: entity.token_id,
    txHash: entity.tx_hash ?? undefined,
    blockNumber: entity.block_number ?? undefined,
    timestamp: entity.timestamp ?? undefined,
    from: entity.from ?? undefined,
    to: entity.to ?? undefined,
    isDeployerEoa: entity.is_deployer_eoa ?? undefined,
    sourceAvailable: entity.source_available,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(deployment: Deployment): Insertable<DeploymentEntity> {
  return {
    id: deployment.id,
    token_id: deployment.tokenId,
    tx_hash: deployment.txHash,
    block_number: deployment.blockNumber,
    timestamp: deployment.timestamp,
    from: deployment.from,
    to: deployment.to,
    is_deployer_eoa: deployment.isDeployerEoa,
    source_available: deployment.sourceAvailable,
    updated_at: deployment.updatedAt,
    created_at: deployment.createdAt,
  }
}
