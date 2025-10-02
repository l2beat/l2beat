import round from 'lodash/round'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export async function getDaProjectsEconomicSecurity(): Promise<ProjectsEconomicSecurity> {
  if (env.MOCK) {
    return getMockProjectsEconomicSecurityData()
  }
  return await getProjectsEconomicSecurityData()
}

export type ProjectsEconomicSecurity = Record<string, number | undefined>

async function getProjectsEconomicSecurityData(): Promise<ProjectsEconomicSecurity> {
  // TODO: It's probably better to not fetch all data at once
  const db = getDb()

  const [stakes, currentPrices, projects] = await Promise.all([
    db.daBeatStats.getAll(),
    db.currentPrice.getAll(),
    ps.getProjects({
      select: ['daLayer'],
    }),
  ])

  const stakesById = Object.fromEntries(
    stakes.map((s) => [s.id, s.thresholdStake]),
  )

  const currentPricesById = Object.fromEntries(
    currentPrices.map((p) => [p.coingeckoId, p.priceUsd]),
  )

  const arr = projects.map((project) => {
    if (!project.daLayer.economicSecurity) {
      return undefined
    }

    const thresholdStake = stakesById[project.id]

    if (!thresholdStake) {
      return undefined
    }

    const currentPrice =
      currentPricesById[project.daLayer.economicSecurity.token.coingeckoId]

    if (!currentPrice) {
      return undefined
    }
    const economicSecurity =
      Number((thresholdStake * BigInt(round(currentPrice * 100))) / 100n) /
      10 ** project.daLayer.economicSecurity.token.decimals
    return [project.id, economicSecurity] as const
  })

  return Object.fromEntries(arr.filter((x) => x !== undefined))
}

async function getMockProjectsEconomicSecurityData(): Promise<ProjectsEconomicSecurity> {
  const projects = await ps.getProjects({
    select: ['daLayer'],
  })
  return Object.fromEntries(
    projects
      .map((project) => {
        if (!project.daLayer.economicSecurity) {
          return undefined
        }
        return [project.id, 100000] as const
      })
      .filter((x) => x !== undefined),
  )
}
