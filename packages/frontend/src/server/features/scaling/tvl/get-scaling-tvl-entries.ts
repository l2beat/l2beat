import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { api } from '~/trpc/server'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import {
  type SevenDayTvlBreakdown,
  get7dTvlBreakdown,
} from './utils/get-7d-tvl-breakdown'

export async function getScalingTvlEntries() {
  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )

  const [projectsChangeReport, projectsVerificationStatuses, tvl] =
    await Promise.all([
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
      get7dTvlBreakdown(),
      api.tvl.chart.prefetch({
        filter: { type: 'layer2' },
        range: '1y',
        excludeAssociatedTokens: false,
      }),
    ])

  const entries = projects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]
      const latestTvl = tvl.projects[project.id.toString()]

      return getScalingTvlEntry(
        project,
        isVerified,
        projectsChangeReport,
        latestTvl,
      )
    })
    .filter((entry) => entry.tvl.data)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export type ScalingTvlEntry = Awaited<ReturnType<typeof getScalingTvlEntry>>
function getScalingTvlEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
  latestTvl: SevenDayTvlBreakdown['projects'][string] | undefined,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      syncStatus: undefined,
    }),
    href: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
    entryType: 'scaling' as const,
    tvl: {
      data: latestTvl && {
        total: latestTvl.total,
        breakdown: latestTvl.breakdown,
        change: latestTvl.change,
        associatedTokensExcludedChange:
          latestTvl.associatedTokensExcludedChange,
      },
      associatedTokens: project.config.associatedTokens ?? [],
      warnings: [project.display.tvlWarning].filter(notUndefined),
    },
    tvlOrder:
      (latestTvl?.breakdown.canonical ?? 0) +
      (latestTvl?.breakdown.native ?? 0) +
      (latestTvl?.breakdown.external ?? 0),
  }
}
