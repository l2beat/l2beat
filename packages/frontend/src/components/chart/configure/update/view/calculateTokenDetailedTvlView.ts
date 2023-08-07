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
      console.log(`hello from calculateTokenDetailedTvlView, no token or assetType = [${controls.token}, ${controls.assetType}]`)
    return undefined
  }

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

  const isEBV = controls.assetType === 'EBV'
  const isCBV = controls.assetType === 'CBV'
  const isNMV = controls.assetType === 'NMV'
  const isUSD = controls.currency === 'usd'

  const points = entries.map(([timestamp, valueUsd, valueEth], i) => ({
    x: i / (entries.length - 1),
    y: getY(isUSD ? valueUsd : valueEth),
    parts: {
      ebv: getY(isEBV ? (isUSD ? valueUsd : valueEth) : 0),
      cbv: getY(isCBV ? (isUSD ? valueUsd : valueEth) : 0),
      nmv: getY(isNMV ? (isUSD ? valueUsd : valueEth) : 0),
    },
    date: formatTimestamp(timestamp, true),
    usd: valueUsd,
    eth: valueEth,
    usdParts: {
      cbv: isEBV ? valueUsd : 0,
      ebv: isCBV ? valueUsd : 0,
      nmv: isNMV ? valueUsd : 0,
    },
    ethParts: {
      cbv: isEBV ? valueEth : 0,
      ebv: isCBV ? valueEth : 0,
      nmv: isNMV ? valueEth : 0,
    },
    milestone: data.milestones[timestamp],
  }))

  return {
    chart: { type: 'AggregateDetailedTvlChart', points },
    dateRange,
    labels,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
  }
}
