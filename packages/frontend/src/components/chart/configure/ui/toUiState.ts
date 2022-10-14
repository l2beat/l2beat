import { formatRange, formatTimestamp } from '../../../../utils'
import { ChartStateWithInput } from '../state'
import { ChartInput } from '../state/ChartInput'
import { calculateTicks } from './calculateTicks'
import { formatCurrency, formatCurrencyExact } from './format'
import { UiState } from './UiState'

function getDataPoints(
  points: ChartInput['data'],
  days: number,
  onlyDaily = false,
) {
  return days === 7
    ? points
    : days <= 90 && !onlyDaily
    ? points.slice(-1 * 4 * days)
    : points.slice(-1 * days)
}

export function toUiState(state: ChartStateWithInput): UiState {
  const onlyDaily = state.type === 'activity'
  const dataPoints = getDataPoints(state.mainInput.data, state.days, onlyDaily)
  if (dataPoints.length === 0) {
    return {
      dateRange: 'No data',
      labels: ['', '', '', '', ''],
      mainPoints: [],
    }
  }
  const dateRange = formatRange(
    dataPoints[0][0],
    dataPoints[dataPoints.length - 1][0],
  )

  const values = dataPoints.map((x) => x[state.altCurrency ? 2 : 1])
  const currency = state.mainInput.types[state.altCurrency ? 2 : 1]
  const ticks = calculateTicks(5, values, state.logScale)
  const labels = ticks.map((x) => formatCurrency(x, currency))
  const [min, , , , max] = ticks

  const getY = state.logScale ? getLogY(min, max) : getLinY(min, max)
  const mainPoints = calcPoints(
    state.mainInput.data,
    state,
    values,
    getY,
    onlyDaily,
  )

  if (!state.secondaryInput) {
    return {
      dateRange,
      labels,
      mainPoints,
    }
  }

  const secondaryData = state.secondaryInput.data.slice(-mainPoints.length)
  const secondaryPoints = calcPoints(
    secondaryData,
    state,
    values,
    getY,
    onlyDaily,
  )

  return {
    dateRange,
    labels,
    mainPoints,
    secondaryPoints,
  }
}

function calcPoints(
  data: ChartInput['data'],
  state: ChartStateWithInput,
  values: number[],
  getY: (value: number) => number,
  onlyDaily: boolean,
) {
  const dataPoints = getDataPoints(data, state.days, onlyDaily)

  const points = dataPoints.map(([timestamp, valueA, valueB], i) => ({
    x: i / (values.length - 1),
    y: getY(state.altCurrency ? valueB : valueA),
    date: formatTimestamp(timestamp, true),
    valueA: formatCurrencyExact(valueA, state.mainInput.types[1]),
    valueB: formatCurrencyExact(valueB, state.mainInput.types[2]),
  }))

  return points
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
