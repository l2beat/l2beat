import { AssetId, CoingeckoId, EthereumAddress } from '@l2beat/shared-pure'

export interface Token {
  id: AssetId
  symbol: string
  decimals: number
  address?: EthereumAddress
  coingeckoId: CoingeckoId
}
