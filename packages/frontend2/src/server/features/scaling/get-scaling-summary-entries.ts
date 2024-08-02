import { layer2s, layer3s } from '@l2beat/config'
import { type ProjectsVerificationStatuses } from '@l2beat/shared-pure'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { type ImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { type LatestTvl } from '../tvl/get-latest-tvl'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getCommonScalingEntry } from './get-common-scaling-entry'
import { formatPercent } from '~/utils/get-percentage-change'

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
    const latestTvl = tvl[project.id.toString()]

    const tvlBreakdownWarning = latestTvl
      ? [
          getTvlWarning(
            latestTvl.associated / latestTvl.total,
            project.display.name,
            project.config.associatedTokens ?? [],
          ),
        ]
      : []

    return {
      ...getCommonScalingEntry({
        project,
        isVerified,
        hasImplementationChanged,
      }),
      associatedTokens: project.config.associatedTokens ?? [],
      latestTvl,
      tvlWarnings: [project.display.tvlWarning, ...tvlBreakdownWarning],
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

export function getTvlWarning(
  associatedRatio: number,
  name: string,
  associatedTokens: string[],
) {
  let warning: string | undefined
  if (associatedRatio > 0.1) {
    const percent = formatPercent(associatedRatio)
    if (associatedTokens.length === 1) {
      const what = `The ${associatedTokens[0]} token associated with ${name}`
      warning = `${what} accounts for ${percent} of the TVL!`
    } else {
      const joined = associatedTokens.join(' and ')
      const what = `The ${joined} tokens associated with ${name}`
      warning = `${what} account for ${percent} of the TVL!`
    }
  }
  const warningSeverity: 'bad' | 'warning' =
    associatedRatio > 0.8 ? 'bad' : 'warning'
  return { warning, warningSeverity }
}

export type ScalingSummaryEntry = Awaited<
  ReturnType<typeof getScalingSummaryEntries>
>[number]
