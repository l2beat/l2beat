import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export interface Token2 {
  address: EthereumAddress | 'native'
  chain: string
  sinceTimestamp: UnixTime
  price: { type: 'coingecko'; coingeckoId: CoingeckoId }
  amount:
    | { type: 'totalSupply'; address: EthereumAddress }
    | { type: 'circulatingSupply'; coingeckoId: CoingeckoId }
    | { type: 'escrow'; escrowAddress: EthereumAddress }

  // TODO: This should be a ProjectId, not a string
  // for now it is used only for status endpoint
  // before production use it should be changed
  project: string
  symbol: string
  name: string
}
