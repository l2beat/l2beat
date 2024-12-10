import {
  type Layer2,
  type Layer3,
  WarningWithSentiment,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { api } from '~/trpc/server'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import {
  CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'
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

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [
      k,
      v.breakdown.canonical + v.breakdown.native + v.breakdown.external,
    ]),
  )

  return groupByMainCategories(orderByStageAndTvl(entries, remappedForOrdering))
}

export interface ScalingTvlEntry extends CommonScalingEntry {
  tvl: {
    data:
      | {
          total: number
          breakdown: {
            native: number
            canonical: number
            external: number
            associated: {
              native: number
              canonical: number
              external: number
            }
          }
          change: {
            total: number
            native: number
            canonical: number
            external: number
          }
          associatedTokensExcludedChange: {
            total: number
            native: number
            canonical: number
            external: number
          }
        }
      | undefined
    associatedTokens: string[]
    warnings: WarningWithSentiment[]
  }
}

function getScalingTvlEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
  latestTvl: SevenDayTvlBreakdown['projects'][string] | undefined,
): ScalingTvlEntry {
  const common = getCommonScalingEntry({
    project,
    isVerified,
    hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
      project.id,
    ),
    hasHighSeverityFieldChanged:
      projectsChangeReport.hasHighSeverityFieldChanged(project.id),
  })
  return {
    ...common,
    basicInfo: {
      ...common.basicInfo,
      href: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
    },
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
  }
}
