import type {
  BalanceOfEscrowAmountFormula,
  CirculatingSupplyAmountFormula,
  ConstAmountFormula,
  StarknetTotalSupplyAmountFormula,
  TotalSupplyAmountFormula,
  TvsToken,
} from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

export type ProjectTvsConfig = {
  projectId: string
  tokens: TvsToken[]
}

export type PriceConfig = {
  id: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  priceId: string
}

export interface BlockTimestampConfig {
  chainName: string
  configurationId: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface ProjectValueConfig {
  project: string
}

export interface AmountConfigBase {
  id: string
}

export type BalanceOfEscrowAmountConfig = BalanceOfEscrowAmountFormula &
  AmountConfigBase

export type TotalSupplyAmountConfig = TotalSupplyAmountFormula &
  AmountConfigBase

export type StarknetTotalSupplyAmountConfig = StarknetTotalSupplyAmountFormula &
  AmountConfigBase

export type CirculatingSupplyAmountConfig = CirculatingSupplyAmountFormula &
  AmountConfigBase

export type ConstAmountConfig = ConstAmountFormula & AmountConfigBase

export type AmountConfig =
  | BalanceOfEscrowAmountConfig
  | TotalSupplyAmountConfig
  | StarknetTotalSupplyAmountConfig
  | CirculatingSupplyAmountConfig
  | ConstAmountConfig

export type OnchainAmountConfig =
  | BalanceOfEscrowAmountConfig
  | TotalSupplyAmountConfig
  | StarknetTotalSupplyAmountConfig

export function isOnchainAmountConfig(
  config: AmountConfig,
): config is OnchainAmountConfig {
  return (
    config.type === 'totalSupply' ||
    config.type === 'balanceOfEscrow' ||
    config.type === 'starknetTotalSupply'
  )
}

export type TokenValue = Omit<TokenValueRecord, 'configurationId'>

export interface TvsBreakdown {
  tvs: number
  source: {
    canonical: {
      value: number
      tokens: TokenValue[]
    }
    external: {
      value: number
      tokens: TokenValue[]
    }
    native: {
      value: number
      tokens: TokenValue[]
    }
  }
  category: {
    ether: number
    stablecoin: number
    btc: number
    rwaPublic: number
    rwaRestricted: number
    other: number
    associated: number
  }
}

export interface TvsProjectBreakdown {
  scalingTvs: number
  scalingProjects: { projectId: string; value: number }[]
  bridgesTvs: number
  bridgesProjects: { projectId: string; value: number }[]
}
