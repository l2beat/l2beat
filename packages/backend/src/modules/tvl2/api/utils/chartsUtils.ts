import {
  assert,
  ProjectId,
  TokenTvlApiChart,
  TvlApiChart,
  UnixTime,
} from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { asNumber } from '../../../tvl/api/asNumber'
import { ValueRecord } from '../../repositories/ValueRepository'
import { calculateValue } from '../../utils/calculateValue'
import { ValuesMap } from './types'

export function sumValuesPerSource(values: ValueRecord[]) {
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
export function getChartData({
  start,
  end,
  step,
  aggregatedValues,
  chartId,
  ethPrices,
}: {
  start: UnixTime
  end: UnixTime
  step: [number, 'hours' | 'days']
  aggregatedValues: ValuesMap
  ethPrices: Map<number, number>
  chartId: string | ProjectId
}) {
  const values = []
  for (let curr = start; curr.lte(end); curr = curr.add(...step)) {
    const value = aggregatedValues.get(curr.toNumber())
    assert(
      value,
      'Value not found for chart ' +
        chartId.toString() +
        ' at timestamp ' +
        curr.toString(),
    )
    const ethPrice = ethPrices.get(curr.toNumber())
    assert(ethPrice, 'Eth price not found for timestamp ' + curr.toString())

    values.push(getChartPoint(curr, ethPrice, value))
  }
  return values
}
export function getTokenChartData({
  start,
  end,
  step,
  amountsAndPrices,
  decimals,
}: {
  start: UnixTime
  end: UnixTime
  step: [number, 'days' | 'hours']
  amountsAndPrices: Dictionary<{ amount: bigint; price: number }>
  decimals: number
}) {
  const data: [UnixTime, number, number][] = []
  for (let curr = start; curr <= end; curr = curr.add(...step)) {
    const amountAndPrice = amountsAndPrices[curr.toString()]
    assert(
      amountAndPrice !== undefined,
      'Value not found for timestamp ' + curr.toString(),
    )
    const valueUsd = calculateValue({
      amount: amountAndPrice.amount,
      priceUsd: amountAndPrice.price,
      decimals,
    })
    data.push([
      curr,
      asNumber(amountAndPrice.amount, decimals),
      asNumber(valueUsd, 2),
    ] as const)
  }
  return data
}
export function convertSourceName(source: 'canonical' | 'external' | 'native') {
  switch (source) {
    case 'canonical':
      return 'CBV' as const
    case 'external':
      return 'EBV' as const
    case 'native':
      return 'NMV' as const
  }
}
export function getChart(data: TvlApiChart['data']): TvlApiChart {
  return {
    types: [
      'timestamp',
      'valueUsd',
      'cbvUsd',
      'ebvUsd',
      'nmvUsd',
      'valueEth',
      'cbvEth',
      'ebvEth',
      'nmvEth',
    ] as [
      'timestamp',
      'valueUsd',
      'cbvUsd',
      'ebvUsd',
      'nmvUsd',
      'valueEth',
      'cbvEth',
      'ebvEth',
      'nmvEth',
    ],
    data,
  }
}
function getChartPoint(
  timestamp: UnixTime,
  ethPrice: number,
  values: { canonical: bigint; external: bigint; native: bigint },
) {
  const valueUsd = asNumber(
    values.canonical + values.external + values.native,
    2,
  )
  const cbvUsd = asNumber(values.canonical, 2)
  const ebvUsd = asNumber(values.external, 2)
  const nmvUsd = asNumber(values.native, 2)
  const valueEth = valueUsd / ethPrice
  const cbvEth = cbvUsd / ethPrice
  const ebvEth = ebvUsd / ethPrice
  const nmvEth = nmvUsd / ethPrice

  return [
    timestamp,
    valueUsd,
    cbvUsd,
    ebvUsd,
    nmvUsd,
    valueEth,
    cbvEth,
    ebvEth,
    nmvEth,
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
export function subtractTokenChart(
  main: TvlApiChart,
  token: TokenTvlApiChart,
  tokenType: 'canonical' | 'external' | 'native',
  ethPrices: Map<number, number>,
): TvlApiChart {
  const data = main.data.map((x) => {
    const tokenAt = token.data.find((d) => d[0].equals(x[0]))

    if (!tokenAt) {
      return x
    }
    const tokenUsdValue = tokenAt[2]
    // TODO
    const ethPriceAt = ethPrices.get(x[0].toNumber())
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
