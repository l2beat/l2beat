import { CoingeckoId, EthereumAddress, ProjectId, } from "@l2beat/shared-pure";

export type DataOperator =
  | 'balanceOfEscrow'
  | 'totalSupply'
  | 'circulatingSupply'

export function isDataOperator(value: string): value is DataOperator {
  return ['balanceOfEscrow', 'totalSupply', 'circulatingSupply'].includes(value);
}

export type CalculationOperator =
  | 'sum'
  | 'diff'

export type Operator = DataOperator | CalculationOperator

export type Argument = Formula | string | number

export interface Formula {
  operator: Operator
  arguments?: Argument[]
}

export interface Token {
  id: string,
  amount: Formula
  address: EthereumAddress // unsafe
  chain: string
  ticker: string
  sinceTimestamp: number
  untilTimestamp: number
  decimals: number
  category: 'ether' | 'stablecoin' | 'other'
  source: 'canonical' | 'external' | 'native'
  // TODO: rename
  isAssociatedWithThisChain: string

  displayTicker?: string
}

/*
  {
    "ETH": [
      {
        "coingeckoId": "ethereum"
      },
      {
        coinMarketCapId: "Ethereum"
      }
    ]
  }
*/

export type PriceSources = Map<string, PriceSource[]>

export type PriceSource = CoingeckoPriceSource | CoinMarketCapPriceSource

interface CoingeckoPriceSource {
  coingeckoId: CoingeckoId
}

interface CoinMarketCapPriceSource {
  coinMarketCapId: string
}

export type TvsConfig = {
  project: ProjectId
  tokens: Token[]
}

export type AmountConfig = BalanceAmountConfig | TotalSupplyAmountConfig | CirculatingSupplyAmountConfig

export interface BalanceAmountConfig {
  id: string // hash(type,tokenId,holder).slice(0,8)
  type: 'balanceOf'
  address: EthereumAddress // unsafe
  chain: string
  escrows: string[] // 0x654321...
}

export interface TotalSupplyAmountConfig {
  id: string // hash(type,tokenId).slice(0,8)
  type: 'totalSupply'
  address: EthereumAddress // unsafe
  chain: string
}

export interface CirculatingSupplyAmountConfig {
  id: string // hash(type,tokenId).slice(0,8)
  type: 'circulatingSupply'
  ticker: string
}

export type PriceConfig = {
  id: string // hash(type, tokenId)
  ticker: string
}
