import { layer2s, layer3s } from '@l2beat/config'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { type ImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getCommonScalingEntry } from './get-common-scaling-entry'
import { type LatestTvl } from '../tvl/get-latest-tvl'
import { type ProjectsVerificationStatuses } from '@l2beat/shared-pure'
import { orderByTvl } from '../tvl/order-by-tvl'

export async function getScalingSummaryEntries({
  tvl,
  implementationChangeReport,
  projectsVerificationStatuses,
}: {
  tvl: LatestTvl
  implementationChangeReport: ImplementationChangeReport
  projectsVerificationStatuses: ProjectsVerificationStatuses
}) {
  const entries = [...layer2s, ...layer3s].map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    return {
      ...getCommonScalingEntry({
        project,
        isVerified,
        hasImplementationChanged,
      }),
      latestTvl: tvl[project.id.toString()],
      risks: getL2Risks(project.riskView),
    }
  })

  return orderByTvl(
    entries,
    Object.fromEntries(Object.entries(tvl).map(([k, v]) => [k, v.total])),
  )
}

export type ScalingSummaryEntry = Awaited<
  ReturnType<typeof getScalingSummaryEntries>
>[number]
