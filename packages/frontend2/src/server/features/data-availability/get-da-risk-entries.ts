import { daLayers } from '@l2beat/config'
import { toDaBridge } from './utils/get-da-bridge'
import { getUniqueProjectsInUse } from './utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from './utils/get-da-projects-economic-security'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from './utils/get-da-projects-tvl'
import { getDaRisks } from './utils/get-da-risks'

export async function getDaRiskEntries() {
  const economicSecurity = await getDaProjectsEconomicSecurity()
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const tvlPerProject = await getDaProjectsTvl(uniqueProjectsInUse)
  const getSumFor = pickTvlForProjects(tvlPerProject)

  const entries = daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((bridge) => {
      const tvs = getSumFor(bridge.usedIn.map((project) => project.id))
      const economicSecurityData = economicSecurity[daLayer.id]

      return {
        name: daLayer.display.name,
        slug: daLayer.display.slug,
        href: `/data-availability/projects/${daLayer.display.slug}/${bridge.display.slug}`,
        daBridge: toDaBridge(bridge),
        risks: getDaRisks(daLayer, bridge, tvs, economicSecurityData),
        tvs,
      }
    }),
  )

  return entries.sort((a, b) => b.tvs - a.tvs)
}

export type DaRiskEntry = Awaited<ReturnType<typeof getDaRiskEntries>>[number]
