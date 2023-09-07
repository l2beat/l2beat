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

  // When adding a new token make sure that this value is correct
  // for locked & totalSupply check the deployment tx date
  // for circulatingSupply check the coingecko MAX range chart and find oldest date
  sinceTimestamp: UnixTime

  type: AssetType
  formula: 'totalSupply' | 'locked' | 'circulatingSupply'

  /** @deprecated */
  category: 'ether' | 'stablecoin' | 'other'
}
