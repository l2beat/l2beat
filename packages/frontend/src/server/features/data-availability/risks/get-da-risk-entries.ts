import type { DaBridgeRisks, DaLayerRisks, Project } from '@l2beat/config'
import { layer2s, layer3s } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaUsers } from '../utils/get-da-users'

export async function getDaRiskEntries() {
  const [layers, bridges] = await Promise.all([
    ps.getProjects({ select: ['daLayer', 'statuses'] }),
    ps.getProjects({ select: ['daBridge', 'statuses'] }),
  ])

  const uniqueProjectsInUse = getDaUsers(layers, bridges)
  const tvsPerProject = await getDaProjectsTvs(uniqueProjectsInUse)
  const getTvs = pickTvsForProjects(tvsPerProject)

  const entries = layers
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .map((project) =>
      getDaRiskEntry(
        project,
        bridges.filter((x) => x.daBridge.daLayer === project.id),
        getTvs,
      ),
    )
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
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  getTvs: (projects: ProjectId[]) => number,
): DaRiskEntry {
  const daBridges = bridges.map(
    (b): DaBridgeRiskEntry => ({
      name: b.daBridge.name,
      slug: b.slug,
      href: `/data-availability/projects/${layer.slug}/${b.slug}`,
      statuses: {
        verificationWarning: b.statuses.isUnverified,
        underReview:
          layer.statuses.isUnderReview || b.statuses.isUnderReview
            ? 'config'
            : undefined,
      },
      risks: b.daBridge.risks,
      tvs: getTvs(b.daBridge.usedIn.map((project) => project.id)),
    }),
  )

  if (layer.daLayer.usedWithoutBridgeIn.length > 0) {
    daBridges.unshift({
      name: 'No Bridge',
      slug: 'no-bridge',
      href: `/data-availability/projects/${layer.slug}/no-bridge`,
      statuses: {},
      risks: { isNoBridge: true },
      tvs: getTvs(
        layer.daLayer.usedWithoutBridgeIn.map((project) => project.id),
      ),
    })
  }

  daBridges.sort((a, b) => b.tvs - a.tvs)

  return {
    id: ProjectId(layer.id),
    name: layer.name,
    nameSecondLine: layer.daLayer.type,
    slug: layer.slug,
    href: daBridges[0]?.href,
    statuses: {},
    isPublic: layer.daLayer.systemCategory === 'public',
    tvs: getTvs(
      layer.daLayer.usedWithoutBridgeIn
        .concat(bridges.flatMap((p) => p.daBridge.usedIn))
        .map((x) => x.id),
    ),
    risks: {
      economicSecurity: layer.daLayer.risks.economicSecurity,
      fraudDetection: layer.daLayer.risks.fraudDetection,
    },
    bridges: daBridges,
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
