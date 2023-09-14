import { CoingeckoClient, CoinMarketChartRangeData } from '@l2beat/shared'
import {
  assert,
  CoingeckoId,
  EthereumAddress,
  getTimestamps,
  UnixTime,
} from '@l2beat/shared-pure'

export interface QueryResultPoint {
  value: number
  timestamp: UnixTime
  deltaMs: number
}

// TODO: add cache to avoid querying the same data multiple times
// because right now some tokens will have the same CoingeckoId
export class CoingeckoQueryService {
  constructor(private readonly coingeckoClient: CoingeckoClient) {}

  async getUsdPriceHistory(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    const queryResult = await this.pickAndQuery(
      coingeckoId,
      { from, to },
      address,
    )

    return queryResult.prices
  }

  async getCirculatingSupplies(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime | undefined; to: UnixTime },
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    const queryResult = await this.pickAndQuery(coingeckoId, range, address)

    const from = range.from ?? queryResult.prices[0].timestamp

    const timestamps = getTimestamps(from, range.to)

    const result: QueryResultPoint[] = []

    for (let i = 0; i < timestamps.length; i++) {
      const price = queryResult.prices[i].value
      const marketCap = queryResult.marketCaps[i].value

      const value = approximateCirculatingSupply(marketCap, price)

      result.push({
        value,
        timestamp: timestamps[i],
        deltaMs: queryResult.prices[i].deltaMs,
      })
    }

    return result.filter((x) => x.timestamp.gte(from))
  }

  async pickAndQuery(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime | undefined; to: UnixTime },
    address?: EthereumAddress,
  ) {
    const queryResult = range.from
      ? await this.queryCoinMarketChartRange(
          coingeckoId,
          range.from,
          range.to,
          address,
        )
      : await this.queryCoinMarketChartRangeWhole(
          coingeckoId,
          range.to,
          address,
        )

    assert(queryResult, 'Programmer error: It should not be null there')

    const from = range.from ?? UnixTime.fromDate(queryResult.prices[0].date)

    const timestamps = getTimestamps(from, range.to)

    return {
      prices: pickPoints(queryResult.prices, timestamps),
      marketCaps: pickPoints(queryResult.marketCaps, timestamps),
      totalVolumes: pickPoints(queryResult.totalVolumes, timestamps),
    }
  }

  async queryCoinMarketChartRange(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<CoinMarketChartRangeData> {
    const [start, end] = adjustAndOffset(from, to)

    const results = await Promise.allSettled(
      generateRangesToCallHourly(start, end).map((range) =>
        this.coingeckoClient.getCoinMarketChartRange(
          coingeckoId,
          'usd',
          range.start,
          range.end,
          address,
        ),
      ),
    )

    const checked: CoinMarketChartRangeData[] = checkResults(
      results,
      coingeckoId,
      from,
      to,
    )

    return concatResults(checked)
  }

  async queryCoinMarketChartRangeWhole(
    coingeckoId: CoingeckoId,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<CoinMarketChartRangeData | null> {
    const results: CoinMarketChartRangeData[] | null = []

    let currentTo = new UnixTime(to.toNumber())

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const data = await this.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        currentTo.add(-COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days'),
        currentTo,
        address,
      )
      if (data === null) break

      currentTo = currentTo.add(-COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days')

      results.push(data)
    }

    return concatResults(results)
  }

  async getCoinIds(): Promise<Map<EthereumAddress, CoingeckoId>> {
    const coinsList = await this.coingeckoClient.getCoinList({
      includePlatform: true,
    })

    const result = new Map()

    coinsList.map((coin) => {
      if (coin.platforms.ethereum)
        result.set(EthereumAddress(coin.platforms.ethereum), coin.id)
    })

    return result
  }
}

function checkResults(
  results: PromiseSettledResult<CoinMarketChartRangeData | null>[],
  coingeckoId: CoingeckoId,
  from: UnixTime,
  to: UnixTime,
) {
  const checked: CoinMarketChartRangeData[] | null = []

  for (const result of results) {
    if (result.status === 'rejected') {
      throw result.reason
    }
    assert(result.value, getAssertMessage(coingeckoId, from, to))

    checked.push(result.value)
  }
  return checked
}

export function pickPoints(
  points: { value: number; date: Date }[],
  timestamps: UnixTime[],
): QueryResultPoint[] {
  //TODO: Handle this case properly
  if (points.length === 0) return []
  const result: QueryResultPoint[] = []

  const sortedPoints = points.sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  )

  const getDelta = (i: number, j: number) =>
    sortedPoints[j].date.getTime() - timestamps[i].toNumber() * 1000

  const nextIsCloser = (i: number, j: number) =>
    j + 1 < sortedPoints.length &&
    Math.abs(getDelta(i, j)) >= Math.abs(getDelta(i, j + 1))

  let j = 0
  for (let i = 0; i < timestamps.length; i++) {
    while (nextIsCloser(i, j)) {
      j++
    }
    result.push({
      value: sortedPoints[j].value,
      timestamp: timestamps[i],
      deltaMs: getDelta(i, j),
    })
  }
  return result
}

function adjust(from: UnixTime, to: UnixTime) {
  const period = 'hour'
  return [
    from.isFull(period) ? from : from.toNext(period),
    to.isFull(period) ? to : to.toStartOf(period),
  ]
}

function adjustAndOffset(from: UnixTime, to: UnixTime) {
  const [start, end] = adjust(from, to)
  return [start.add(-12, 'hours'), end.add(12, 'hours')]
}

export const COINGECKO_HOURLY_MAX_SPAN_IN_DAYS = 80

export function generateRangesToCallHourly(from: UnixTime, to: UnixTime) {
  const ranges = []
  for (
    let start = from;
    start.lt(to);
    start = start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days')
  ) {
    const end = start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days')
    ranges.push({ start: start, end: end.gt(to) ? to : end })
  }
  return ranges
}

function concatResults(results: CoinMarketChartRangeData[]) {
  const marketChartRangeData: CoinMarketChartRangeData = {
    prices: [],
    marketCaps: [],
    totalVolumes: [],
  }
  for (const result of results) {
    marketChartRangeData.prices.push(...result.prices)
    marketChartRangeData.marketCaps.push(...result.marketCaps)
    marketChartRangeData.totalVolumes.push(...result.totalVolumes)
  }

  return marketChartRangeData
}

// This function is a neat helper to make circulating supply values more "round"
// Calculates the amount of digits in the number, and then "zeroes out" the last four of them
// e.g. 123456789 -> 123450000
export function approximateCirculatingSupply(marketCap: number, price: number) {
  const circulatingSupplyRaw = marketCap / price

  // reduce variation in the result by disregarding least significant parts
  const log = Math.floor(Math.log10(circulatingSupplyRaw))
  const digitsToClear = Math.max(log - 4, 0)
  const precision = 10 ** digitsToClear
  const value = Math.round(circulatingSupplyRaw / precision) * precision

  return value
}

function getAssertMessage(
  coingeckoId: CoingeckoId,
  from: UnixTime | undefined,
  to: UnixTime,
): string | undefined {
  return `Market chart query result should not be null. ID: ${coingeckoId.toString()} from: ${
    from ? from.toNumber() : 'undefined'
  } to: ${to.toNumber()}`
}
