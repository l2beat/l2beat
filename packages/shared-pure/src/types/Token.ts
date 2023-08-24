import { AssetId } from './AssetId'
import { AssetType } from './AssetType'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export interface Token {
  name: string
  id: AssetId
  coingeckoId: CoingeckoId
  address?: EthereumAddress
  symbol: string
  decimals: number
  sinceTimestamp: UnixTime
  category: 'ether' | 'stablecoin' | 'other'
  chainId: ChainId
  type: AssetType
  premintHolderAddresses?: EthereumAddress[]
  iconUrl?: string
}
