import { daLayers, getDaProjectKey } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
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
    // Calculate total TVS for each bridge
    .map((daLayer) => ({
      ...daLayer,
      tvs: getSumFor(
        daLayer.bridges.flatMap((bridge) =>
          bridge.usedIn.map((project) => project.id),
        ),
      ),
    }))
    // Sort by TVS
    .sort((a, b) => b.tvs - a.tvs)
    .map((daLayer) => {
      const daBridges = daLayer.bridges
        .map((daBridge) => {
          const tvs = getSumFor(daBridge.usedIn.map((project) => project.id))
          const economicSecurityData = economicSecurity[daLayer.id]

          return {
            name: daLayer.display.name,
            slug: daLayer.display.slug,
            kind: daLayer.kind,
            layerType: kindToType(daLayer.kind),
            href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
            daBridge: toDaBridge(daBridge),
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
            subRows: [],
            tvs,
          }
        })
        .sort((a, b) => b.tvs - a.tvs)

      if (daBridges.length === 0) {
        return []
      } else if (daBridges.length === 1 && daBridges[0]) {
        return daBridges
      }

      assert(daBridges[0], 'Expected at least one bridge')

      return [
        {
          name: daLayer.display.name,
          slug: daLayer.display.slug,
          kind: daLayer.kind,
          layerType: kindToType(daLayer.kind),
          daBridge: 'multiple' as const,
          href: daBridges[0]?.href,
          warning: undefined,
          redWarning: undefined,
          isVerified: true,
          risks: {
            economicSecurity: daLayer.risks.economicSecurity,
            fraudDetection: daLayer.risks.fraudDetection,
          } as DaEntryRisk,
          subRows: daBridges.map((daBridge) => ({
            ...daBridge,
            risks: {
              ...daBridge.risks,
              economicSecurity: undefined,
              fraudDetection: undefined,
            } as DaEntryRisk,
          })),
          tvs: daLayer.tvs,
        },
      ]
    })

  return entries.flat()
}

export type DaRiskEntry = Awaited<ReturnType<typeof getDaRiskEntries>>[number]
