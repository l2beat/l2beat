import type { DaBridgeRisks, Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { TabbedDaEntries } from '~/pages/data-availability/utils/groupByDaTabs'
import { groupByDaTabs } from '~/pages/data-availability/utils/groupByDaTabs'
import { ps } from '~/server/projects'
import {
  getProjectsChangeReport,
  type ProjectsChangeReport,
} from '../../projects-change-report/getProjectsChangeReport'
import { getIsProjectVerified } from '../../utils/getIsProjectVerified'
import {
  type CommonDaEntry,
  getCommonDacDaEntry,
  getCommonDaEntry,
} from '../getCommonDaEntry'
import {
  type AdjustedDaLayerRisks,
  getDaLayerRisks,
} from '../utils/getDaLayerRisks'
import { getDaProjectsEconomicSecurity } from '../utils/getDaProjectsEconomicSecurity'
import { getDaProjectsTvs, pickTvsForProjects } from '../utils/getDaProjectsTvs'
import { getDaUsers } from '../utils/getDaUsers'

export async function getDaRiskEntries(): Promise<
  TabbedDaEntries<DaRiskEntry>
> {
  const [layers, bridges, dacs, economicSecurity, projectsChangeReport] =
    await Promise.all([
      ps.getProjects({
        select: ['daLayer', 'statuses'],
        whereNot: ['archivedAt'],
      }),
      ps.getProjects({ select: ['daBridge', 'statuses'] }),
      ps.getProjects({
        select: ['customDa', 'statuses'],
        whereNot: ['archivedAt'],
      }),
      getDaProjectsEconomicSecurity(),
      getProjectsChangeReport(),
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
        economicSecurity[project.id],
        projectsChangeReport,
      ),
    )

  const dacEntries = dacs.map((dac) => getDacEntry(dac, getTvs))

  return groupByDaTabs(
    [...layerEntries, ...dacEntries].sort((a, b) => b.tvs - a.tvs),
  )
}

export interface DaRiskEntry extends CommonDaEntry {
  tvs: number
  risks: AdjustedDaLayerRisks
  bridges: DaBridgeRiskEntry[]
}

export interface DaBridgeRiskEntry
  extends Omit<CommonDaEntry, 'id' | 'tab' | 'icon' | 'backgroundColor'> {
  risks: DaBridgeRisks
  tvs: number
}

function getDaRiskEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  getTvs: (projects: ProjectId[]) => { latest: number; sevenDaysAgo: number },
  economicSecurity: number | undefined,
  projectsChangeReport: ProjectsChangeReport,
): DaRiskEntry {
  const daBridges = bridges.map(
    (b): DaBridgeRiskEntry => ({
      name: b.daBridge.name,
      slug: b.slug,
      href: `/data-availability/projects/${layer.slug}/${b.slug}`,
      statuses: {
        verificationWarning: !getIsProjectVerified(
          b.statuses.unverifiedContracts,
          projectsChangeReport.getChanges(b.id),
        ),
        underReview:
          layer.statuses.reviewStatus || b.statuses.reviewStatus
            ? 'config'
            : projectsChangeReport.getChanges(b.id).impactfulChange
              ? 'impactful-change'
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
    risks: getDaLayerRisks(project.customDa),
    tvs: tvs.latest,
    bridges: [bridgeEntry],
  }
}
