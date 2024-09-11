import { daLayers } from '@l2beat/config'
import { daEconomicSecurityMeta } from '@l2beat/config/build/src/projects/other/da-beat/types/DaEconomicSecurity'
import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import { compact, keyBy, round } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { type EconomicSecurityData } from '../project/utils/get-da-project-economic-security'

export async function getDaProjectsEconomicSecurity(): Promise<
  Record<string, EconomicSecurityData>
> {
  if (env.MOCK) {
    return getMockProjectsEconomicSecurity()
  }
  noStore()
  return await getCachedProjectsEconomicSecurity()
}

type ProjectsEconomicSecurity = Awaited<
  ReturnType<typeof getCachedProjectsEconomicSecurity>
>
const getCachedProjectsEconomicSecurity = cache(
  async () => {
    // TODO: It's probably better to not fetch all data at once

    const stakes = Object.fromEntries(
      (await db.stake.getAll()).map((s) => [s.id, s.thresholdStake]),
    )

    const currentPrices = Object.fromEntries(
      (await db.currentPrice.getAll()).map((p) => [p.coingeckoId, p.priceUsd]),
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

      const meta = daEconomicSecurityMeta[type]

      const currentPrice = meta ? currentPrices[meta.coingeckoId] : undefined

      if (!currentPrice) {
        return { id, status: 'CurrentPriceNotSynced' as const }
      }
      return {
        id,
        status: 'Synced' as const,
        // We're intentionally trading precision for ease of use in Client Components
        economicSecurity:
          Number((thresholdStake * BigInt(round(currentPrice * 100))) / 100n) /
          10 ** meta.decimals,
      }
    })

    return keyBy(compact(arr), 'id')
  },
  ['daEconomicSecurity'],
  { revalidate: 10 * UnixTime.MINUTE },
)

function getMockProjectsEconomicSecurity(): ProjectsEconomicSecurity {
  return Object.fromEntries(
    daLayers
      .map((daLayer) => {
        if (daLayer.kind !== 'PublicBlockchain' || !daLayer.economicSecurity) {
          return undefined
        }
        return [
          daLayer.id,
          {
            id: daLayer.id,
            status: 'Synced' as const,
            economicSecurity: 100000,
          },
        ] as const
      })
      .filter(notUndefined),
  )
}
