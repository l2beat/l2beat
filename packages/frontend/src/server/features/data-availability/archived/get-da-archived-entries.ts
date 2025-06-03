import type { DaBridgeRisks, Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { TabbedDaEntries } from '~/pages/data-availability/utils/group-by-da-tabs'
import { groupByDaTabs } from '~/pages/data-availability/utils/group-by-da-tabs'
import { ps } from '~/server/projects'
import {
  type CommonDaEntry,
  getCommonDaEntry,
  getCommonDacDaEntry,
} from '../get-common-da-entry'
import {
  type AdjustedDaLayerRisks,
  getDaLayerRisks,
} from '../utils/get-da-layer-risks'
import { getDaProjectsEconomicSecurity } from '../utils/get-da-projects-economic-security'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaUsers } from '../utils/get-da-users'

export async function getDaArchivedEntries(): Promise<
  TabbedDaEntries<DaArchivedEntry>
> {
  const [layers, bridges, dacs, economicSecurity] = await Promise.all([
    ps.getProjects({
      select: ['daLayer', 'statuses'],
      where: ['archivedAt'],
    }),
    ps.getProjects({ select: ['daBridge', 'statuses'] }),
    ps.getProjects({ select: ['customDa', 'statuses'], where: ['archivedAt'] }),
    getDaProjectsEconomicSecurity(),
  ])

  const uniqueProjectsInUse = getDaUsers(layers, bridges, dacs)
  const tvsPerProject = await getDaProjectsTvs(uniqueProjectsInUse)
  const getTvs = pickTvsForProjects(tvsPerProject)

  const layerEntries = layers
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .map((project) =>
      getDaArchivedEntry(
        project,
        bridges.filter((x) => x.daBridge.daLayer === project.id),
        getTvs,
        economicSecurity[project.id],
      ),
    )

  const dacEntries = dacs.map((dac) => getDacEntry(dac, getTvs))

  return groupByDaTabs(
    [...layerEntries, ...dacEntries].sort((a, b) => b.tvs - a.tvs),
  )
}

export interface DaArchivedEntry extends CommonDaEntry {
  tvs: number
  risks: AdjustedDaLayerRisks
  bridges: DaBridgeArchivedEntry[]
}

export interface DaBridgeArchivedEntry
  extends Omit<CommonDaEntry, 'id' | 'tab' | 'icon'> {
  risks: DaBridgeRisks
  tvs: number
}

function getDaArchivedEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  getTvs: (projects: ProjectId[]) => { latest: number; sevenDaysAgo: number },
  economicSecurity: number | undefined,
): DaArchivedEntry {
  const daBridges = bridges.map(
    (b): DaBridgeArchivedEntry => ({
      name: b.daBridge.name,
      slug: b.slug,
      href: `/data-availability/projects/${layer.slug}/${b.slug}`,
      statuses: {
        verificationWarning: b.statuses.isUnverified,
        underReview:
          layer.statuses.reviewStatus || b.statuses.reviewStatus
            ? 'config'
            : undefined,
      },
      risks: b.daBridge.risks,
      tvs: getTvs(b.daBridge.usedIn.map((project) => project.id)).latest,
    }),
  )

  if (layer.daLayer.usedWithoutBridgeIn.length > 0 || bridges.length === 0) {
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
  const tvs = getTvs(
    layer.daLayer.usedWithoutBridgeIn
      .concat(bridges.flatMap((p) => p.daBridge.usedIn))
      .map((x) => x.id),
  ).latest
  return {
    ...getCommonDaEntry({ project: layer, href: daBridges[0]?.href }),
    tvs,
    risks: getDaLayerRisks(layer.daLayer, tvs, economicSecurity),
    bridges: daBridges,
  }
}

function getDacEntry(
  project: Project<'customDa' | 'statuses'>,
  getTvs: (projectIds: ProjectId[]) => { latest: number; sevenDaysAgo: number },
): DaArchivedEntry {
  const tvs = getTvs([project.id])
  const bridgeEntry: DaBridgeArchivedEntry = {
    name: project.customDa.name ?? `${project.name} DAC`,
    slug: project.slug,
    href: `/scaling/projects/${project.slug}`,
    statuses: {},
    tvs: tvs.latest,
    risks: project.customDa.risks,
  }
  return {
    ...getCommonDacDaEntry({ project }),
    risks: getDaLayerRisks(project.customDa),
    tvs: tvs.latest,
    bridges: [bridgeEntry],
  }
}
