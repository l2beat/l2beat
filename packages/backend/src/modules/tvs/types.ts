import {
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

export type Operator = 'sum' | 'diff'

export interface Formula {
  operator: Operator
  arguments: ValueFormula[]
}

export type ValueFormula = {
  amount: AmountFormula
  // token ticker
  ticker: string
}

export type AmountFormula =
  | BalanceOfEscrowAmountFormula
  | TotalSupplyAmountFormula
  | CirculatingSupplyAmountFormula

export interface BalanceOfEscrowAmountFormula {
  type: 'balanceOfEscrow'
  // token contract address
  address: EthereumAddress
  // token chain
  chain: string
  // escrow contract addresses
  escrowAddresses: string[]
  // decimals
  decimals: number
}

export interface TotalSupplyAmountFormula {
  type: 'totalSupply'
  // token contract address
  address: EthereumAddress
  // token chain
  chain: string
  // decimals
  decimals: number
}

export interface CirculatingSupplyAmountFormula {
  type: 'circulatingSupply'
  // token ticker
  ticker: string
}

export interface AmountConfigBase {
  id: string
}

export type BalanceOfEscrowAmountConfig = BalanceOfEscrowAmountFormula &
  AmountConfigBase

export type TotalSupplyAmountConfig = TotalSupplyAmountFormula &
  AmountConfigBase

export type CirculatingSupplyAmountConfig = CirculatingSupplyAmountFormula &
  AmountConfigBase

export type AmountConfig =
  | BalanceOfEscrowAmountConfig
  | TotalSupplyAmountConfig
  | CirculatingSupplyAmountConfig

// token deployed to single chain
export interface Token {
  id: string
  ticker: string
  amount: AmountFormula
  // we need this formula to handle relations between tokens on the same chain
  valueForProject?: Formula
  // we need this formula to handle relations between chains (L2/L3)
  valueForTotal?: Formula
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  category: 'ether' | 'stablecoin' | 'other'
  source: 'canonical' | 'external' | 'native'
  isAssociated: boolean
}

export type PriceSources = Map<string, PriceSource[]>

export type PriceSource = CoingeckoPriceSource | CoinMarketCapPriceSource

interface CoingeckoPriceSource {
  coingeckoId: CoingeckoId
}

interface CoinMarketCapPriceSource {
  coinMarketCapId: string
}

export type TvsConfig = {
  projectId: ProjectId
  tokens: Token[]
}

export type PriceConfig = {
  id: string
  ticker: string
}

export interface TokenValue {
  tokenId: string
  projectId: ProjectId
  amount: bigint
  value: number
  valueForProject?: number
  valueForTotal?: number
}
