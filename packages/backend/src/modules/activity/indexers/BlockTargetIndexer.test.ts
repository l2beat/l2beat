import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { ActivityConfigProject } from '../../../config/Config'
import type { Clock } from '../../../tools/Clock'
import { BlockTargetIndexer, type FinalizedBlock } from './BlockTargetIndexer'

const LAST_HOUR = UnixTime.now() - 1 * UnixTime.HOUR

describe(BlockTargetIndexer.name, () => {
  describe(BlockTargetIndexer.prototype.start.name, () => {
    it('calls clock.onNewHour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        getLastHour: () => LAST_HOUR,
      })

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().resolvesTo(0),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        mockObject<ActivityConfigProject>({
          id: ProjectId('mock'),
          chainName: 'chain',
        }),
      )

      await indexer.start()

      expect(clock.onNewHour).toHaveBeenCalled()
    })
  })

  describe(BlockTargetIndexer.prototype.tick.name, () => {
    it('returns block number', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().resolvesTo(BLOCK_NUMBER),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        mockObject<ActivityConfigProject>({
          id: ProjectId('mock'),
          chainName: 'chain',
        }),
      )

      const result = await indexer.tick()

      expect(result).toEqual(BLOCK_NUMBER)
      expect(clock.getLastHour).toHaveBeenCalledTimes(1)
      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenNthCalledWith(1, LAST_HOUR, 'chain')
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn()
          .resolvesToOnce(BLOCK_NUMBER)
          .resolvesToOnce(BLOCK_NUMBER - 1),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        mockObject<ActivityConfigProject>({
          id: ProjectId('mock'),
          chainName: 'chain',
        }),
      )

      await indexer.tick()
      await expect(async () => await indexer.tick()).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn()
          .resolvesToOnce(BLOCK_NUMBER)
          .resolvesToOnce(BLOCK_NUMBER - 1),
      })
      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        getMockDb(),
        mockObject<ActivityConfigProject>({
          id: ProjectId('mock'),
          chainName: 'chain',
        }),
      )

      await indexer.tick()
      await expect(async () => await indexer.tick()).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })

    it('throws when first fetched is smaller than last processed before process restart', async () => {
      const clock = mockObject<Clock>({
        getLastHour: () => LAST_HOUR,
        onNewHour: mockFn().returns(null),
      })

      const BLOCK_NUMBER = 123

      const db = mockObject<Database>({
        activity: mockObject<Database['activity']>({
          getLatestProcessedBlock: async () => BLOCK_NUMBER,
        }),
      })

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().resolvesTo(BLOCK_NUMBER - 1),
      })

      const indexer = new BlockTargetIndexer(
        Logger.SILENT,
        clock,
        blockTimestampProvider,
        db,
        mockObject<ActivityConfigProject>({
          id: ProjectId('mock'),
          chainName: 'chain',
        }),
      )

      await expect(async () => await indexer.tick()).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })
  })
})

describe(`${BlockTargetIndexer.name} following the finalized block`, () => {
  // Methodology: the clock's last hour and the RPC's finalized block are both
  // mocked, so each test sets how far finality lags behind the hourly target
  const NOON = UnixTime.fromDate(new Date('2026-11-05T12:00:00Z'))
  const MINUTE = UnixTime.MINUTE

  it('ticks every minute instead of every hour', async () => {
    const clock = mockObject<Clock>({
      every: mockFn().returns(() => {}),
      getLastHour: () => NOON,
    })
    const indexer = createFinalizedIndexer(clock, [block(100, NOON)])

    await indexer.start()

    expect(clock.every).toHaveBeenOnlyCalledWith(
      UnixTime.MINUTE * 1000,
      expect.anything(),
    )
  })

  it('targets the last hour while finality keeps up, at the finalized block', async () => {
    const onTick = mockFn().resolvesTo(undefined)
    const indexer = createFinalizedIndexer(
      mockObject<Clock>({ getLastHour: () => NOON }),
      [block(100, NOON + 1 * UnixTime.HOUR + 47 * MINUTE)],
      onTick,
    )

    const result = await indexer.tick()

    expect(result).toEqual(100)
    expect(onTick).toHaveBeenOnlyCalledWith(NOON, 100)
  })

  it('holds the target at the hour of the finalized block when finality stalls', async () => {
    // L2 charts wait for Ethereum, so they hold too: accepted on purpose
    const onTick = mockFn().resolvesTo(undefined)
    const indexer = createFinalizedIndexer(
      mockObject<Clock>({ getLastHour: () => NOON }),
      [block(100, NOON - 90 * MINUTE)],
      onTick,
    )

    await indexer.tick()

    expect(onTick).toHaveBeenOnlyCalledWith(NOON - 2 * UnixTime.HOUR, 100)
  })

  it('keeps the highest finalized block when a lagging RPC returns an older one', async () => {
    const onTick = mockFn().resolvesTo(undefined)
    const indexer = createFinalizedIndexer(
      mockObject<Clock>({ getLastHour: () => NOON }),
      [block(100, NOON - 30 * MINUTE), block(90, NOON - 58 * MINUTE)],
      onTick,
    )

    await indexer.tick()
    const result = await indexer.tick()

    expect(result).toEqual(100)
    expect(onTick).toHaveBeenLastCalledWith(NOON - 1 * UnixTime.HOUR, 100)
  })

  it('throws when the first finalized block is below the one processed before a restart', async () => {
    const db = mockObject<Database>({
      activity: mockObject<Database['activity']>({
        getLatestProcessedBlock: async () => 100,
      }),
    })
    const indexer = createFinalizedIndexer(
      mockObject<Clock>({ getLastHour: () => NOON }),
      [block(99, NOON)],
      undefined,
      db,
    )

    await expect(indexer.tick()).toBeRejectedWith(
      'Block number cannot be smaller',
    )
  })

  function createFinalizedIndexer(
    clock: Clock,
    blocks: FinalizedBlock[],
    onTick?: (targetTimestamp: number, blockNumber: number) => Promise<void>,
    db = getMockDb(),
  ) {
    const getFinalizedBlock = mockFn<() => Promise<FinalizedBlock>>()
    for (const b of blocks) {
      getFinalizedBlock.resolvesToOnce(b)
    }
    return new BlockTargetIndexer(
      Logger.SILENT,
      clock,
      mockObject<BlockTimestampProvider>({}),
      db,
      mockObject<ActivityConfigProject>({
        id: ProjectId('ethereum'),
        chainName: 'ethereum',
      }),
      { onTick, getFinalizedBlock },
    )
  }

  function block(number: number, timestamp: UnixTime): FinalizedBlock {
    return { number, timestamp }
  }
})

function getMockDb() {
  return mockObject<Database>({
    activity: mockObject<Database['activity']>({
      getLatestProcessedBlock: async () => undefined,
    }),
  })
}
