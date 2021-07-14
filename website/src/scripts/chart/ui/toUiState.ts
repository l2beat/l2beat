import { ChartStateWithInput } from '../state'
import { calculateTicks } from './calculateTicks'
import { toDateRange } from './dates'
import { UiState } from './UiState'
import { formatCurrency } from './format'

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

  const description = state.token
    ? `Total ${state.token} Locked`
    : state.altCurrency
    ? 'Total Value Locked (ETH equivalent)'
    : 'Total Value Locked (USD equivalent)'

  const values = dataPoints.map((x) => x[state.altCurrency ? 2 : 1])
  const currency = state.input.types[state.altCurrency ? 2 : 1]
  const ticks = calculateTicks(5, Math.min(...values), Math.max(...values))
  const labels = ticks.map((x) => formatCurrency(x, currency))
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
