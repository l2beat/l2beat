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
  return projects.map((project) => {
    return {
      ...project,
      tvlChange: summaryData.projectChange[project.id] ?? null,
    }
  })
}

export type ScalingSummaryTableRow = ReturnType<typeof toTableRows>[0]
