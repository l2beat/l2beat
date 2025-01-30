import { daLayers, ethereumDaLayer } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { round } from 'lodash'
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

  const arr = [...daLayers, ethereumDaLayer].map((project) => {
    if (!project.daLayer.economicSecurity) {
      return undefined
    }

    const thresholdStake = stakes[project.daLayer.economicSecurity.name]

    if (!thresholdStake) {
      return undefined
    }

    const currentPrice =
      currentPrices[project.daLayer.economicSecurity.token.coingeckoId]

    if (!currentPrice) {
      return undefined
    }
    const economicSecurity =
      Number((thresholdStake * BigInt(round(currentPrice * 100))) / 100n) /
      10 ** project.daLayer.economicSecurity.token.decimals
    return [project.id, economicSecurity] as const
  })

  return Object.fromEntries(arr.filter(notUndefined))
}

function getMockProjectsEconomicSecurityData(): ProjectsEconomicSecurity {
  return Object.fromEntries(
    daLayers
      .map((project) => {
        if (!project.daLayer.economicSecurity) {
          return undefined
        }
        return [project.id, 100000] as const
      })
      .filter(notUndefined),
  )
}
