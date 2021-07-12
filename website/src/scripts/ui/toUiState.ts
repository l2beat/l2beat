import { ChartStateWithInput } from '../state'
import { calculateTicks } from './calculateTicks'
import { toDateRange } from './dates'
import { UiState } from './UiState'

export function toUiState(state: ChartStateWithInput): UiState {
  const dataPoints = state.input.data.filter(
    (_, i, a) => a.length - 1 - i < state.days
  )
  if (dataPoints.length === 0) {
    return {
      dateRange: 'No data',
      description: 'Empty chart',
      labels: ['', '', '', '', ''],
      points: [],
    }
  }
  const dateRange = toDateRange(
    dataPoints[0][0],
    dataPoints[dataPoints.length - 1][0]
  )

  const description = state.altCurrency
    ? 'Total Value Locked (ETH equivalent)'
    : 'Total Value Locked (USD equivalent)'

  let values = dataPoints.map((x) => x[state.altCurrency ? 2 : 1])
  let ticks = calculateTicks(5, Math.min(...values), Math.max(...values))
  const labels = ticks.map((x) => x.toString())
  if (state.logScale) {
    // TODO: better log scale support
    values = values.map((x) => Math.log(x))
    ticks[0] = Math.min(...values)
    ticks = ticks.map((x) => Math.log(x))
  }
  const [min, , , , max] = ticks

  const points = values.map((value, i) => ({
    x: i / (values.length - 1),
    y: (value - min) / (max - min),
  }))

  return {
    dateRange,
    description,
    labels,
    points,
  }
}
