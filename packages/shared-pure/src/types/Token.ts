import { AssetId } from './AssetId'
import { AssetType } from './AssetType'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export interface Token {
  id: AssetId

  name: string
  symbol: string
  decimals: number
  iconUrl?: string

  chainId: ChainId
  address?: EthereumAddress
  coingeckoId: CoingeckoId

  sinceTimestamp: UnixTime

  type: AssetType
  formula: 'totalSupply' | 'locked' | 'circulatingSupply'
  bridgedUsing?: string

  /** @deprecated */
  category: 'ether' | 'stablecoin' | 'other'
}
