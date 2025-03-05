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
  // token contract address
  address: EthereumAddress | 'native'
  // token chain
  chain: string
  // escrow contract address
  escrowAddress: EthereumAddress
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
  priceId: string
}

export interface ConstAmountFormula {
  type: 'const'
  value: number
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
  // unique identifier
  id: TokenId
  // by default it is set to coingeckoId
  priceId: string
  symbol: string
  name: string
  amount: AmountFormula | CalculationFormula
  // we need this formula to handle relations between tokens on the same chain
  valueForProject?: CalculationFormula | ValueFormula
  // we need this formula to handle relations between chains (L2/L3)
  valueForTotal?: CalculationFormula | ValueFormula
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
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

export type TvsConfig = {
  projectId: ProjectId
  tokens: Token[]
}

export type PriceConfig = {
  priceId: string
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
  total: number
  source: {
    canonical: number
    external: number
    native: number
  }
  category: {
    ether: number
    stablecoin: number
    other: number
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
