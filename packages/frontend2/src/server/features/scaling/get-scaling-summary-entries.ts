import { layer2s, layer3s } from '@l2beat/config'
import {
  type ProjectsVerificationStatuses,
  notUndefined,
} from '@l2beat/shared-pure'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { type ImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { type LatestTvl } from '../tvl/get-latest-tvl'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getCommonScalingEntry } from './get-common-scaling-entry'

export async function getScalingSummaryEntries({
  tvl,
  implementationChangeReport,
  projectsVerificationStatuses,
}: {
  tvl: LatestTvl
  implementationChangeReport: ImplementationChangeReport
  projectsVerificationStatuses: ProjectsVerificationStatuses
}) {
  const projects = [...layer2s, ...layer3s]
  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]
    const latestTvl = tvl.projects[project.id.toString()]

    return {
      entryType: 'scaling-next' as const,
      ...getCommonScalingEntry({
        project,
        isVerified,
        hasImplementationChanged,
      }),
      tvl: {
        ...latestTvl,
        associatedTokens: project.config.associatedTokens ?? [],
        warnings: [project.display.tvlWarning].filter(notUndefined),
      },
      marketShare: latestTvl && latestTvl.breakdown.total / tvl.total,
      risks: getL2Risks(project.riskView),
    }
  })

  return orderByTvl(
    entries,
    Object.fromEntries(
      Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
    ),
  )
}

export type ScalingSummaryEntry = Awaited<
  ReturnType<typeof getScalingSummaryEntries>
>[number]
