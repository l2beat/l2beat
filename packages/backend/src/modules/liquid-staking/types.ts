import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface LiquidStakingProjectConfig {
  configurationId: string
  projectId: ProjectId
  /** The later of the charts' start and the token's launch. */
  sinceTimestamp: UnixTime
  contracts: ProjectLiquidStakingContracts
}

export interface LiquidStakingConfig {
  sinceTimestamp: UnixTime
  projects: LiquidStakingProjectConfig[]
}
