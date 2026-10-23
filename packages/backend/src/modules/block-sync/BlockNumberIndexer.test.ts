import { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'
import { BlockNumberIndexer } from './BlockNumberIndexer'

/**
 * Methodology: a fake chain produces block `n` at `GENESIS + n * blockTime`,
 * its tip is the newest block the clock has reached. The search answers with
 * the exact block at or before a timestamp. Fake timers stand in for the wall
 * clock, and every tick advances it by the tick interval first, then checks
 * that the answer is at least the delay old.
 */
const GENESIS = UnixTime(1_700_000_000)
const DELAY = 300
const TICK_SECONDS = 10
const MAX_GAP = 30
const TICKS_WITHIN_DELAY = DELAY / TICK_SECONDS

describe(BlockNumberIndexer.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install({ now: (GENESIS + 1_000_000) * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  describe(BlockNumberIndexer.prototype.tick.name, () => {
    it('searches on a start', async () => {
      const { blockProvider, tick, exact } = setup(time, { blockTime: 2 })

      expect(await tick()).toEqual(exact())
      expect(blockProvider.getBlockHeader).toHaveBeenOnlyCalledWith('latest')
      expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
        UnixTime.now() - DELAY,
        1,
      )
    })

    it('reads one more header per tick until the heads cover the delay', async () => {
      const { blockProvider, tick, lagOf } = setup(time, { blockTime: 2 })
      await tick()
      blockProvider.getBlockHeader.clear()

      for (let i = 0; i < TICKS_WITHIN_DELAY; i++) {
        expect(lagOf(await tick())).toBeLessThanOrEqual(MAX_GAP)
      }

      // The first observed head is a delay ahead of the search, ticks stop
      // reading blocks in between once it is the allowed gap ahead
      expect(blockProvider.getBlockHeader).toHaveBeenCalledTimes(
        2 * TICKS_WITHIN_DELAY - MAX_GAP / TICK_SECONDS,
      )
      expect(blockProvider.getBlockNumberAtOrBefore).toHaveBeenCalledTimes(1)
    })

    it('reads only the latest header once the heads cover the delay', async () => {
      const { blockProvider, tick, ticks, lagOf } = setup(time, {
        blockTime: 2,
      })
      await ticks(TICKS_WITHIN_DELAY + 1)
      blockProvider.getBlockHeader.clear()
      blockProvider.getBlockNumberAtOrBefore.clear()

      for (let i = 0; i < 50; i++) {
        // Heads are observed a tick apart, the answer lags less than that
        expect(lagOf(await tick())).toBeLessThan(TICK_SECONDS)
      }

      expect(blockProvider.getBlockHeader).toHaveBeenCalledTimes(50)
      for (const call of blockProvider.getBlockHeader.calls) {
        expect(call.args).toEqual(['latest'])
      }
      expect(blockProvider.getBlockNumberAtOrBefore).not.toHaveBeenCalled()
    })

    it('catches up after a long gap in observations without a search', async () => {
      const { blockProvider, tick, ticks, lagOf } = setup(time, {
        blockTime: 2,
      })
      await ticks(TICKS_WITHIN_DELAY + 1)
      blockProvider.getBlockNumberAtOrBefore.clear()

      time.tick(3600 * 1000)
      for (let i = 0; i < TICKS_WITHIN_DELAY; i++) {
        expect(lagOf(await tick())).toBeLessThanOrEqual(MAX_GAP)
      }

      expect(blockProvider.getBlockNumberAtOrBefore).not.toHaveBeenCalled()
    })

    it('ignores a latest header older than one already observed', async () => {
      const { blockProvider, tick, ticks, latestBehindBy } = setup(time, {
        blockTime: 2,
      })
      await ticks(TICKS_WITHIN_DELAY + 1)
      let height = await tick()
      blockProvider.getBlockNumberAtOrBefore.clear()

      latestBehindBy(100)
      for (let i = 0; i < 5; i++) {
        const next = await tick()
        expect(next).toBeGreaterThanOrEqual(height)
        height = next
      }

      expect(blockProvider.getBlockNumberAtOrBefore).not.toHaveBeenCalled()
    })

    it('keeps the height when the delayed timestamp moves back', async () => {
      const { indexer, ticks } = setup(time, { blockTime: 2 })
      await ticks(TICKS_WITHIN_DELAY + 1)
      const height = indexer.blockHeight

      time.setSystemTime(Date.now() - 120 * 1000)

      expect(await indexer.tick()).toEqual(height)
    })

    it('answers exactly on a chain with blocks rarer than ticks', async () => {
      const { blockProvider, tick, ticks, exact } = setup(time, {
        blockTime: 60,
      })
      await ticks(TICKS_WITHIN_DELAY + 1)
      blockProvider.getBlockHeader.clear()
      blockProvider.getBlockNumberAtOrBefore.clear()

      for (let i = 0; i < 50; i++) {
        // Every block is observed, the one after the answer is past the delay
        expect(await tick()).toEqual(exact())
      }

      expect(blockProvider.getBlockHeader).toHaveBeenCalledTimes(50)
      expect(blockProvider.getBlockNumberAtOrBefore).not.toHaveBeenCalled()
    })

    it('answers with a tip older than the delay', async () => {
      const { blockProvider, tick, ticks, haltAt } = setup(time, {
        blockTime: 2,
      })
      await ticks(TICKS_WITHIN_DELAY + 1)
      const halted = (await blockProvider.getBlockHeader('latest')).number
      haltAt(halted)
      blockProvider.getBlockNumberAtOrBefore.clear()

      await ticks(TICKS_WITHIN_DELAY)

      expect(await tick()).toEqual(halted)
      expect(blockProvider.getBlockNumberAtOrBefore).not.toHaveBeenCalled()
    })
  })
})

function setup(time: InstalledClock, chain: { blockTime: number }) {
  const { blockTime } = chain
  const numberAt = (timestamp: number) =>
    Math.floor((timestamp - GENESIS) / blockTime)
  const header = (number: number) => ({
    number,
    timestamp: GENESIS + number * blockTime,
  })
  let behindBy = 0
  let haltedAt = Number.POSITIVE_INFINITY

  const blockProvider = mockObject<BlockProvider>({
    chain: 'chain',
    getBlockHeader: async (x) =>
      header(
        x === 'latest'
          ? Math.min(numberAt(UnixTime.now()), haltedAt) - behindBy
          : x,
      ),
    getBlockNumberAtOrBefore: async (timestamp) => numberAt(timestamp),
  })
  const indexer = new BlockNumberIndexer(
    blockProvider,
    'chain',
    Logger.SILENT,
    DELAY,
    { checkIntervalMs: TICK_SECONDS * 1000, maxHeadGapSeconds: MAX_GAP },
  )

  /** The block a search would answer with now. */
  const exact = () => numberAt(UnixTime.now() - DELAY)
  /** How long before the delayed timestamp the block was produced. */
  const lagOf = (height: number) =>
    UnixTime.now() - DELAY - header(height).timestamp

  async function tick() {
    time.tick(TICK_SECONDS * 1000)
    const height = await indexer.tick()
    expect(header(height).timestamp).toBeLessThanOrEqual(UnixTime.now() - DELAY)
    return height
  }

  async function ticks(count: number) {
    for (let i = 0; i < count; i++) {
      await tick()
    }
  }

  return {
    indexer,
    blockProvider,
    tick,
    ticks,
    exact,
    lagOf,
    latestBehindBy: (blocks: number) => {
      behindBy = blocks
    },
    haltAt: (number: number) => {
      haltedAt = number
    },
  }
}
