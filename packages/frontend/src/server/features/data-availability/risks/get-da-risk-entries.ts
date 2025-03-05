import type { DaBridgeRisks, DaLayerRisks, Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { TabbedDaEntries } from '~/app/(side-nav)/data-availability/_utils/group-by-da-tabs'
import { groupByDaTabs } from '~/app/(side-nav)/data-availability/_utils/group-by-da-tabs'
import { ps } from '~/server/projects'
import {
  type CommonDaEntry,
  getCommonDaEntry,
  getCommonDacDaEntry,
} from '../get-common-da-entry'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaUsers } from '../utils/get-da-users'

export async function getDaRiskEntries(): Promise<
  TabbedDaEntries<DaRiskEntry>
> {
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

  return groupByDaTabs(
    [...layerEntries, ...dacEntries].sort((a, b) => b.tvs - a.tvs),
  )
}

export interface DaRiskEntry extends CommonDaEntry {
  tvs: number
  risks: DaLayerRisks
  bridges: DaBridgeRiskEntry[]
}

export interface DaBridgeRiskEntry extends Omit<CommonDaEntry, 'id' | 'tab'> {
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
    ...getCommonDaEntry({ project: layer, href: daBridges[0]?.href }),
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
    ...getCommonDacDaEntry({ project }),
    risks: project.customDa.risks,
    tvs: tvs.latest,
    bridges: [bridgeEntry],
  }
}
