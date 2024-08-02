import { assert } from '@l2beat/shared-pure'
import { type ScalingSummaryEntry } from '~/server/features/scaling/get-scaling-summary-entries'
import { type ScalingSummaryData } from '~/server/features/tvl/get-scaling-summary-data'

export function toTableRows({
  projects,
  summaryData,
  excludeAssociatedTokens,
}: {
  projects: ScalingSummaryEntry[]
  summaryData: ScalingSummaryData
  excludeAssociatedTokens?: boolean
}) {
  const latestTvlEntry = summaryData.chart.at(-1)
  assert(latestTvlEntry, "Latest TVL entry doesn't exist")

  return projects.map((project) => {
    return {
      ...project,
      tvl: {
        ...project.tvl,
        breakdown: project.tvl.breakdown
          ? {
              ...project.tvl.breakdown,
              total: excludeAssociatedTokens
                ? project.tvl.breakdown.total - project.tvl.breakdown.associated
                : project.tvl.breakdown.total,
              associated: excludeAssociatedTokens
                ? 0
                : project.tvl.breakdown.associated,
            }
          : undefined,
        change: summaryData.projectChange[project.id] ?? null,
      },
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[0]
