import type { AssetId } from './AssetId'
import type { ChainId } from './ChainId'
import type { CoingeckoId } from './CoingeckoId'
import type { EthereumAddress } from './EthereumAddress'
import type { UnixTime } from './UnixTime'

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
  chainName: string
  url?: string
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
