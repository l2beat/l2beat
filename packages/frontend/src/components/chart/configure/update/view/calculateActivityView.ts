import { formatRange, formatTimestamp } from '../../../../../utils'
import { State } from '../../state/State'
import { getHoverIndex } from './getHoverIndex'
import { getYAxis } from './getYAxis'

export function calculateActivityView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  if (!responses.activity) {
    return undefined
  }

  const entries = responses.activity.daily.data.slice(-controls.days)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    controls.showEthereum
      ? entries.flatMap((x) => [getTps(x[1]), getTps(x[2])])
      : entries.map((x) => getTps(x[1])),
    controls.isLogScale,
    (x) => x.toFixed(2),
  )

  const points = entries.map(
    ([timestamp, transactions, ethereumTransactions], i) => ({
      x: i / (entries.length - 1),
      y: getY(getTps(transactions)),
      y2: getY(getTps(ethereumTransactions)),
      date: formatTimestamp(timestamp, true),
      tps: getTps(transactions).toFixed(2),
      ethereumTps: getTps(ethereumTransactions).toFixed(2),
    }),
  )

  return {
    chart: { type: 'ActivityChart', points },
    dateRange,
    labels,
    showHoverAtIndex: getHoverIndex(controls.mouseX, points.length),
  }
}
function getTps(dailyTransactions: number) {
  return dailyTransactions / (60 * 60 * 24)
}
