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
  untilTimestamp?: UnixTime
  category: 'ether' | 'stablecoin' | 'other'
  iconUrl?: string
  chainId: ChainId
  source: 'canonical' | 'external' | 'native'
  supply: 'totalSupply' | 'circulatingSupply' | 'zero'
  excludeFromTotal?: true
  bridgedUsing?: TokenBridgedUsing
}

export interface TokenBridge {
  name: string
  slug?: string
}

export interface TokenBridgedUsing {
  bridges: TokenBridge[]
  warning?: string
}
