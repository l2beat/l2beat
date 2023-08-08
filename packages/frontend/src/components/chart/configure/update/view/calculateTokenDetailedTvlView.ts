import { formatRange, formatTimestamp } from '../../../../../utils'
import { State } from '../../state/State'
import { formatCurrency } from './format'
import { getAppropriateEntries } from './getAppropriateEntries'
import { getYAxis } from './getYAxis'

export function calculateTokenDetailedTvlView(
  data: State['data'],
  controls: State['controls'],
): State['view'] | undefined {
  console.log('hello from calculateTokenDetailedTvlView')
  if (!controls.token || !controls.assetType) {
    console.log(
      `hello from calculateTokenDetailedTvlView, no token or assetType = [${controls.token}, ${controls.assetType}]`,
    )
    return undefined
  }

  const token = controls.token

  const response = controls.token && data.tokenTvl[controls.token]
  if (!response) {
    console.log('hello from calculateTokenDetailedTvlView, no response')
    return undefined
  }

  const entries = getAppropriateEntries(controls.days, response)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    entries.flatMap((x) =>
      controls.currency === 'usd' ? x.slice(1, 5) : x.slice(5, 9),
    ),
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
      assetType: controls.assetType ?? 'EBV',
      points,
    },
    dateRange,
    labels,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
  }
}
