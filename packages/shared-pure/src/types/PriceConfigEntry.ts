/*
                ====== IMPORTANT NOTICE ======
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE "createPriceId" FUNCTION
*/

import { z } from 'zod'
import { AssetId } from './AssetId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'
import { branded, stringAs } from './branded'

export const PriceConfigBase = z.object({
  assetId: stringAs(AssetId),
  address: z.union([stringAs(EthereumAddress), z.literal('native')]),
  chain: z.string(),
  sinceTimestamp: branded(z.number(), (n) => new UnixTime(n)),
  untilTimestamp: branded(z.number().optional(), (n) =>
    n !== undefined ? new UnixTime(n) : undefined,
  ),
})
export type PriceConfigBase = z.infer<typeof PriceConfigBase>

export const CoingeckoPriceConfigEntry = PriceConfigBase.extend({
  type: z.literal('coingecko'),
  coingeckoId: stringAs(CoingeckoId),
})
export type CoingeckoPriceConfigEntry = z.infer<
  typeof CoingeckoPriceConfigEntry
>

export type PriceConfigEntry = CoingeckoPriceConfigEntry
