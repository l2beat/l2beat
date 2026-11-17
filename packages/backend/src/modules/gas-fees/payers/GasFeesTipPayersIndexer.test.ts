import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { GasFeesTipPayersIndexer } from './GasFeesTipPayersIndexer'
import type { TipPayersDay } from './readTipPayersDay'

describe(GasFeesTipPayersIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const day = UnixTime.fromDate(new Date('2026-11-10T00:00:00Z'))

  it("prices the day's tips at the mean of our hourly ETH/USD reads", async () => {
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
    const readTipPayersDay = mockFn().resolvesTo(TIPS)
    const indexer = new GasFeesTipPayersIndexer(
      {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        firstDay: day,
        db: mockDatabase({
          gasFeesTipPayersDaily: payers,
          gasFeesTipHourly: tipHourly,
        }),
        blockFinder: {
          getBlockNumberAtOrBefore: mockFn(async (t: UnixTime) => Number(t)),
        },
        readTipPayersDay,
      },
      Logger.SILENT,
    )

    expect(
      await indexer.update(day + UnixTime.DAY, day + 3 * UnixTime.DAY),
    ).toEqual(day + UnixTime.DAY)
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
})

const TIPS: TipPayersDay = {
  blocks: 7200,
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
