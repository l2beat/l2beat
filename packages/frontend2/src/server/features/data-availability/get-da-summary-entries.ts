import { daLayers } from '@l2beat/config'
import { toDaBridge } from './utils/get-da-bridge'
import { getUniqueProjectsInUse } from './utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from './utils/get-da-projects-economic-security'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from './utils/get-da-projects-tvl'
import { getDaRisks } from './utils/get-da-risks'
import { getUsedInProjects } from './utils/get-used-in-projects'
import { kindToType } from './utils/kind-to-layer-type'

export async function getDaSummaryEntries() {
  const economicSecurity = await getDaProjectsEconomicSecurity()
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const tvlPerProject = await getDaProjectsTvl(uniqueProjectsInUse)
  const getSumFor = pickTvlForProjects(tvlPerProject)

  return daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((bridge) => {
      const tvs = getSumFor(bridge.usedIn)
      const projectEconomicSecurity = economicSecurity[daLayer.id]

      return {
        slug: daLayer.display.slug,
        name: daLayer.display.name,
        href: `/data-availability/projects/${daLayer.display.slug}/${bridge.display.slug}`,
        daBridge: toDaBridge(bridge),
        layerType: kindToType(daLayer.kind),
        risks: getDaRisks(daLayer, bridge, tvs, projectEconomicSecurity),
        isUnderReview: !!daLayer.isUnderReview || bridge.isUnderReview,
        tvs,
        economicSecurity: projectEconomicSecurity,
        // TODO: maybe we can specify names in the config instead of projectIds
        usedIn: getUsedInProjects(bridge),
      }
    }),
  )
}

export type DaSummaryEntry = Awaited<
  ReturnType<typeof getDaSummaryEntries>
>[number]
