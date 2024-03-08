import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export interface TokenQuery {
  address: EthereumAddress | 'native'
  chain: string
  sinceTimestamp: UnixTime
  price: { type: 'coingecko'; coingeckoId: CoingeckoId }
  amount:
    | { type: 'totalSupply'; address: EthereumAddress }
    | { type: 'circulatingSupply'; coingeckoId: CoingeckoId }
    | { type: 'escrow'; escrowAddress: EthereumAddress }
}
