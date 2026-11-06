import type {
  ProjectLiquidStakingContracts,
  ProjectLiquidStakingMarketQuote,
} from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface LiquidStakingProjectConfig {
  configurationId: string
  projectId: ProjectId
  contracts: ProjectLiquidStakingContracts
  marketQuotes: ProjectLiquidStakingMarketQuote[]
}

export interface LiquidStakingConfig {
  sinceTimestamp: UnixTime
  projects: LiquidStakingProjectConfig[]
}
