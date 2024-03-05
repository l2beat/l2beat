import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export type Token2 =
  | TotalSupplyToken
  | CirculatingSupplyToken
  | EscrowBalanceToken

export interface EscrowBalanceToken {
  type: 'ESCROW_BALANCE'
  address: EthereumAddress | 'native'
  chain: string
  project: string
  escrow: EthereumAddress
  sinceTimestamp: UnixTime
}

export interface TotalSupplyToken {
  type: 'TOTAL_SUPPLY'
  address: EthereumAddress
  chain: string
  project: string
  sinceTimestamp: UnixTime
}

export interface CirculatingSupplyToken {
  type: 'CIRCULATING_SUPPLY'
  coingeckoId: CoingeckoId
  project: string
  sinceTimestamp: UnixTime
}
