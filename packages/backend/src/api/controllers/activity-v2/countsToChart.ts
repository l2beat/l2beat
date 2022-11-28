import { formatChart } from './formatChart'
import { DailyTransactionCount } from './types'

export function countsToChart(counts: DailyTransactionCount[]) {
  return formatChart(counts.map((c) => [c.timestamp, c.count]))
}
