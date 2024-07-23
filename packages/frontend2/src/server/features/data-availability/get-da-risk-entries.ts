import { daLayers, getDaProjectKey } from '@l2beat/config'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
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
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const tvlPerProject = await getDaProjectsTvl(uniqueProjectsInUse)
  const getSumFor = pickTvlForProjects(tvlPerProject)

  return daLayers.flatMap((daLayer) =>
    daLayer.bridges.map((daBridge) => {
      const tvs = getSumFor(daBridge.usedIn.map((project) => project.id))
      const economicSecurityData = economicSecurity[daLayer.id]

      return {
        name: daLayer.display.name,
        slug: daLayer.display.slug,
        href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
        daBridge: toDaBridge(daBridge),
        warning: daBridge.display.warning,
        redWarning: daBridge.display.redWarning,
        isVerified:
          projectsVerificationStatuses[getDaProjectKey(daLayer, daBridge)],
        risks: getDaRisks(daLayer, daBridge, tvs, economicSecurityData),
      }
    }),
  )
}

export type DaRiskEntry = Awaited<ReturnType<typeof getDaRiskEntries>>[number]
