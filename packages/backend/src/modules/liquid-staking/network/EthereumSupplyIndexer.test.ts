import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CoinMarketChartRangeData } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { EthereumSupplyIndexer, toDailySupplies } from './EthereumSupplyIndexer'

const { DAY, HOUR, MINUTE } = UnixTime
const day = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

describe(EthereumSupplyIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  it('stores the start of each ended day, and moves past the last one stored', async () => {
    const { indexer, daily, coingecko } = createIndexer(
      chart([day + DAY, day + 2 * DAY]),
    )

    // The previous height is the end of `day`, already stored. The day that
    // started at the end of the range has ended too, but has no point yet.
    expect(await indexer.update(day + DAY + 1, day + 4 * DAY)).toEqual(
      day + 3 * DAY,
    )

    expect(coingecko.getCoinMarketChartRange).toHaveBeenOnlyCalledWith(
      CoingeckoId('ethereum'),
      'usd',
      UnixTime(day + DAY - HOUR),
      UnixTime(day + 3 * DAY + HOUR),
    )
    expect(daily.upsertMany).toHaveBeenOnlyCalledWith([
      { timestamp: UnixTime(day + DAY), supply: 120_000_000 },
      { timestamp: UnixTime(day + 2 * DAY), supply: 120_000_000 },
    ])
  })

  it('stores the first day on the first update', async () => {
    const { indexer, daily } = createIndexer(chart([day]))
    const { minHeight } = indexer.options

    expect(await indexer.update(minHeight, minHeight)).toEqual(minHeight)
    expect(daily.upsertMany).toHaveBeenOnlyCalledWith([
      { timestamp: day, supply: 120_000_000 },
    ])
  })

  it('leaves a day without a point empty for good once a later day has one', async () => {
    const { indexer, daily } = createIndexer(chart([day + DAY, day + 3 * DAY]))

    expect(await indexer.update(day + DAY + 1, day + 4 * DAY)).toEqual(
      day + 4 * DAY,
    )
    expect(daily.upsertMany).toHaveBeenOnlyCalledWith([
      { timestamp: UnixTime(day + DAY), supply: 120_000_000 },
      { timestamp: UnixTime(day + 3 * DAY), supply: 120_000_000 },
    ])
  })

  it('asks again later when CoinGecko has no day yet', async () => {
    const { indexer, daily } = createIndexer(chart([]))

    await expect(indexer.update(day + DAY, day + 2 * DAY)).toBeRejectedWith(
      'No ETH supply from CoinGecko',
    )
    expect(daily.upsertMany).not.toHaveBeenCalled()
  })

  it('keeps the days that end by the invalidated height', async () => {
    const { indexer, daily } = createIndexer(chart([]))

    expect(await indexer.invalidate(day + 3 * DAY)).toEqual(day + 3 * DAY)
    expect(daily.deleteAfter).toHaveBeenOnlyCalledWith(UnixTime(day + 2 * DAY))
  })
})

describe(toDailySupplies.name, () => {
  it('takes the point nearest midnight within an hour, from its own price and market cap', () => {
    const data: CoinMarketChartRangeData = {
      prices: [
        { date: date(day - 50 * MINUTE), value: 2_000 },
        { date: date(day + 10 * MINUTE), value: 3_000 },
        { date: date(day + DAY + 2 * HOUR), value: 3_000 },
      ],
      marketCaps: [
        { date: date(day - 50 * MINUTE), value: 240_000_000_000 },
        { date: date(day + 10 * MINUTE), value: 360_000_000_000 },
        { date: date(day + DAY + 2 * HOUR), value: 360_000_000_000 },
      ],
    }

    expect(toDailySupplies(data, day, UnixTime(day + DAY))).toEqual([
      { timestamp: day, supply: 120_000_000 },
    ])
  })

  it('never pairs a price with a market cap from another time', () => {
    const data: CoinMarketChartRangeData = {
      prices: [{ date: date(day), value: 3_300 }],
      marketCaps: [{ date: date(day - 2 * DAY), value: 360_000_000_000 }],
    }

    expect(toDailySupplies(data, day, day)).toEqual([])
  })

  it('pairs a price with the market cap of the same time, even when one series skips a point', () => {
    const data: CoinMarketChartRangeData = {
      prices: [
        { date: date(day - HOUR), value: 3_000 },
        { date: date(day), value: 3_000 },
      ],
      marketCaps: [{ date: date(day), value: 360_000_000_000 }],
    }

    expect(toDailySupplies(data, day, day)).toEqual([
      { timestamp: day, supply: 120_000_000 },
    ])
  })

  it('leaves out a day whose point gives no positive supply', () => {
    const data: CoinMarketChartRangeData = {
      prices: [{ date: date(day), value: 3_000 }],
      marketCaps: [{ date: date(day), value: 0 }],
    }

    expect(toDailySupplies(data, day, day)).toEqual([])
  })
})

function date(timestamp: number) {
  return UnixTime.toDate(UnixTime(timestamp))
}

/** A point at each timestamp worth 120M ETH. */
function chart(timestamps: number[]): CoinMarketChartRangeData {
  return {
    prices: timestamps.map((t) => ({ date: date(t), value: 3_000 })),
    marketCaps: timestamps.map((t) => ({
      date: date(t),
      value: 360_000_000_000,
    })),
  }
}

function createIndexer(data: CoinMarketChartRangeData) {
  const daily = mockObject<Database['ethereumSupplyDaily']>({
    upsertMany: mockFn().resolvesTo(1),
    deleteAfter: mockFn().resolvesTo(0),
  })
  const coingecko = {
    getCoinMarketChartRange: mockFn().resolvesTo(data),
  }
  const indexer = new EthereumSupplyIndexer(
    {
      parents: [],
      indexerService: mockObject<IndexerService>(),
      firstDay: day,
      db: mockDatabase({ ethereumSupplyDaily: daily }),
      coingecko,
    },
    Logger.SILENT,
  )
  return { indexer, daily, coingecko }
}
