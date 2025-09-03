import type { DaBridgeRisks, Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import {
  groupByDaTabs,
  type TabbedDaEntries,
} from '~/pages/data-availability/utils/groupByDaTabs'
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

export async function getDaArchivedEntries(): Promise<
  TabbedDaEntries<DaArchivedEntry>
> {
  const [layers, bridges, dacs, economicSecurity, projectsChangeReport] =
    await Promise.all([
      ps.getProjects({
        select: ['daLayer', 'statuses'],
        where: ['archivedAt'],
      }),
      ps.getProjects({ select: ['daBridge', 'statuses'] }),
      ps.getProjects({
        select: ['customDa', 'statuses'],
        where: ['archivedAt'],
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
      getDaArchivedEntry(
        project,
        bridges.filter((x) => x.daBridge.daLayer === project.id),
        getTvs,
        economicSecurity[project.id],
        projectsChangeReport,
      ),
    )

  const dacEntries = dacs.map((dac) => getDacEntry(dac))
  return groupByDaTabs([...layerEntries, ...dacEntries])
}

export interface DaArchivedEntry extends CommonDaEntry {
  risks: AdjustedDaLayerRisks
  bridges: DaBridgeArchivedEntry[]
}

export interface DaBridgeArchivedEntry
  extends Omit<CommonDaEntry, 'id' | 'tab' | 'icon' | 'backgroundColor'> {
  risks: DaBridgeRisks
}

function getDaArchivedEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses'>[],
  getTvs: (projects: ProjectId[]) => { latest: number; sevenDaysAgo: number },
  economicSecurity: number | undefined,
  projectsChangeReport: ProjectsChangeReport,
): DaArchivedEntry {
  const daBridges = bridges.map(
    (b): DaBridgeArchivedEntry => ({
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
            : undefined,
      },
      risks: b.daBridge.risks,
    }),
  )

  if (layer.daLayer.usedWithoutBridgeIn.length > 0 || bridges.length === 0) {
    daBridges.unshift({
      name: 'No Bridge',
      slug: 'no-bridge',
      href: `/data-availability/projects/${layer.slug}/no-bridge`,
      statuses: {},
      risks: { isNoBridge: true },
    })
  }

  const tvs = getTvs(
    layer.daLayer.usedWithoutBridgeIn
      .concat(bridges.flatMap((p) => p.daBridge.usedIn))
      .map((x) => x.id),
  ).latest
  return {
    ...getCommonDaEntry({ project: layer, href: daBridges[0]?.href }),
    risks: getDaLayerRisks(layer.daLayer, tvs, economicSecurity),
    bridges: daBridges,
  }
}

function getDacEntry(
  project: Project<'customDa' | 'statuses'>,
): DaArchivedEntry {
  const bridgeEntry: DaBridgeArchivedEntry = {
    name: project.customDa.name ?? `${project.name} DAC`,
    slug: project.slug,
    href: `/scaling/projects/${project.slug}`,
    statuses: {},
    risks: project.customDa.risks,
  }
  return {
    ...getCommonDacDaEntry({ project }),
    risks: getDaLayerRisks(project.customDa),
    bridges: [bridgeEntry],
  }
}
