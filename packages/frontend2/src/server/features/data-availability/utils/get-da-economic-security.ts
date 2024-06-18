import { daLayers } from '@l2beat/config'
import { daEconomicSecurityMeta } from '@l2beat/config/build/src/projects/other/da-beat/types/DaEconomicSecurity'
import { compact, keyBy } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'

export async function getDaEconomicSecurity() {
  noStore()
  return await getCachedEconomicSecurity()
}

const getCachedEconomicSecurity = cache(
  async () => {
    // TODO: It's probably better to not fetch all data at once

    const stakes = Object.fromEntries(
      (await db.stake.findMany()).map((s) => [s.id, s.thresholdStake]),
    )

    const currentPrices = Object.fromEntries(
      (await db.currentPrice.findMany()).map((p) => [
        p.coingeckoId,
        p.priceUsd,
      ]),
    )

    const arr = daLayers.map((daLayer) => {
      if (daLayer.kind !== 'PublicBlockchain' || !daLayer.economicSecurity) {
        return undefined
      }

      const id = daLayer.id
      const type = daLayer.economicSecurity.type

      const thresholdStake = stakes[type]

      if (!thresholdStake) {
        return { id, status: 'StakeNotSynced' as const }
      }

      const currentPrice = daEconomicSecurityMeta[type]
        ? currentPrices[daEconomicSecurityMeta[type].coingeckoId]
        : undefined

      if (!currentPrice) {
        return { id, status: 'CurrentPriceNotSynced' as const }
      }

      return {
        id,
        status: 'Synced' as const,
        // We're intentionally trading precision for ease of use in Client Components
        economicSecurity: Number(
          (thresholdStake * BigInt(currentPrice * 100)) / 100n,
        ),
      }
    })

    return keyBy(compact(arr), 'id')
  },
  ['daEconomicSecurity'],
  { revalidate: 60 * 60 },
)
