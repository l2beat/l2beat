import { formatRange, formatTimestamp } from '../../../../../utils'
import { State } from '../../state/State'
import { formatCurrency } from './format'
import { getAppropriateEntries } from './getAppropriateEntries'
import { getYAxis } from './getYAxis'

export function calculateRegularDetailedTvlView(
  data: State['data'],
  controls: State['controls'],
): State['view'] | undefined {
  const response = data.aggregateDetailedTvl
  if (!response) {
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

  const points = entries.map(
    (
      [
        timestamp,
        valueUsd,
        cbvUsd,
        ebvUsd,
        nmvUsd,
        valueEth,
        cbvEth,
        ebvEth,
        nmvEth,
      ],
      i,
    ) => ({
      x: i / (entries.length - 1),
      y: getY(controls.currency === 'usd' ? valueUsd : valueEth),
      parts: {
        cbv: getY(
          controls.currency === 'usd'
            ? cbvUsd + ebvUsd + nmvUsd
            : cbvEth + ebvEth + nmvEth,
        ),
        ebv: getY(
          controls.currency === 'usd' ? ebvUsd + nmvUsd : ebvEth + nmvEth,
        ),
        nmv: getY(controls.currency === 'usd' ? nmvUsd : nmvEth),
      },
      date: formatTimestamp(timestamp, true),
      usd: valueUsd,
      eth: valueEth,
      usdParts: {
        cbv: cbvUsd,
        ebv: ebvUsd,
        nmv: nmvUsd,
      },
      ethParts: {
        cbv: cbvEth,
        ebv: ebvEth,
        nmv: nmvEth,
      },
      milestone: data.milestones[timestamp],
    }),
  )

  return {
    chart: { type: 'AggregateDetailedTvlChart', points },
    dateRange,
    labels,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
  }
}
