import type {
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

export type Operator = 'sum' | 'diff' | 'max' | 'min'

export interface CalculationFormula {
  type: 'calculation'
  operator: Operator
  arguments: (CalculationFormula | ValueFormula | AmountFormula)[]
}

export type ValueFormula = {
  type: 'value'
  amount: AmountFormula | CalculationFormula
  priceId: string
}

export type AmountFormula =
  | BalanceOfEscrowAmountFormula
  | TotalSupplyAmountFormula
  | CirculatingSupplyAmountFormula
  | ConstAmountFormula

export interface BalanceOfEscrowAmountFormula {
  type: 'balanceOfEscrow'
  chain: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  // token contract to query balanceOf
  address: EthereumAddress | 'native'
  decimals: number
  // escrow contract address
  escrowAddress: EthereumAddress
}

export interface TotalSupplyAmountFormula {
  type: 'totalSupply'
  chain: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  // token contract address to query totalSupply
  address: EthereumAddress
  decimals: number
}

export interface CirculatingSupplyAmountFormula {
  type: 'circulatingSupply'
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  // token id in coingecko API
  apiId: string
  decimals: number
}

export interface ConstAmountFormula {
  type: 'const'
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  // hardcoded value represented as bigint
  value: string
  decimals: number
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
  mode: 'auto' | 'custom'
  // unique identifier
  id: TokenId
  // by default it is set to coingeckoId
  priceId: string
  symbol: string
  displaySymbol?: string
  name: string
  amount: CalculationFormula | AmountFormula
  // we need this formula to handle relations between tokens on the same chain
  valueForProject?: CalculationFormula | ValueFormula
  // we need this formula to handle relations between chains (L2/L3)
  valueForTotal?: CalculationFormula | ValueFormula
  category: 'ether' | 'stablecoin' | 'other'
  source: 'canonical' | 'external' | 'native'
  isAssociated: boolean
}

export function isEscrowToken(token: Token): token is EscrowToken {
  return token.amount.type === 'balanceOfEscrow'
}

export type EscrowToken = Token & {
  amount: BalanceOfEscrowAmountFormula
}

export type PriceSources = Map<string, PriceSource[]>

export type PriceSource = CoingeckoPriceSource | CoinMarketCapPriceSource

interface CoingeckoPriceSource {
  coingeckoId: CoingeckoId
}

interface CoinMarketCapPriceSource {
  coinMarketCapId: string
}

export type ProjectTvsConfig = {
  projectId: ProjectId
  tokens: Token[]
}

export type PriceConfig = {
  priceId: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface TokenValue {
  tokenConfig: Token
  projectId: ProjectId
  amount: number
  value: number
  valueForProject: number
  valueForTotal: number
}

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
    other: number
    associated: number
  }
}

export type TokenId = string & {
  _TokenIdBrand: string
}

export function TokenId(value: string) {
  return value as unknown as TokenId
}

TokenId.create = function (chain: string, symbol: string) {
  return TokenId(`${chain}-${symbol}`)
}
