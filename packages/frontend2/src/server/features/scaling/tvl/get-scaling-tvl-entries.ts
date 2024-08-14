import { layer2s, layer3s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { get7dTvlBreakdown } from '../tvl/utils/get-7d-tvl-breakdown'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

export async function getScalingTvlEntries() {
  const implementationChangeReport = await getImplementationChangeReport()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const tvl = await get7dTvlBreakdown()

  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )

  const entries = projects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]
      const hasImplementationChanged =
        !!implementationChangeReport.projects[project.id.toString()]

      const latestTvl = tvl.projects[project.id.toString()]

      return {
        ...getCommonScalingEntry({
          project,
          isVerified,
          hasImplementationChanged,
        }),
        entryType: 'scaling' as const,
        tvl: {
          breakdown: latestTvl?.breakdown,
          change: latestTvl?.change,
          associatedTokens: project.config.associatedTokens ?? [],
          warnings: [project.display.tvlWarning].filter(notUndefined),
        },
      }
    })
    .filter((entry) => entry.tvl.breakdown)

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
  )

  return orderByTvl(entries, remappedForOrdering)
}

export type ScalingTvlEntry = Awaited<
  ReturnType<typeof getScalingTvlEntries>
>[number]
