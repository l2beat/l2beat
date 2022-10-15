import { formatRange, formatTimestamp } from '../../../../utils'
import { calculateTicks } from '../../configure/ui/calculateTicks'
import { formatCurrency, formatCurrencyExact } from '../../configure/ui/format'
import { State } from '../state/State'

export function calculateView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  if (controls.view === 'tvl') {
    if (controls.token) {
      return calculateTokenTvlView(responses, controls)
    } else {
      return calculateRegularTvlView(responses, controls)
    }
  } else {
    return calculateActivityView(responses, controls)
  }
}

function calculateTokenTvlView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  if (!controls.token) {
    return undefined
  }
  // reassigned for callbacks. Thanks typescript :(
  const token = controls.token

  const response = controls.token && responses.tokenTvl[controls.token]
  if (!response) {
    return undefined
  }

  const entries = getAppropriateEntries(controls.days, response)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    entries.map((x) => x[1]),
    controls.isLogScale,
    (x) => formatCurrency(x, token),
  )

  const points = entries.map(([timestamp, balance, usd], i) => ({
    x: i / (entries.length - 1),
    y: getY(balance),
    date: formatTimestamp(timestamp, true),
    balance: formatCurrencyExact(balance, token),
    usd: formatCurrencyExact(usd, 'usd'),
  }))

  return {
    chart: { type: 'TokenTvlChart', points },
    dateRange,
    labels,
    showHoverAtIndex: getHoverIndex(controls.mouseX, points.length),
  }
}

function calculateRegularTvlView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  const response = controls.showAlternativeTvl
    ? responses.alternativeTvl
    : responses.aggregateTvl
  if (!response) {
    return undefined
  }

  const entries = getAppropriateEntries(controls.days, response)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    entries.map((x) => (controls.currency === 'usd' ? x[1] : x[2])),
    controls.isLogScale,
    (x) => formatCurrency(x, controls.currency),
  )

  const points = entries.map(([timestamp, usd, eth], i) => ({
    x: i / (entries.length - 1),
    y: getY(controls.currency === 'usd' ? usd : eth),
    date: formatTimestamp(timestamp, true),
    usd: formatCurrencyExact(usd, 'usd'),
    eth: formatCurrencyExact(eth, 'eth'),
  }))

  return {
    chart: { type: 'AggregateTvlChart', points },
    dateRange,
    labels,
    showHoverAtIndex: getHoverIndex(controls.mouseX, points.length),
  }
}

function calculateActivityView(
  responses: State['responses'],
  controls: State['controls'],
): State['view'] | undefined {
  if (!responses.activity) {
    return undefined
  }

  const entries = responses.activity.daily.data.slice(-controls.days)
  const dateRange = formatRange(entries[0][0], entries[entries.length - 1][0])
  const { labels, getY } = getYAxis(
    controls.showEthereum
      ? entries.flatMap((x) => [getTps(x[1]), getTps(x[2])])
      : entries.map((x) => getTps(x[1])),
    controls.isLogScale,
    (x) => x.toFixed(2), // TODO: better formatting
  )

  const points = entries.map(
    ([timestamp, transactions, ethereumTransactions], i) => ({
      x: i / (entries.length - 1),
      y: getY(getTps(transactions)),
      y2: getY(getTps(ethereumTransactions)),
      date: formatTimestamp(timestamp, true),
      tps: getTps(transactions).toFixed(2),
      ethereumTps: getTps(ethereumTransactions).toFixed(2),
    }),
  )

  return {
    chart: { type: 'ActivityChart', points },
    dateRange,
    labels,
    showHoverAtIndex: getHoverIndex(controls.mouseX, points.length),
  }
}

function getAppropriateEntries<T>(
  days: number,
  response: {
    hourly: { data: T[] }
    sixHourly: { data: T[] }
    daily: { data: T[] }
  },
) {
  if (days <= 7) {
    return response.hourly.data.slice(-24 * days)
  } else if (days <= 90) {
    return response.sixHourly.data.slice(-4 * days)
  } else {
    return response.daily.data.slice(-days)
  }
}

function getTps(dailyTransactions: number) {
  return dailyTransactions / (60 * 60 * 24)
}

function getYAxis(
  values: number[],
  isLogScale: boolean,
  format: (value: number) => string,
) {
  const LABEL_COUNT = 5
  const ticks = calculateTicks(LABEL_COUNT, values, isLogScale)
  const labels = ticks.map(format)
  const min = ticks[0]
  const max = ticks[ticks.length - 1]
  const getY = isLogScale ? getLogY(min, max) : getLinY(min, max)
  return {
    labels,
    getY,
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

function getHoverIndex(mouseX: number | undefined, points: number) {
  if (mouseX && points > 0) {
    // This only works if the points are evenly distributed
    return Math.round(mouseX * (points - 1))
  }
}
