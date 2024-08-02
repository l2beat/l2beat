import { AssetId } from './AssetId'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { ProjectId } from './ProjectId'
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
  project?: ProjectId
  source: 'canonical' | 'external' | 'native'
  supply: 'totalSupply' | 'circulatingSupply' | 'preminted' | 'zero'
  escrows?: EthereumAddress[]
  bridgedUsing?: {
    bridge: string
    slug?: string
    warning?: string
  }
}
