import { formatRange, formatTimestamp } from '../../../../../utils'
import { getTokenTvlKey } from '../../state/getTokenTvlKey'
import { State } from '../../state/State'
import { formatCurrency } from './format'
import { getAppropriateEntries } from './getAppropriateEntries'
import { getYAxis } from './getYAxis'

export function calculateTokenDetailedTvlView(
  data: State['data'],
  controls: State['controls'],
): State['view'] | undefined {
  if (!controls.token || !controls.assetType) {
    return undefined
  }

  const token = controls.token

  const key = getTokenTvlKey(token, controls.assetType)
  const response = controls.token && data.tokenTvl[key]
  if (!response) {
    return undefined
  }

  const entries = getAppropriateEntries(controls.days, response)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    entries.map((x) => x[1]),
    controls.isLogScale,
    (x) => formatCurrency(x, controls.currency),
  )

  const points = entries.map(([timestamp, balance, valueUsd], i) => ({
    x: i / (entries.length - 1),
    y: getY(balance),
    date: formatTimestamp(timestamp, true),
    balance,
    symbol: token,
    usd: valueUsd,
    milestone: data.milestones[timestamp],
  }))

  return {
    chart: {
      type: 'TokenDetailedTvlChart',
      assetType: controls.assetType,
      points,
    },
    dateRange,
    labels,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
  }
}
