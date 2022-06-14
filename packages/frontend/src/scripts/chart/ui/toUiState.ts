import { formatDate, toDateRange } from '../../../shared'
import { ChartStateWithInput } from '../state'
import { calculateTicks } from './calculateTicks'
import { formatCurrency, formatCurrencyExact } from './format'
import { UiState } from './UiState'

export function toUiState(state: ChartStateWithInput): UiState {
  const dataPoints = state.input.data.filter(
    (_, i, a) => a.length - 1 - i < state.days,
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
    dataPoints[dataPoints.length - 1][0],
  )

  const description = state.token
    ? `Total ${state.token} Locked`
    : state.altCurrency
    ? 'Total Value Locked (*ETH equivalent)'
    : 'Total Value Locked (USD equivalent)'

  const values = dataPoints.map((x) => x[state.altCurrency ? 2 : 1])
  const currency = state.input.types[state.altCurrency ? 2 : 1]
  const ticks = calculateTicks(5, values, state.logScale)
  const labels = ticks.map((x) => formatCurrency(x, currency))
  const [min, , , , max] = ticks

  const getY = state.logScale ? getLogY(min, max) : getLinY(min, max)

  const points = dataPoints.map(([date, valueA, valueB], i) => ({
    x: i / (values.length - 1),
    y: getY(state.altCurrency ? valueB : valueA),
    date: formatDate(date),
    valueA: formatCurrencyExact(valueA, state.input.types[1]),
    valueB: formatCurrencyExact(valueB, state.input.types[2]),
  }))

  return {
    dateRange,
    description,
    labels,
    points,
  }
}

function getLinY(min: number, max: number) {
  return function getY(value: number) {
    return (value - min) / (max - min)
  }
}

function getLogY(min: number, max: number) {
  return function getY(value: number) {
    if (value === 0) {
      return -1
    }
    return (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))
  }
}
