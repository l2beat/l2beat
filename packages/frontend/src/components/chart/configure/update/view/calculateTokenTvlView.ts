import { formatRange, formatTimestamp } from '../../../../../utils'
import { State } from '../../state/State'
import { formatCurrency } from './format'
import { getAppropriateEntries } from './getAppropriateEntries'
import { getYAxis } from './getYAxis'

export function calculateTokenTvlView(
  data: State['data'],
  controls: State['controls'],
): State['view'] | undefined {
  if (!controls.token) {
    return undefined
  }
  // reassigned for callbacks. Thanks typescript :(
  const token = controls.token

  const response = controls.token && data.tokenTvl[controls.token]
  if (!response) {
    return undefined
  }

  const entries = getAppropriateEntries(controls.days, response)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    entries.map((x) => x[1]),
    controls.labelCount,
    controls.isLogScale,
    (x) => formatCurrency(x, token),
  )

  const points = entries.map(([timestamp, balance, usd], i) => ({
    x: i / (entries.length - 1),
    y: getY(balance),
    date: formatTimestamp(timestamp, true),
    balance,
    symbol: token,
    usd,
    milestone: data.milestones[timestamp],
  }))

  return {
    chart: { type: 'TokenTvlChart', points },
    dateRange,
    labels,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
  }
}
