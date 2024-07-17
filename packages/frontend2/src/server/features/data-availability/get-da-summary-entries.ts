import { daLayers } from '@l2beat/config'
import { toDaBridge } from './utils/get-da-bridge'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from './utils/get-da-projects-tvl'
import { getDaRisks } from './utils/get-da-risks'
import { kindToType } from './utils/kind-to-layer-type'
import { getDaProjectsEconomicSecurity } from './utils/get-da-projects-economic-security'
import { getUsedInProjects } from './utils/get-used-in-projects'

export async function getDaSummaryEntries() {
  const economicSecurity = await getDaProjectsEconomicSecurity()
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const tvlPerProject = await getDaProjectsTvl(uniqueProjectsInUse)
  const getSumFor = pickTvlForProjects(tvlPerProject)

  return daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((bridge) => {
      const tvs = getSumFor(bridge.usedIn)

      return {
        slug: daLayer.display.slug,
        daLayer: daLayer.display.name,
        daBridge: toDaBridge(bridge),
        layerType: kindToType(daLayer.kind),
        risks: getDaRisks(daLayer, bridge),
        isUnderReview: !!daLayer.isUnderReview || bridge.isUnderReview,
        tvs,
        economicSecurity: economicSecurity[daLayer.id],
        // TODO: maybe we can specify names in the config instead of projectIds
        usedIn: getUsedInProjects(bridge),
      }
    }),
  )
}

export type DaSummaryEntry = Awaited<
  ReturnType<typeof getDaSummaryEntries>
>[number]

function getUniqueProjectsInUse() {
  return [
    ...new Set(
      daLayers
        .map((daLayer) => daLayer.bridges.map((bridge) => bridge.usedIn))
        .flat(2),
    ),
  ]
}
