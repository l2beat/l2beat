import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { TabbedDaEntries } from '~/pages/data-availability/utils/groupByDaTabs'
import { groupByDaTabs } from '~/pages/data-availability/utils/groupByDaTabs'
import { ps } from '~/server/projects'
import {
  getProjectsChangeReport,
  type ProjectsChangeReport,
} from '../../projects-change-report/getProjectsChangeReport'
import { getIsProjectVerified } from '../../utils/getIsProjectVerified'
import { type CommonDaEntry, getCommonDaEntry } from '../getCommonDaEntry'

export async function getDaLivenessEntries(): Promise<
  TabbedDaEntries<DaLivenessEntry>
> {
  const [layers, bridges, projectsChangeReport] = await Promise.all([
    ps.getProjects({
      select: ['daLayer', 'statuses'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({ select: ['daBridge', 'statuses', 'trackedTxsConfig'] }),
    getProjectsChangeReport(),
  ])

  const layerEntries = layers
    .filter((project) => project.id !== ProjectId.ETHEREUM)
    .map((project) =>
      getDaLivenessEntry(
        project,
        bridges.filter((x) => x.daBridge.daLayer === project.id),
        projectsChangeReport,
      ),
    )
    .filter((x) => x !== undefined)

  return groupByDaTabs(layerEntries)
}

export interface DaLivenessEntry extends CommonDaEntry {
  bridges: DaBridgeLivenessEntry[]
}

export interface DaBridgeLivenessEntry
  extends Omit<CommonDaEntry, 'id' | 'tab' | 'icon' | 'backgroundColor'> {}

function getDaLivenessEntry(
  layer: Project<'daLayer' | 'statuses'>,
  bridges: Project<'daBridge' | 'statuses' | 'trackedTxsConfig'>[],
  projectsChangeReport: ProjectsChangeReport,
): DaLivenessEntry | undefined {
  if (bridges.length === 0) {
    return undefined
  }

  const daBridges = bridges.map(
    (b): DaBridgeLivenessEntry => ({
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
    }),
  )

  return {
    ...getCommonDaEntry({ project: layer, href: daBridges[0]?.href }),
    bridges: daBridges,
  }
}
