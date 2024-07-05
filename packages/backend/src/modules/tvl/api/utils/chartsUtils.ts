import {
  assert,
  ProjectId,
  TokenTvlApiChart,
  TokenTvlApiCharts,
  TvlApiChart,
  TvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { ValueRecord } from '../../repositories/ValueRepository'
import { asNumber } from '../../utils/asNumber'
import { calculateValue } from '../../utils/calculateValue'

export type ValuesForSource = {
  external: bigint
  canonical: bigint
  native: bigint
}

export function sumValuesPerSource(values: ValueRecord[]): ValuesForSource {
  return values.reduce(
    (acc, curr) => {
      acc.canonical += curr.canonical
      acc.external += curr.external
      acc.native += curr.native
      return acc
    },
    { canonical: 0n, external: 0n, native: 0n },
  )
}

export function getChartsData(props: {
  dailyStart: UnixTime
  sixHourlyStart: UnixTime
  hourlyStart: UnixTime
  lastHour: UnixTime
  aggregate: Map<number, ValuesForSource>
  ethPrices: Dictionary<number>
}): TvlApiCharts {
  const dailyData = getChartData({
    start: props.dailyStart,
    end: props.lastHour,
    step: [1, 'days'],
    aggregatedValues: props.aggregate,
    ethPrices: props.ethPrices,
    chartId: '/tvl/aggregate',
  })

  const sixHourlyData = getChartData({
    start: props.sixHourlyStart,
    end: props.lastHour,
    step: [6, 'hours'],
    aggregatedValues: props.aggregate,
    ethPrices: props.ethPrices,
    chartId: '/tvl/aggregate',
  })

  const hourlyData = getChartData({
    start: props.hourlyStart,
    end: props.lastHour,
    step: [1, 'hours'],
    aggregatedValues: props.aggregate,
    ethPrices: props.ethPrices,
    chartId: '/tvl/aggregate',
  })

  return {
    hourly: getChart(hourlyData),
    sixHourly: getChart(sixHourlyData),
    daily: getChart(dailyData),
  }
}

export function getChartData(props: {
  start: UnixTime
  end: UnixTime
  step: [number, 'hours' | 'days']
  aggregatedValues: Map<number, ValuesForSource>
  ethPrices: Dictionary<number>
  chartId: string | ProjectId
}) {
  const values = []
  for (
    let curr = props.start;
    curr.lte(props.end);
    curr = curr.add(...props.step)
  ) {
    const value = props.aggregatedValues.get(curr.toNumber())
    assert(
      value,
      'Value not found for chart ' +
        props.chartId.toString() +
        ' at timestamp ' +
        curr.toString(),
    )
    const ethPrice = props.ethPrices[curr.toNumber()]
    assert(ethPrice, 'Eth price not found for timestamp ' + curr.toString())

    values.push(getChartPoint(curr, ethPrice, value))
  }
  return values
}

export function getTokenCharts(
  targetTimestamp: UnixTime,
  dailyStart: UnixTime,
  sixHourlyStart: UnixTime,
  hourlyStart: UnixTime,
  amounts: Dictionary<bigint>,
  prices: Dictionary<number>,
  decimals: number,
): TokenTvlApiCharts {
  const dailyData = getTokenChartData({
    start: dailyStart,
    end: targetTimestamp,
    step: [1, 'days'],
    amounts,
    prices,
    decimals,
  })

  const sixHourlyData = getTokenChartData({
    start: sixHourlyStart,
    end: targetTimestamp,
    step: [6, 'hours'],
    amounts,
    prices,
    decimals,
  })

  const hourlyData = getTokenChartData({
    start: hourlyStart,
    end: targetTimestamp,
    step: [1, 'hours'],
    amounts,
    prices,
    decimals,
  })

  return {
    daily: {
      types: ['timestamp', 'amount', 'valueUsd'],
      data: dailyData,
    },
    sixHourly: {
      types: ['timestamp', 'amount', 'valueUsd'],
      data: sixHourlyData,
    },
    hourly: {
      types: ['timestamp', 'amount', 'valueUsd'],
      data: hourlyData,
    },
  }
}

export function getTokenChartData(props: {
  start: UnixTime
  end: UnixTime
  step: [number, 'days' | 'hours']
  amounts: Dictionary<bigint>
  prices: Dictionary<number>
  decimals: number
}) {
  const data: [UnixTime, number, number][] = []
  for (
    let curr = props.start;
    curr <= props.end;
    curr = curr.add(...props.step)
  ) {
    const amount = props.amounts[curr.toString()] ?? 0n

    const price = props.prices[curr.toString()]
    assert(price, 'Price not found for timestamp ' + curr.toString())
    const valueUsd = calculateValue({
      amount: amount,
      priceUsd: price,
      decimals: props.decimals,
    })
    data.push([
      curr,
      asNumber(amount, props.decimals),
      asNumber(valueUsd, 2),
    ] as const)
  }
  return data
}

export function getChart(data: TvlApiChart['data']): TvlApiChart {
  return {
    types: [
      'timestamp',
      'totalUsd',
      'canonicalUsd',
      'externalUsd',
      'nativeUsd',
      'totalEth',
      'canonicalEth',
      'externalEth',
      'nativeEth',
    ] as TvlApiChart['types'],
    data,
  }
}
function getChartPoint(
  timestamp: UnixTime,
  ethPrice: number,
  values: { canonical: bigint; external: bigint; native: bigint },
) {
  const totalUsd = asNumber(
    values.canonical + values.external + values.native,
    2,
  )
  const canonicalUsd = asNumber(values.canonical, 2)
  const externalUsd = asNumber(values.external, 2)
  const nativeUsd = asNumber(values.native, 2)
  const totalEth = totalUsd / ethPrice
  const canonicalEth = canonicalUsd / ethPrice
  const external = externalUsd / ethPrice
  const nativeEth = nativeUsd / ethPrice

  return [
    timestamp,
    totalUsd,
    canonicalUsd,
    externalUsd,
    nativeUsd,
    totalEth,
    canonicalEth,
    external,
    nativeEth,
  ] as TvlApiChart['data'][0]
}
export function sumCharts(
  chart1: TvlApiChart,
  chart2: TvlApiChart,
): TvlApiChart {
  // adjust chart length to the longer chart
  const lastTimestamp1 = chart1.data.at(-1)?.[0]
  const lastTimestamp2 = chart2.data.at(-1)?.[0]

  assert(
    lastTimestamp1 && lastTimestamp2 && lastTimestamp1.equals(lastTimestamp2),
    'Last timestamp mismatch',
  )

  const longerChart = chart1.data.length > chart2.data.length ? chart1 : chart2
  const shorterChart = chart1.data.length > chart2.data.length ? chart2 : chart1
  const shorterPadded = Array(
    longerChart.data.length - shorterChart.data.length,
  )
    .fill([new UnixTime(0), 0, 0, 0, 0, 0, 0, 0, 0] as TvlApiChart['data'][0])
    .concat(shorterChart.data)

  return {
    types: longerChart.types,
    data: longerChart.data.map(
      (x, i) =>
        [
          x[0],
          x[1] + shorterPadded[i][1],
          x[2] + shorterPadded[i][2],
          x[3] + shorterPadded[i][3],
          x[4] + shorterPadded[i][4],
          x[5] + shorterPadded[i][5],
          x[6] + shorterPadded[i][6],
          x[7] + shorterPadded[i][7],
          x[8] + shorterPadded[i][8],
        ] as TvlApiChart['data'][0],
    ),
  }
}

export function subtractTokenCharts(
  main: TvlApiCharts,
  token: TokenTvlApiCharts,
  tokenType: 'canonical' | 'external' | 'native',
  ethPrices: Dictionary<number>,
): TvlApiCharts {
  return {
    hourly: subtractTokenChart(main.hourly, token.hourly, tokenType, ethPrices),
    sixHourly: subtractTokenChart(
      main.sixHourly,
      token.sixHourly,
      tokenType,
      ethPrices,
    ),
    daily: subtractTokenChart(main.daily, token.daily, tokenType, ethPrices),
  }
}

export function subtractTokenChart(
  main: TvlApiChart,
  token: TokenTvlApiChart,
  tokenType: 'canonical' | 'external' | 'native',
  ethPrices: Dictionary<number>,
): TvlApiChart {
  const data = main.data.map((x) => {
    const tokenAt = token.data.find((d) => d[0].equals(x[0]))

    if (!tokenAt) {
      return x
    }
    const tokenUsdValue = tokenAt[2]
    const ethPriceAt = ethPrices[x[0].toNumber()]
    assert(ethPriceAt, `Eth price not found for timestamp ${x[0].toString()}`)
    const tokenEthValue = tokenUsdValue / ethPriceAt

    return [
      x[0],
      x[1] - tokenUsdValue,
      tokenType === 'canonical' ? x[2] - tokenUsdValue : x[2],
      tokenType === 'external' ? x[3] - tokenUsdValue : x[3],
      tokenType === 'native' ? x[4] - tokenUsdValue : x[4],
      +(x[5] - tokenEthValue).toFixed(2),
      tokenType === 'canonical' ? +(x[6] - tokenEthValue).toFixed(2) : x[6],
      tokenType === 'external' ? +(x[7] - tokenEthValue).toFixed(2) : x[7],
      tokenType === 'native' ? +(x[8] - tokenEthValue).toFixed(2) : x[8],
    ] as TvlApiChart['data'][0]
  })

  return {
    types: main.types,
    data,
  }
}
