import { AssetId, CoingeckoId, EthereumAddress } from '@l2beat/types'

export interface Token {
  id: AssetId
  symbol: string
  decimals: number
  address?: EthereumAddress
  coingeckoId: CoingeckoId
}
