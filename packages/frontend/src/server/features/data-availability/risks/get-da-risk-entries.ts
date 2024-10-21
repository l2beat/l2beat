import { daLayers, getDaProjectKey } from '@l2beat/config'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'
import { type DaEntryRisk } from '../utils/types'

export async function getDaRiskEntries() {
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const [economicSecurity, projectsVerificationStatuses, tvlPerProject] =
    await Promise.all([
      getDaProjectsEconomicSecurity(),
      getProjectsVerificationStatuses(),
      getDaProjectsTvl(uniqueProjectsInUse),
    ])
  const getSumFor = pickTvlForProjects(tvlPerProject)

  const entries = daLayers
    // Calculate total TVS for each DA layer and organize bridges per layer
    .map((daLayer) => {
      const bridges = daLayer.bridges
        .map((daBridge) => {
          const tvs = getSumFor(daBridge.usedIn.map((project) => project.id))
          const economicSecurityData = economicSecurity[daLayer.id]

          return {
            name: daBridge.display.name,
            slug: daBridge.display.slug,
            type: daBridge.type,
            href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
            warning: daBridge.display.warning,
            redWarning: daBridge.display.redWarning,
            isVerified:
              projectsVerificationStatuses[getDaProjectKey(daLayer, daBridge)],
            risks: getDaRisks(
              daLayer,
              daBridge,
              tvs,
              economicSecurityData,
            ) as DaEntryRisk,
            tvs,
          }
        })
        .sort((a, b) => b.tvs - a.tvs)

      return {
        name: daLayer.display.name,
        slug: daLayer.display.slug,
        kind: daLayer.kind,
        systemCategory: daLayer.systemCategory,
        layerType: kindToType(daLayer.kind),
        risks: {
          economicSecurity: daLayer.risks.economicSecurity,
          fraudDetection: daLayer.risks.fraudDetection,
        },
        bridges,
        tvs: getSumFor(
          daLayer.bridges.flatMap((bridge) =>
            bridge.usedIn.map((project) => project.id),
          ),
        ),
      }
    })
    // Sort by total TVS of DA layers
    .sort((a, b) => b.tvs - a.tvs)

  return entries
}

export type DaRiskEntry = Awaited<ReturnType<typeof getDaRiskEntries>>[number]
