import { Stake as StakeEntity } from '../kysely/generated/types'

export interface Stake {
  chainId: number
  totalStake: number
  thresholdStake: number
}

export function fromEntity(entity: StakeEntity): Stake {
  return entity
}

export function toEntity(stake: Stake): StakeEntity {
  return stake
}
