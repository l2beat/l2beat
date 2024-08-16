import { daLayers, getDaProjectKey } from '@l2beat/config'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { toDaBridge } from '../utils/get-da-bridge'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'

export async function getDaSummaryEntries() {
  const economicSecurity = await getDaProjectsEconomicSecurity()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const tvlPerProject = await getDaProjectsTvl(uniqueProjectsInUse)
  const getSumFor = pickTvlForProjects(tvlPerProject)

  const entries = daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((daBridge) => {
      const projectEconomicSecurity = economicSecurity[daLayer.id]
      // TODO: Remove it to re-enable per-combination TVL
      const tvlSource = daLayer.kind === 'DAC' ? daBridge : daLayer
      const tvs = getSumFor(tvlSource.usedIn.map((project) => project.id))

      return {
        slug: daLayer.display.slug,
        name: daLayer.display.name,
        href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
        daBridge: toDaBridge(daBridge),
        layerType: kindToType(daLayer.kind),
        risks: getDaRisks(daLayer, daBridge, tvs, projectEconomicSecurity),
        isUnderReview: !!daLayer.isUnderReview || daBridge.isUnderReview,
        isVerified:
          !!projectsVerificationStatuses[getDaProjectKey(daLayer, daBridge)],
        warning: daBridge.display.warning,
        redWarning: daBridge.display.redWarning,
        tvs,
        economicSecurity: projectEconomicSecurity,
        usedIn: daBridge.usedIn,
      }
    }),
  )

  return entries.sort((a, b) => b.tvs - a.tvs)
}

export type DaSummaryEntry = Awaited<
  ReturnType<typeof getDaSummaryEntries>
>[number]
