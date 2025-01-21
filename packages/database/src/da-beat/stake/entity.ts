import type { Stake } from '../../kysely/generated/types'

export interface StakeRecord {
  id: string
  totalStake: bigint
  thresholdStake: bigint
}

export function toRecord(entity: Stake): StakeRecord {
  return {
    id: entity.id,
    totalStake: BigInt(entity.totalStake),
    thresholdStake: BigInt(entity.thresholdStake),
  }
}

export function toRow(stake: StakeRecord): Stake {
  return {
    id: stake.id,
    totalStake: Number(stake.totalStake),
    thresholdStake: Number(stake.thresholdStake),
  }
}
