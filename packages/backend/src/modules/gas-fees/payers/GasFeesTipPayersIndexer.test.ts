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

  it("prices the day's tips at the mean of our hourly ETH/USD reads", async () => {
    const { indexer, payers, readTipPayersDay } = createIndexer(TIPS)

    expect(await indexer.update(next, day + 3 * UnixTime.DAY)).toEqual(next)
    expect(readTipPayersDay.calls[0]?.args[0].fastTipWei).toEqual(500_000_000n)
    expect(payers.upsert).toHaveBeenOnlyCalledWith({
      timestamp: day,
      ethUsd: 4000,
      fastTipGwei: 0.5,
      low: { txCount: 600, tipEth: 1, tipUsd: 4000 },
      middle: { txCount: 300, tipEth: 2, tipUsd: 8000 },
      high: { txCount: 100, tipEth: 3, tipUsd: 12000 },
      roundTipTxCount: 50,
      atFastTipEth: 0.5,
      atFastTipUsd: 2000,
      nonOrdinary: { txCount: 10, tipEth: 4, tipUsd: 16000 },
    })
  })

  it('fails on a day Dune is missing blocks of, reading it again after 6 hours at most', async () => {
    let now = next
    const { indexer, payers, readTipPayersDay } = createIndexer(
      { ...TIPS, incomplete_blocks: 3 },
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
  // A block a second, as block numbers stand in for timestamps
  blocks: UnixTime.DAY,
  incomplete_blocks: 0,
  low_count: 600,
  low_tip_eth: 1,
  middle_count: 300,
  middle_tip_eth: 2,
  high_count: 100,
  high_tip_eth: 3,
  round_tip_count: 50,
  at_fast_tip_eth: 0.5,
  non_ordinary_count: 10,
  non_ordinary_tip_eth: 4,
  unknown_count: 0,
}
