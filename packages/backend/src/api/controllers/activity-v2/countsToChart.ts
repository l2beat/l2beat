import { DailyTransactionCount } from '../../../core/transaction-count/TransactionCounter'
import { formatChart } from './formatChart'

export function countsToChart(counts: DailyTransactionCount[]) {
  return formatChart(counts.map((c) => [c.timestamp, c.count]))
}
