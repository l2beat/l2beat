import { formatRange, formatTimestamp } from '../../../../../utils'
import { formatTpsWithUnit } from '../../../../../utils/formatTps'
import { State } from '../../state/State'
import { getYAxis } from './getYAxis'

export function calculateActivityView(
  data: State['data'],
  controls: State['controls'],
): State['view'] | undefined {
  if (!data.activity) {
    return undefined
  }

  const entries = data.activity.daily.data.slice(-controls.days)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    controls.showEthereum
      ? entries.flatMap((x) => [getTps(x[1]), getTps(x[2])])
      : entries.map((x) => getTps(x[1])),
    controls.labelCount,
    controls.isLogScale,
    formatTpsWithUnit,
  )

  const points = entries.map(
    ([timestamp, transactions, ethereumTransactions], i) => ({
      x: i / (entries.length - 1),
      y: getY(getTps(transactions)),
      y2: getY(getTps(ethereumTransactions)),
      date: formatTimestamp(timestamp, false),
      tps: getTps(transactions),
      ethereumTps: getTps(ethereumTransactions),
      milestone: data.milestones[timestamp],
    }),
  )

  return {
    chart: { type: 'ActivityChart', points },
    dateRange,
    labels,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
  }
}

function getTps(dailyTransactions: number) {
  return dailyTransactions / (60 * 60 * 24)
}
