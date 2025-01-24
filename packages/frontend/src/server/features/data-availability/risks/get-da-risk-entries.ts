import {
  type BlockchainDaLayer,
  type DaBridgeRisks,
  type DaLayerRisks,
  type DaServiceDaLayer,
  daLayers,
  isDaBridgeVerified,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { type CommonProjectEntry } from '../../utils/get-common-project-entry'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaBridgeRisks, getDaLayerRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'

export async function getDaRiskEntries() {
  const uniqueProjectsInUse = getUniqueProjectsInUse()
  const tvlPerProject = await getDaProjectsTvl(uniqueProjectsInUse)
  const getTvs = pickTvlForProjects(tvlPerProject)

  const entries = daLayers
    .map((daLayer) => getDaRiskEntry(daLayer, getTvs))
    .sort((a, b) => b.tvs - a.tvs)

  const dacEntries = getDacEntries(getTvs)

  return [...entries, ...dacEntries]
}

export interface DaRiskEntry extends CommonProjectEntry {
  isPublic: boolean
  tvs: number
  risks: DaLayerRisks
  bridges: DaBridgeRiskEntry[]
}

export interface DaBridgeRiskEntry extends Omit<CommonProjectEntry, 'id'> {
  risks: DaBridgeRisks
  tvs: number
}

function getDaRiskEntry(
  daLayer: BlockchainDaLayer | DaServiceDaLayer,
  getTvs: (projects: ProjectId[]) => number,
): DaRiskEntry {
  const bridges = daLayer.bridges
    .map((daBridge): DaBridgeRiskEntry => {
      const tvs = getTvs(daBridge.usedIn.map((project) => project.id))

      return {
        name: daBridge.display.name,
        slug: daBridge.display.slug,
        href: `/data-availability/projects/${daLayer.display.slug}/${daBridge.display.slug}`,
        statuses: {
          yellowWarning: daBridge.display.warning,
          redWarning: daBridge.display.redWarning,
          verificationWarning: isDaBridgeVerified(daLayer, daBridge)
            ? undefined
            : true,
        },
        risks: getDaBridgeRisks(daBridge),
        tvs,
      }
    })
    .sort((a, b) => b.tvs - a.tvs)

  return {
    id: ProjectId(daLayer.id),
    name: daLayer.display.name,
    nameSecondLine: kindToType(daLayer.kind),
    slug: daLayer.display.slug,
    href: bridges[0]?.href,
    statuses: {},
    isPublic: daLayer.systemCategory === 'public',
    tvs: getTvs(
      daLayer.bridges.flatMap((bridge) =>
        bridge.usedIn.map((project) => project.id),
      ),
    ),
    risks: {
      economicSecurity: daLayer.risks.economicSecurity,
      fraudDetection: daLayer.risks.fraudDetection,
    },
    bridges,
  }
}

function getDacEntries(
  getTvs: (projectIds: ProjectId[]) => number,
): DaRiskEntry[] {
  const projects = [...layer2s, ...layer3s]
    .filter((project) => project.dataAvailabilitySolution)
    .map((project) => ({
      parentProject: project,
      daLayer: project.dataAvailabilitySolution!,
    }))

  return projects.map(({ parentProject, daLayer }) => {
    const tvs = getTvs([parentProject.id])

    const bridgeEntry: DaBridgeRiskEntry = {
      name: daLayer.display?.name ?? `${parentProject.display.name} DAC`,
      slug: parentProject.display.slug,
      href: `/scaling/projects/${parentProject.display.slug}`,
      statuses: {},
      tvs,
      risks: getDaBridgeRisks(daLayer.bridge),
    }

    const projectEntry: DaRiskEntry = {
      id: parentProject.id,
      slug: parentProject.display.slug,
      name: daLayer.display?.name ?? `${parentProject.display.name} DAC`,
      nameSecondLine: kindToType(daLayer.kind),
      href: `/scaling/projects/${parentProject.display.slug}`,
      statuses: {},
      risks: getDaLayerRisks(daLayer, tvs),
      isPublic: daLayer.systemCategory === 'public',
      tvs,
      bridges: [bridgeEntry],
    }

    return projectEntry
  })
}
