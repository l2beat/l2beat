import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { GasFeesTipPayersIndexer } from './GasFeesTipPayersIndexer'
import type { TipPayersDayQueryInput } from './getTipPayersDayQuery'
import type { TipPayersDay } from './readTipPayersDay'

describe(GasFeesTipPayersIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const day = UnixTime.fromDate(new Date('2026-11-10T00:00:00Z'))
  const next = UnixTime(day + UnixTime.DAY)

  it("stores a whole day with the day's mean price and fast tip", async () => {
    const { indexer, payers, readTipPayersDay } = createIndexer(TIPS)

    expect(await indexer.update(next, day + 3 * UnixTime.DAY)).toEqual(next)
    expect(readTipPayersDay.calls[0]?.args[0].fastTipGwei).toEqual(0.5)
    expect(payers.upsert).toHaveBeenOnlyCalledWith({
      timestamp: day,
      status: 'complete',
      ethUsd: 4000,
      fastTipGwei: 0.5,
      ...TIPS.figures,
    })
  })

  it('waits for a day Dune is missing blocks of, reading it again after 6 hours at most', async () => {
    let now = next
    const { indexer, payers, readTipPayersDay } = createIndexer(
      { ...TIPS, whole: false },
      () => now,
    )

    for (const hours of [0, 5, 6]) {
      now = UnixTime(next + hours * UnixTime.HOUR)
      await expect(indexer.update(next, next)).toBeRejectedWith(
        'Tip payers day incomplete on Dune',
      )
    }
    expect(readTipPayersDay).toHaveBeenCalledTimes(2)
    expect(payers.upsert).not.toHaveBeenCalled()
  })

  it('stores a day still incomplete 3 days after it ends as missing, and moves on', async () => {
    const { indexer, payers } = createIndexer({ ...TIPS, whole: false }, () =>
      UnixTime(next + 3 * UnixTime.DAY),
    )

    expect(await indexer.update(next, next)).toEqual(next)
    expect(payers.upsert).toHaveBeenOnlyCalledWith({
      timestamp: day,
      status: 'missing',
    })
  })

  it('starts at its first day when the hourly tips lower it below', async () => {
    const { indexer, readTipPayersDay } = createIndexer(TIPS)

    expect(await indexer.update(day - UnixTime.DAY, next)).toEqual(next)
    expect(readTipPayersDay.calls[0]?.args[0].day).toEqual(day)
  })

  function createIndexer(tips: TipPayersDay, now?: () => UnixTime) {
    const payers = mockObject<Database['gasFeesTipPayersDaily']>({
      upsert: mockFn().resolvesTo(undefined),
    })
    const tipHourly = mockObject<Database['gasFeesTipHourly']>({
      getInRange: mockFn().resolvesTo(
        Array.from({ length: 24 }, (_, h) => ({
          timestamp: UnixTime(day + h * UnixTime.HOUR),
          blockNumber: h,
          slowTipGwei: 0,
          mediumTipGwei: 0,
          fastTipGwei: h < 12 ? 0.25 : 0.75,
          ethUsd: h < 12 ? 3000 : 5000,
        })),
      ),
    })
    const readTipPayersDay =
      mockFn<
        (input: TipPayersDayQueryInput) => Promise<TipPayersDay>
      >().resolvesTo(tips)
    const indexer = new GasFeesTipPayersIndexer(
      {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        firstDay: day,
        db: mockDatabase({
          gasFeesTipPayersDaily: payers,
          gasFeesTipHourly: tipHourly,
        }),
        // Block numbers stand in for the timestamps they were looked up for
        blockFinder: {
          getBlockNumberAtOrBefore: mockFn(async (t: UnixTime) => Number(t)),
        },
        readTipPayersDay,
        now,
      },
      Logger.SILENT,
    )
    return { indexer, payers, readTipPayersDay }
  }
})

const TIPS: TipPayersDay = {
  whole: true,
  check: { blocks: UnixTime.DAY, incompleteBlocks: 0, unknownCount: 0 },
  figures: {
    low: { txCount: 600, tipEth: 1 },
    middle: { txCount: 300, tipEth: 2 },
    high: { txCount: 100, tipEth: 3 },
    roundTipTxCount: 50,
    atFastTipEth: 0.5,
    nonOrdinary: { txCount: 10, tipEth: 4 },
  },
}
