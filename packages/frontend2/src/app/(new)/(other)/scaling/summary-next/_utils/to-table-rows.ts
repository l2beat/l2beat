import { assert } from '@l2beat/shared-pure'
import { type ScalingSummaryEntry } from '~/server/features/scaling/get-scaling-summary-entries'
import { type ScalingSummaryData } from '~/server/features/tvl/get-scaling-summary-data'

export function toTableRows({
  projects,
  summaryData,
}: {
  projects: ScalingSummaryEntry[]
  summaryData: ScalingSummaryData
}) {
  const latestTvlEntry = summaryData.chart.at(-1)
  assert(latestTvlEntry, "Latest TVL entry doesn't exist")
  const totalTvl = latestTvlEntry
    .slice(1, -1)
    .reduce((acc, val) => acc + val, 0)
  return projects.map((project) => {
    const data = summaryData.projects[project.id]
    return {
      ...project,
      tvl: summaryData.projects[project.id] ?? null,
      marketShare: (data?.breakdown.total ?? 0) / totalTvl,
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[0]
