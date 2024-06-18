import { Stake as StakeEntity } from '../kysely/generated/types'

export interface Stake {
  id: string
  totalStake: bigint
  thresholdStake: bigint
}

export function fromEntity(entity: StakeEntity): Stake {
  return {
    id: entity.id,
    totalStake: BigInt(entity.totalStake),
    thresholdStake: BigInt(entity.thresholdStake),
  }
}

export function toEntity(stake: Stake): StakeEntity {
  return {
    id: stake.id,
    totalStake: stake.totalStake.toString(),
    thresholdStake: stake.thresholdStake.toString(),
  }
}
