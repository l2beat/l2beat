import type { AssetId } from './AssetId'
import type { ChainId } from './ChainId'
import type { CoingeckoId } from './CoingeckoId'
import type { EthereumAddress } from './EthereumAddress'
import type { UnixTime } from './UnixTime'

export interface LegacyToken {
  id: AssetId
  name: string
  coingeckoId: CoingeckoId
  address?: EthereumAddress
  symbol: string
  decimals: number
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  category:
    | 'ether'
    | 'stablecoin'
    | 'btc'
    | 'rwaRestricted'
    | 'rwaPublic'
    | 'other'
  iconUrl?: string
  chainId: ChainId
  chainName: string
  url?: string
  source: 'canonical' | 'external' | 'native'
  supply: 'totalSupply' | 'circulatingSupply' | 'zero'
  excludeFromTotal?: true
  bridgedUsing?: LegacyTokenBridgedUsing
  premint?: string
  rwaMetadata?: RwaTokenMetadata
}

export interface LegacyTokenBridge {
  name: string
  slug?: string
}

export interface LegacyTokenBridgedUsing {
  bridges: LegacyTokenBridge[]
  warning?: string
}

export interface RwaTokenMetadata {
  isStablecoin: boolean | null
  isOnRWA: boolean
  categories: string[]
}
