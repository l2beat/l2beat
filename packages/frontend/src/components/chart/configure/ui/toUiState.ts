import { formatRange, formatTimestamp } from '../../../../utils'
import { ChartStateWithInput } from '../state'
import { ChartInput } from '../state/ChartInput'
import { calculateTicks } from './calculateTicks'
import { formatCurrency, formatCurrencyExact } from './format'
import { UiState } from './UiState'

function getDataPoints(points: ChartInput['data'], days: number) {
  return days === 7
    ? points
    : days <= 90
    ? points.slice(-1 * 4 * days)
    : points.slice(-1 * days)
}

export function toUiState(state: ChartStateWithInput): UiState {
  const dataPoints = getDataPoints(state.input.data, state.days)
  if (dataPoints.length === 0) {
    return {
      dateRange: 'No data',
      description: 'Empty chart',
      labels: ['', '', '', '', ''],
      points: [],
    }
  }
  const dateRange = formatRange(
    dataPoints[0][0],
    dataPoints[dataPoints.length - 1][0],
  )

  const description = getDescription(state)
  const values = dataPoints.map((x) => x[state.altCurrency ? 2 : 1])
  const currency = state.input.types[state.altCurrency ? 2 : 1]
  const ticks = calculateTicks(5, values, state.logScale)
  const labels = ticks.map((x) => formatCurrency(x, currency))
  const [min, , , , max] = ticks

  const getY = state.logScale ? getLogY(min, max) : getLinY(min, max)

  const points = dataPoints.map(([timestamp, valueA, valueB], i) => ({
    x: i / (values.length - 1),
    y: getY(state.altCurrency ? valueB : valueA),
    date: formatTimestamp(timestamp, true),
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

function getDescription(state: ChartStateWithInput) {
  if (state.type === 'activity') {
    return 'Transactions per second'
  }

  if (state.token) {
    return `Total ${state.token} Locked`
  }

  if (state.altCurrency) {
    return 'Total Value Locked (*ETH equivalent)'
  }

  return 'Total Value Locked (USD equivalent)'
}
