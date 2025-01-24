import { daLayers, ethereumDaLayer } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { compact, keyBy, round } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { type EconomicSecurityData } from '../project/utils/get-da-project-economic-security'

export async function getDaProjectsEconomicSecurity(): Promise<
  Record<string, EconomicSecurityData>
> {
  if (env.MOCK) {
    return getMockProjectsEconomicSecurityData()
  }
  return getProjectsEconomicSecurityData()
}

type ProjectsEconomicSecurity = Awaited<
  ReturnType<typeof getProjectsEconomicSecurityData>
>
async function getProjectsEconomicSecurityData() {
  // TODO: It's probably better to not fetch all data at once
  const db = getDb()
  const stakes = Object.fromEntries(
    (await db.stake.getAll()).map((s) => [s.id, s.thresholdStake]),
  )

  const currentPrices = Object.fromEntries(
    (await db.currentPrice.getAll()).map((p) => [p.coingeckoId, p.priceUsd]),
  )

  const arr = [...daLayers, ethereumDaLayer].map((daLayer) => {
    if (
      !(
        daLayer.kind === 'PublicBlockchain' ||
        daLayer.kind === 'EthereumDaLayer'
      ) ||
      !daLayer.economicSecurity
    ) {
      return undefined
    }

    const id = daLayer.id
    const thresholdStake = stakes[daLayer.economicSecurity.name]

    if (!thresholdStake) {
      return { id, status: 'StakeNotSynced' as const }
    }

    const currentPrice =
      currentPrices[daLayer.economicSecurity.token.coingeckoId]

    if (!currentPrice) {
      return { id, status: 'CurrentPriceNotSynced' as const }
    }
    return {
      id,
      status: 'Synced' as const,
      // We're intentionally trading precision for ease of use in Client Components
      economicSecurity:
        Number((thresholdStake * BigInt(round(currentPrice * 100))) / 100n) /
        10 ** daLayer.economicSecurity.token.decimals,
    }
  })

  return keyBy(compact(arr), 'id')
}

function getMockProjectsEconomicSecurityData(): ProjectsEconomicSecurity {
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
