import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export type PriceConfigEntry = CoingeckoPriceConfigEntry

interface PriceConfigBase {
  address: EthereumAddress | 'native'
  chain: string
  sinceTimestamp: UnixTime
}

export interface CoingeckoPriceConfigEntry extends PriceConfigBase {
  type: 'coingecko'
  coingeckoId: CoingeckoId
}
