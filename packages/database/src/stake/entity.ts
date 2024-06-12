import { Stake as StakeEntity } from '../kysely/generated/types'

export interface Stake {
  chainId: number
  totalStake: number
  thresholdStake: number
  assetId: string
}

export function fromEntity(entity: StakeEntity): Stake {
  return {
    chainId: entity.chain_id,
    totalStake: entity.total_stake,
    thresholdStake: entity.threshold_stake,
    assetId: entity.asset_id,
  }
}

export function toEntity(stake: Stake): StakeEntity {
  return {
    chain_id: stake.chainId,
    total_stake: stake.totalStake,
    threshold_stake: stake.thresholdStake,
    asset_id: stake.assetId,
  }
}
