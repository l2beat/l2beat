import { AssetId } from './AssetId'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export interface Token {
  id: AssetId
  name: string
  coingeckoId: CoingeckoId
  address?: EthereumAddress
  symbol: string
  decimals: number
  sinceTimestamp: UnixTime
  /** @deprecated */
  category: 'ether' | 'stablecoin' | 'other'
  iconUrl?: string
  chainId: ChainId
  type: 'CBV' | 'EBV' | 'NMV'
  formula: 'totalSupply' | 'locked' | 'circulatingSupply'
  bridgedUsing?: {
    bridge: string
    slug?: string
  }
}
