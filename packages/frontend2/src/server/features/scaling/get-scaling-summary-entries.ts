import { layer2s, layer3s } from '@l2beat/config'
import { type ProjectsVerificationStatuses } from '@l2beat/shared-pure'
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
  const sum = Object.entries(tvl).reduce(
    (acc, [k, v]) => {
      if (!projects.some((p) => p.id.toString() === k)) return acc
      acc.total += v.total
      acc.ether += v.ether
      acc.stablecoin += v.stablecoin
      acc.associated += v.associated
      return acc
    },
    { total: 0, ether: 0, stablecoin: 0, associated: 0 },
  )
  const entries = projects.map((project) => {
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
      marketShare:
        (tvl[project.id.toString()]?.total ?? 0) / sum.total || undefined,
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
