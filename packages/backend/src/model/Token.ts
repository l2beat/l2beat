import { EthereumAddress } from './EthereumAddress'

export interface Token {
  id: string
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
