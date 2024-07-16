import { type DaLayer } from '@l2beat/config'
import { daEconomicSecurityMeta } from '@l2beat/config/build/src/projects/other/da-beat/types/DaEconomicSecurity'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'

export type DaProjectEconomicSecurity =
  | {
      status: 'Synced'
      economicSecurity: number
    }
  | {
      status: 'StakeNotSynced' | 'CurrentPriceNotSynced'
    }

export async function getDaProjectEconomicSecurity(
  daLayer: DaLayer,
): Promise<DaProjectEconomicSecurity | undefined> {
  noStore()
  return getCachedEconomicSecurity(daLayer)
}

const getCachedEconomicSecurity = cache(
  async (daLayer: DaLayer) => {
    if (daLayer.kind !== 'public-blockchain' || !daLayer.economicSecurity) {
      return undefined
    }

    const type = daLayer.economicSecurity.type

    const stake = await db.stake.findOneById(type)
    if (!stake) {
      return { id: daLayer.id, status: 'StakeNotSynced' as const }
    }

    const meta = daEconomicSecurityMeta[type]
    const coingeckoId = meta?.coingeckoId
    const currentPrice = coingeckoId
      ? await db.currentPrice.findOneByAssetId(coingeckoId)
      : null
    if (!currentPrice) {
      return { id: daLayer.id, status: 'CurrentPriceNotSynced' as const }
    }

    return {
      status: 'Synced' as const,
      // We're intentionally trading precision for ease of use in Client Components
      economicSecurity:
        Number(
          (stake.thresholdStake * BigInt(currentPrice.priceUsd * 100)) / 100n,
        ) /
        10 ** meta.decimals,
    }
  },
  ['daEconomicSecurity'],
  { revalidate: 60 * 60 },
)
