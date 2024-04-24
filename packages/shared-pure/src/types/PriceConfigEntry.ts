/*
                ====== IMPORTANT NOTICE ======
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE "createPriceId" FUNCTION
*/

import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export type PriceConfigEntry = CoingeckoPriceConfigEntry

interface PriceConfigBase {
  address: EthereumAddress | 'native'
  chain: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface CoingeckoPriceConfigEntry extends PriceConfigBase {
  type: 'coingecko'
  coingeckoId: CoingeckoId
}
