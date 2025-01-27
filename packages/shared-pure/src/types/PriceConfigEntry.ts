/*
                ====== IMPORTANT NOTICE ======
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE "createPriceId" FUNCTION
*/

import type { AssetId } from './AssetId'
import type { CoingeckoId } from './CoingeckoId'
import type { EthereumAddress } from './EthereumAddress'
import type { UnixTime } from './UnixTime'

export type PriceConfigEntry = CoingeckoPriceConfigEntry

interface PriceConfigBase {
  assetId: AssetId
  address: EthereumAddress | 'native'
  chain: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface CoingeckoPriceConfigEntry extends PriceConfigBase {
  type: 'coingecko'
  coingeckoId: CoingeckoId
}
