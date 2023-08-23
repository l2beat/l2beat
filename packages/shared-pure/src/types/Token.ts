import { AssetId } from './AssetId'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'
import { ValueType } from './ValueType'

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

  /** @deprecated */
  category: 'ether' | 'stablecoin' | 'other'
  bucket: ValueType
  formula: 'totalSupply' | 'locked' | 'circulatingSupply'

  // premintHolderAddresses?: EthereumAddress[]
}
