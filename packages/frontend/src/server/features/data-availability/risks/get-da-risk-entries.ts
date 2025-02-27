import type { DaBridgeRisks, DaLayerRisks, Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaUsers } from '../utils/get-da-users'

export async function getDaRiskEntries() {
  const [layers, bridges, dacs] = await Promise.all([
    ps.getProjects({ select: ['daLayer', 'statuses'] }),
    ps.getProjects({ select: ['daBridge', 'statuses'] }),
    ps.getProjects({ select: ['customDa', 'statuses'] }),
  ])

  const uniqueProjectsInUse = getDaUsers(layers, bridges, dacs)
  const tvsPerProject = await getDaProjectsTvs(uniqueProjectsInUse)
  const getTvs = pickTvsForProjects(tvsPerProject)

  const layerEntries = layers
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .map((project) =>
      getDaRiskEntry(
        project,
        bridges.filter((x) => x.daBridge.daLayer === project.id),
        getTvs,
      ),
    )

  const dacEntries = dacs.map((dac) => getDacEntry(dac, getTvs))

  return [...layerEntries, ...dacEntries].sort((a, b) => b.tvs - a.tvs)
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
  getTvs: (projects: ProjectId[]) => { latest: number; sevenDaysAgo: number },
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
      tvs: getTvs(b.daBridge.usedIn.map((project) => project.id)).latest,
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
      ).latest,
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
    ).latest,
    risks: {
      economicSecurity: layer.daLayer.risks.economicSecurity,
      fraudDetection: layer.daLayer.risks.fraudDetection,
    },
    bridges: daBridges,
  }
}

function getDacEntry(
  project: Project<'customDa' | 'statuses'>,
  getTvs: (projectIds: ProjectId[]) => { latest: number; sevenDaysAgo: number },
): DaRiskEntry {
  const tvs = getTvs([project.id])
  const bridgeEntry: DaBridgeRiskEntry = {
    name: project.customDa.name ?? `${project.name} DAC`,
    slug: project.slug,
    href: `/scaling/projects/${project.slug}`,
    statuses: {},
    tvs: tvs.latest,
    risks: project.customDa.risks,
  }
  return {
    id: project.id,
    slug: project.slug,
    name: project.customDa.name ?? `${project.name} DAC`,
    nameSecondLine: project.customDa.type,
    href: `/scaling/projects/${project.slug}`,
    statuses: {},
    risks: project.customDa.risks,
    isPublic: false,
    tvs: tvs.latest,
    bridges: [bridgeEntry],
  }
}
