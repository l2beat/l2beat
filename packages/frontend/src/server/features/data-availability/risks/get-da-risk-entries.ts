import type { DaBridgeRisks, DaLayerRisks, Project } from '@l2beat/config'
import { isDaBridgeVerified, layer2s, layer3s } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import { getDaBridges } from '../utils/get-da-bridges'
import { getUniqueProjectsInUse } from '../utils/get-da-projects'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'

export async function getDaRiskEntries() {
  const uniqueProjectsInUse = await getUniqueProjectsInUse()
  const tvsPerProject = await getDaProjectsTvs(uniqueProjectsInUse)
  const getTvs = pickTvsForProjects(tvsPerProject)

  const projects = await ps.getProjects({
    select: ['daLayer', 'daBridges'],
  })

  const entries = projects
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .map((project) => getDaRiskEntry(project, getTvs))
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
  project: Project<'daLayer' | 'daBridges'>,
  getTvs: (projects: ProjectId[]) => number,
): DaRiskEntry {
  const bridges = getDaBridges(project)
    .map((daBridge): DaBridgeRiskEntry => {
      const tvs = getTvs(daBridge.usedIn.map((project) => project.id))

      return {
        name: daBridge.display.name,
        slug: daBridge.display.slug,
        href: `/data-availability/projects/${project.slug}/${daBridge.display.slug}`,
        statuses: {
          verificationWarning: isDaBridgeVerified(daBridge) ? undefined : true,
        },
        risks: daBridge.risks,
        tvs,
      }
    })
    .sort((a, b) => b.tvs - a.tvs)

  return {
    id: ProjectId(project.id),
    name: project.name,
    nameSecondLine: project.daLayer.type,
    slug: project.slug,
    href: bridges[0]?.href,
    statuses: {},
    isPublic: project.daLayer.systemCategory === 'public',
    tvs: getTvs(
      getDaBridges(project).flatMap((bridge) =>
        bridge.usedIn.map((project) => project.id),
      ),
    ),
    risks: {
      economicSecurity: project.daLayer.risks.economicSecurity,
      fraudDetection: project.daLayer.risks.fraudDetection,
    },
    bridges,
  }
}

function getDacEntries(
  getTvs: (projectIds: ProjectId[]) => number,
): DaRiskEntry[] {
  const projects = [...layer2s, ...layer3s]
    .filter((project) => project.customDa)
    .map((project) => ({
      parentProject: project,
      daLayer: project.customDa,
    }))

  return projects
    .map(({ parentProject, daLayer }) => {
      if (!daLayer) {
        return undefined
      }

      const tvs = getTvs([parentProject.id])

      const bridgeEntry: DaBridgeRiskEntry = {
        name: daLayer.name ?? `${parentProject.display.name} DAC`,
        slug: parentProject.display.slug,
        href: `/scaling/projects/${parentProject.display.slug}`,
        statuses: {},
        tvs,
        risks: daLayer.risks,
      }

      const projectEntry: DaRiskEntry = {
        id: parentProject.id,
        slug: parentProject.display.slug,
        name: daLayer.name ?? `${parentProject.display.name} DAC`,
        nameSecondLine: daLayer.type,
        href: `/scaling/projects/${parentProject.display.slug}`,
        statuses: {},
        risks: daLayer.risks,
        isPublic: false,
        tvs,
        bridges: [bridgeEntry],
      }

      return projectEntry
    })
    .filter((x) => x !== undefined)
}
