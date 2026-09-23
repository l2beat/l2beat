import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'

export interface ChartSeriesPoint {
  timestamp: number
  value: number | null
}

interface Params {
  subject: string
  points: ChartSeriesPoint[]
  formatValue: (value: number) => string
  extraFacts?: string[]
}

/**
 * Turns a chart series into the sentence we server-render as its figcaption,
 * so that readers without JavaScript (crawlers, screen readers before
 * hydration) get the chart's headline numbers.
 */
export function describeChartSeries({
  subject,
  points,
  formatValue,
  extraFacts = [],
}: Params): string {
  const withData = points.filter(
    (point): point is { timestamp: number; value: number } =>
      point.value !== null,
  )
  const first = withData.at(0)
  const latest = withData.at(-1)
  if (!first || !latest) {
    return `${subject}. No data is available for this range.`
  }

  const range = `from ${formatTimestamp(first.timestamp)} to ${formatTimestamp(latest.timestamp)}`
  const change = describeChange(first.value, latest.value)
  const summary = `Latest value: ${formatValue(latest.value)}${change ? `, ${change}` : ''}.`
  return [`${subject} ${range}.`, summary, ...extraFacts].join(' ')
}

function describeChange(from: number, to: number): string | undefined {
  // A change relative to zero is infinite, so there is nothing honest to say.
  if (from === 0) return undefined
  const change = to / from - 1
  if (change === 0) return 'unchanged over this range'
  const direction = change > 0 ? 'up' : 'down'
  return `${direction} ${formatPercent(Math.abs(change))} over this range`
}
