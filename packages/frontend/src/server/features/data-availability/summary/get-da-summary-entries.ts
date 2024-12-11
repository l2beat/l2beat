import { daLayers, ethereumDaLayer } from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { getDaBridgeVerification } from '../../verification-status/get-projects-verification-statuses'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaLayerRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'

export async function getDaSummaryEntries() {
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const [economicSecurity, tvlPerProject] = await Promise.all([
    getDaProjectsEconomicSecurity(),
    getDaProjectsTvl(uniqueProjectsInUse),
  ])
  const getTvlSumFor = pickTvlForProjects(tvlPerProject)

  const entries = getEntries({
    economicSecurity,
    getTvlSumFor,
  })

  const ethereumEntry = getEthereumEntry({
    economicSecurity,
    getTvlSumFor,
  })

  return { entries, ethereumEntry }
}

type Dependencies = {
  economicSecurity: Awaited<ReturnType<typeof getDaProjectsEconomicSecurity>>
  getTvlSumFor: (projectIds: ProjectId[]) => number
}

// Regular entries
function getEntries({ economicSecurity, getTvlSumFor }: Dependencies) {
  return (
    daLayers
      // Calculate total TVS and organize bridges per DA layer
      .map((daLayer) => {
        const projectEconomicSecurity = economicSecurity[daLayer.id]

        const bridges = daLayer.bridges
          .map((daBridge) => {
            const tvs = getTvlSumFor(
              daBridge.usedIn.map((project) => project.id),
            )

            const base = {
              slug: daBridge.display.slug,
              name: daBridge.display.name,
              href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
              risks: daBridge.risks,
              isUnderReview: !!daLayer.isUnderReview || daBridge.isUnderReview,
              isVerified: getDaBridgeVerification(daLayer, daBridge),
              warning: daBridge.display.warning,
              redWarning: daBridge.display.redWarning,
              tvs,
              usedIn: daBridge.usedIn.sort(
                (a, b) => getTvlSumFor([b.id]) - getTvlSumFor([a.id]),
              ),
            }

            if (daBridge.type === 'DAC') {
              return {
                ...base,
                type: 'DAC' as const,
                membersCount: daBridge.membersCount,
                requiredMembers: daBridge.requiredMembers,
                knownMembers: daBridge.knownMembers,
                hideMembers: daBridge.hideMembers,
              }
            }

            return { ...base, type: daBridge.type }
          })
          .sort((a, b) => b.tvs - a.tvs)

        const layerTvs = getTvlSumFor(
          uniq(
            daLayer.bridges.flatMap((bridge) =>
              bridge.usedIn.map((project) => project.id),
            ),
          ),
        )
        const layerRisks = getDaLayerRisks(
          daLayer,
          layerTvs,
          projectEconomicSecurity,
        )

        return {
          slug: daLayer.display.slug,
          name: daLayer.display.name,
          kind: daLayer.kind,
          href: bridges[0]?.href,
          systemCategory: daLayer.systemCategory,
          challengeMechanism: daLayer.challengeMechanism,
          fallback: daLayer.fallback,
          isUnderReview: !!daLayer.isUnderReview,
          layerType: kindToType(daLayer.kind),
          economicSecurity: projectEconomicSecurity,
          usedIn: daLayer.bridges
            .flatMap((bridge) => bridge.usedIn)
            .sort((a, b) => getTvlSumFor([b.id]) - getTvlSumFor([a.id])),
          risks: layerRisks,
          bridges,
          tvs: layerTvs,
        }
      })
      // Sort by total TVS of DA layers
      .sort((a, b) => b.tvs - a.tvs)
  )
}

// Special case for Ethereum DA entry at the top of the table
function getEthereumEntry({ economicSecurity, getTvlSumFor }: Dependencies) {
  return {
    slug: ethereumDaLayer.display.slug,
    name: ethereumDaLayer.display.name,
    kind: ethereumDaLayer.kind,
    href: `/data-availability/projects/${ethereumDaLayer.display.slug}/${ethereumDaLayer.bridges[0].display.slug}`,
    systemCategory: ethereumDaLayer.systemCategory,
    usedIn: ethereumDaLayer.bridges.flatMap((bridge) => bridge.usedIn),
    economicSecurity: economicSecurity[ethereumDaLayer.id],
    bridges: ethereumDaLayer.bridges[0],
    tvs: getTvlSumFor(
      ethereumDaLayer.bridges
        .flatMap((bridge) => bridge.usedIn)
        .map((usedIn) => usedIn.id),
    ),
  }
}

export type DaSummaryEthereumEntry = ReturnType<typeof getEthereumEntry>

export type DaSummaryEntry = ReturnType<typeof getEntries>[number]
