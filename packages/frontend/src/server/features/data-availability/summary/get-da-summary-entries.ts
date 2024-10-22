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

export async function getDaSummaryEntries() {
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const [economicSecurity, projectsVerificationStatuses, tvlPerProject] =
    await Promise.all([
      getDaProjectsEconomicSecurity(),
      getProjectsVerificationStatuses(),
      getDaProjectsTvl(uniqueProjectsInUse),
    ])
  const getSumFor = pickTvlForProjects(tvlPerProject)

  const entries = daLayers
    // Calculate total TVS and organize bridges per DA layer
    .map((daLayer) => {
      const bridges = daLayer.bridges
        .map((daBridge) => {
          const tvs = getSumFor(daBridge.usedIn.map((project) => project.id))
          const projectEconomicSecurity = economicSecurity[daLayer.id]

          return {
            slug: daBridge.display.slug,
            name: daBridge.display.name,
            href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
            type: daBridge.type,
            risks: getDaRisks(daLayer, daBridge, tvs, projectEconomicSecurity),
            isUnderReview: !!daLayer.isUnderReview || daBridge.isUnderReview,
            isVerified:
              !!projectsVerificationStatuses[
                getDaProjectKey(daLayer, daBridge)
              ],
            warning: daBridge.display.warning,
            redWarning: daBridge.display.redWarning,
            tvs,
            usedIn: daBridge.usedIn.sort(
              (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
            ),
          }
        })
        .sort((a, b) => b.tvs - a.tvs)

      return {
        slug: daLayer.display.slug,
        name: daLayer.display.name,
        kind: daLayer.kind,
        systemCategory: daLayer.systemCategory,
        hasChallengeMechanism: daLayer.hasChallengeMechanism,
        fallback: daLayer.fallback,
        isUnderReview: !!daLayer.isUnderReview,
        layerType: kindToType(daLayer.kind),
        economicSecurity: economicSecurity[daLayer.id],
        usedIn: daLayer.bridges
          .flatMap((bridge) => bridge.usedIn)
          .sort((a, b) => getSumFor([b.id]) - getSumFor([a.id])),
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

export type DaSummaryEntry = Awaited<
  ReturnType<typeof getDaSummaryEntries>
>[number]
