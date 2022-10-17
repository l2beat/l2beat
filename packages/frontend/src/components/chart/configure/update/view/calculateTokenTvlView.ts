import { formatRange, formatTimestamp } from '../../../../../utils'
import { State } from '../../state/State'
import { formatCurrency, formatCurrencyExact } from './format'
import { getAppropriateEntries } from './getAppropriateEntries'
import { getHoverIndex } from './getHoverIndex'
import { getYAxis } from './getYAxis'

export function calculateTokenTvlView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  if (!controls.token) {
    return undefined
  }
  // reassigned for callbacks. Thanks typescript :(
  const token = controls.token

  const response = controls.token && responses.tokenTvl[controls.token]
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
    balance: formatCurrencyExact(balance, token),
    usd: formatCurrencyExact(usd, 'usd'),
  }))

  return {
    chart: { type: 'TokenTvlChart', points },
    dateRange,
    labels,
    showHoverAtIndex: getHoverIndex(controls.mouseX, points.length),
  }
}
