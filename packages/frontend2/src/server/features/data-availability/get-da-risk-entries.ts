import { daLayers } from '@l2beat/config'
import { toDaBridge } from './utils/get-da-bridge'
import { getDaEconomicSecurity } from './utils/get-da-economic-security'
import { getUniqueProjectsInUse } from './utils/get-da-projects'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from './utils/get-da-projects-tvl'
import { getDaRisks } from './utils/get-da-risks'

export async function getDaRiskEntries() {
  const economicSecurity = await getDaEconomicSecurity()
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const tvlPerProject = await getDaProjectsTvl(uniqueProjectsInUse)
  const getSumFor = pickTvlForProjects(tvlPerProject)

  return daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((bridge) => {
      const tvs = getSumFor(bridge.usedIn)
      const economicSecurityData = economicSecurity[daLayer.id]

      return {
        slug: daLayer.display.slug,
        daLayer: daLayer.display.name,
        daBridge: toDaBridge(bridge),
        risks: getDaRisks(daLayer, bridge, tvs, economicSecurityData),
      }
    }),
  )
}

export type DaRiskEntry = Awaited<ReturnType<typeof getDaRiskEntries>>[number]
