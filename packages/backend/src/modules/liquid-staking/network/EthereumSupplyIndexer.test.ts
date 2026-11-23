import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { EthereumSupplyIndexer } from './EthereumSupplyIndexer'

describe(EthereumSupplyIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const day = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
  const { DAY, HOUR } = UnixTime

  it('stores the value at each day start, up to the adjusted height', async () => {
    const { indexer, daily, circulatingSupply } = createIndexer({
      adjustedTo: UnixTime(day + 2 * DAY + 5 * HOUR),
    })

    // The previous height is `day`, already stored.
    expect(await indexer.update(day + 1, day + 9 * DAY)).toEqual(day + 2 * DAY)

    expect(circulatingSupply.getAdjustedTo).toHaveBeenOnlyCalledWith(
      day + DAY,
      day + 9 * DAY,
    )
    expect(circulatingSupply.getCirculatingSupplies).toHaveBeenOnlyCalledWith(
      CoingeckoId('ethereum'),
      { from: UnixTime(day + DAY), to: UnixTime(day + 2 * DAY) },
    )
    expect(daily.upsertMany).toHaveBeenOnlyCalledWith([
      { timestamp: UnixTime(day + DAY), supply: supplyAt(day + DAY) },
      { timestamp: UnixTime(day + 2 * DAY), supply: supplyAt(day + 2 * DAY) },
    ])
  })

  it('stores the first day on the first update', async () => {
    const { indexer, daily } = createIndexer({ adjustedTo: day })

    expect(await indexer.update(day, day + 9 * DAY)).toEqual(day)
    expect(daily.upsertMany).toHaveBeenOnlyCalledWith([
      { timestamp: day, supply: supplyAt(day) },
    ])
  })

  it('keeps the days up to the invalidated height', async () => {
    const { indexer, daily } = createIndexer({ adjustedTo: day })

    expect(await indexer.invalidate(day + 3 * DAY)).toEqual(day + 3 * DAY)
    expect(daily.deleteAfter).toHaveBeenOnlyCalledWith(UnixTime(day + 3 * DAY))
  })
})

function supplyAt(timestamp: number) {
  return 120_000_000 + timestamp / UnixTime.HOUR
}

function createIndexer({ adjustedTo }: { adjustedTo: UnixTime }) {
  const daily = mockObject<Database['ethereumSupplyDaily']>({
    upsertMany: mockFn().resolvesTo(1),
    deleteAfter: mockFn().resolvesTo(0),
  })
  const circulatingSupply = {
    getAdjustedTo: mockFn().returns(adjustedTo),
    // Hourly, like CoinGecko's, so the indexer has to pick the day starts.
    getCirculatingSupplies: mockFn(
      async (_id: CoingeckoId, range: { from: UnixTime; to: UnixTime }) => {
        const points = []
        for (let t = range.from; t <= range.to; t += UnixTime.HOUR) {
          points.push({ timestamp: UnixTime(t), value: supplyAt(t) })
        }
        return points
      },
    ),
  }
  const indexer = new EthereumSupplyIndexer(
    {
      parents: [],
      indexerService: mockObject<IndexerService>(),
      firstDay: UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
      db: mockDatabase({ ethereumSupplyDaily: daily }),
      circulatingSupply,
    },
    Logger.SILENT,
  )
  return { indexer, daily, circulatingSupply }
}
