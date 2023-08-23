import { AssetId } from './AssetId'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'
import { ValueType } from './ValueType'

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
  type: ValueType
  premintHolderAddresses?: EthereumAddress[]
  iconUrl?: string
}
