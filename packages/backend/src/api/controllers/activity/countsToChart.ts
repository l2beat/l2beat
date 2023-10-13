import { formatChart, formatFrontendChart } from './formatChart'
import { DailyTransactionCount } from './types'

export function countsToChart(counts: DailyTransactionCount[]) {
  return formatChart(counts.map((c) => [c.timestamp, c.count]))
}

export function countsToFrontendChart(
  counts: DailyTransactionCount[],
  ethereumCounts: DailyTransactionCount[],
) {
  return formatFrontendChart(
    counts.map((c, i) => [c.timestamp, c.count, ethereumCounts[i].count]),
  )
}
