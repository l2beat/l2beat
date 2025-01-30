import { daLayers, ethereumDaLayer } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { compact, keyBy, round } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaProjectsEconomicSecurity(): Promise<ProjectsEconomicSecurity> {
  if (env.MOCK) {
    return getMockProjectsEconomicSecurityData()
  }
  return getProjectsEconomicSecurityData()
}

type ProjectsEconomicSecurity = Record<string, number | undefined>

async function getProjectsEconomicSecurityData(): Promise<ProjectsEconomicSecurity> {
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

    const thresholdStake = stakes[daLayer.economicSecurity.name]

    if (!thresholdStake) {
      return undefined
    }

    const currentPrice =
      currentPrices[daLayer.economicSecurity.token.coingeckoId]

    if (!currentPrice) {
      return undefined
    }
    const economicSecurity =
      Number((thresholdStake * BigInt(round(currentPrice * 100))) / 100n) /
      10 ** daLayer.economicSecurity.token.decimals
    return economicSecurity
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
        return [daLayer.id, 100000] as const
      })
      .filter(notUndefined),
  )
}
