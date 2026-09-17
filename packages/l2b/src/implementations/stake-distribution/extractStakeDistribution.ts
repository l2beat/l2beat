import type { ProjectInclusionDelayChartStakeDistribution } from '@l2beat/config'
import type { StakingDataset, StakingEntity } from './types'

export function extractStakeDistribution(
  dataset: StakingDataset,
  limit: number,
): ProjectInclusionDelayChartStakeDistribution {
  const date =
    dataset.snapshotDate !== undefined
      ? { dateType: 'snapshot' as const, date: dataset.snapshotDate }
      : { dateType: 'fetched' as const, date: new Date().toISOString() }

  const distribution: ProjectInclusionDelayChartStakeDistribution = {
    stakeToken: dataset.stakeToken,
    ...date,
    totalStake: toRoundedTokenAmount(
      dataset.totalStakeBaseUnits,
      dataset.stakeDecimals,
    ),
  }

  if (dataset.validatorCount !== undefined) {
    distribution.validatorCount = dataset.validatorCount
  }
  if (dataset.entities !== undefined) {
    distribution.entities = getLargestEntities(dataset.entities, limit).map(
      (entity) => ({
        name: entity.name,
        stake: toRoundedTokenAmount(
          entity.stakeBaseUnits,
          dataset.stakeDecimals,
        ),
      }),
    )
  }

  return distribution
}

export function getLargestEntities(
  entities: StakingEntity[],
  limit: number,
): StakingEntity[] {
  return [...entities]
    .sort((a, b) => b.stakeBaseUnits - a.stakeBaseUnits)
    .slice(0, limit)
}

export function toTokenAmount(
  stakeBaseUnits: number,
  decimals: number,
): number {
  return stakeBaseUnits / 10 ** decimals
}

export function toRoundedTokenAmount(
  stakeBaseUnits: number,
  decimals: number,
): number {
  return Math.round(toTokenAmount(stakeBaseUnits, decimals))
}
