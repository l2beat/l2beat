import { layer2s, layer3s } from '@l2beat/config'
import {
  type ProjectsVerificationStatuses,
  notUndefined,
} from '@l2beat/shared-pure'
import { type ImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { type DetailedLatestTvl } from './utils/get-detailed-7d-tvl-breakdown'

export function getScalingTvlEntries({
  implementationChangeReport,
  projectsVerificationStatuses,
  tvl,
}: {
  implementationChangeReport: ImplementationChangeReport
  projectsVerificationStatuses: ProjectsVerificationStatuses
  tvl: DetailedLatestTvl
}) {
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
        href: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
        entryType: 'scaling' as const,
        tvl: {
          data: latestTvl && {
            breakdown: latestTvl.breakdown,
            change: latestTvl.change,
            totalChange: latestTvl.totalChange,
          },
          associatedTokens: project.config.associatedTokens ?? [],
          warnings: [project.display.tvlWarning].filter(notUndefined),
        },
      }
    })
    .filter((entry) => entry.tvl.data)

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [
      k,
      v.breakdown.canonical + v.breakdown.native + v.breakdown.external,
    ]),
  )

  return orderByTvl(entries, remappedForOrdering)
}

export type ScalingTvlEntry = Awaited<
  ReturnType<typeof getScalingTvlEntries>
>[number]
