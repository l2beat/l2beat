import { AssetId, EthereumAddress } from '@l2beat/common'

export interface Token {
  id: AssetId
  symbol: string
  decimals: number
  address: EthereumAddress
  priceStrategy: PriceStrategy
}

export type PriceStrategy =
  | EtherPriceStrategy
  | ConstantPriceStrategy
  | MarketPriceStrategy

export interface EtherPriceStrategy {
  type: 'ether'
}

export interface ConstantPriceStrategy {
  type: 'constant'
  value: bigint
}

export interface MarketPriceStrategy {
  type: 'market'
}
