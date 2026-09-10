import type { DuneQueryService } from '@l2beat/shared'

export const STAKING_PROJECT_IDS = [
  'aztecnetwork',
  'ethereum',
  'gnosis',
  'polygon-pos',
] as const

export type StakingProjectId = (typeof STAKING_PROJECT_IDS)[number]
export type StakingProjectSelection = StakingProjectId | 'all'

export interface StakingEntity {
  name: string
  stakeBaseUnits: number
}

export interface StakingDataset {
  project: StakingProjectId
  displayName: string
  stakeToken: string
  stakeDecimals: number
  /** Data date reported by the source. Absent when the source has none. */
  snapshotDate?: string
  validatorCount?: number
  totalStakeBaseUnits: number
  /** Absent when the source only reports aggregate data. */
  entities?: StakingEntity[]
}

export interface StakingSourceDeps {
  /** Present only when a selected source needs Dune. */
  dune?: DuneQueryService
}

export type StakingSource = (deps: StakingSourceDeps) => Promise<StakingDataset>
