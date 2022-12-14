import { formatRange, formatTimestamp } from '../../../../../utils'
import { State } from '../../state/State'
import { formatCurrency } from './format'
import { getAppropriateEntries } from './getAppropriateEntries'
import { getYAxis } from './getYAxis'

export function calculateRegularTvlView(
  data: State['data'],
  controls: State['controls'],
): State['view'] | undefined {
  const response = controls.showAlternativeTvl
    ? data.alternativeTvl
    : data.aggregateTvl
  if (!response) {
    return undefined
  }

  const entries = getAppropriateEntries(controls.days, response)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    entries.map((x) => (controls.currency === 'usd' ? x[1] : x[2])),
    controls.labelCount,
    controls.isLogScale,
    (x) => formatCurrency(x, controls.currency),
  )

  const points = entries.map(([timestamp, usd, eth], i) => ({
    x: i / (entries.length - 1),
    y: getY(controls.currency === 'usd' ? usd : eth),
    date: formatTimestamp(timestamp, true),
    usd,
    eth,
    milestone: data.milestones[timestamp],
  }))

  return {
    chart: { type: 'AggregateTvlChart', points },
    dateRange,
    labels,
    showHoverAtIndex: undefined,
    showMilestoneHover: undefined,
  }
}
