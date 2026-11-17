import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import range from 'lodash/range'
import { ChainHeadIndexer } from './ChainHeadIndexer'
import { FakeChain, FakeChainBlocks } from './test/FakeChain'

/**
 * Methodology: a fake chain answers for the source and a fake table holds the
 * stored blocks. Block `n` was made `n` seconds after block 0, and block 100
 * a moment ago. Fake timers stand in for the wall clock and hold the
 * scheduled next tick
 */
const CHAIN = 'base'
const NOW = UnixTime.fromDate(new Date('2026-11-17T12:00:00Z'))
const GENESIS = NOW - 100
const KEEP_FOR = 4 * UnixTime.HOUR

describe(ChainHeadIndexer.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install({ now: NOW * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  describe(ChainHeadIndexer.prototype.follow.name, () => {
    it('starts at the latest block when nothing is stored', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN)

      const followed = await head(chain, store).follow()

      expect(followed).toEqual({ height: 100, stored: 1, again: false })
      expect(store.numbers()).toEqual([100])
    })

    it('continues from the stored blocks a batch at a time', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(90)])
      const indexer = head(chain, store, 4)

      expect(await indexer.follow()).toEqual({
        height: 94,
        stored: 4,
        again: true,
      })
      expect(await indexer.follow()).toEqual({
        height: 98,
        stored: 4,
        again: true,
      })
      expect(await indexer.follow()).toEqual({
        height: 100,
        stored: 2,
        again: false,
      })

      expect(store.numbers()).toEqual(range(90, 101))
    })

    it('fetches only the blocks it has not stored yet', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN)
      const indexer = head(chain, store)
      await indexer.follow()

      chain.mine(2)
      await indexer.follow()

      expect(chain.fetched()).toEqual([
        [100, 100],
        [101, 102],
      ])
    })

    it('holds its height while there is no new block', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])

      const followed = await head(chain, store).follow()

      expect(followed).toEqual({ height: 100, stored: 0, again: false })
      expect(chain.fetched()).toEqual([])
    })

    it('starts at the latest block when the chain moved on from blocks too old to keep', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(98),
        chain.block(99),
      ])
      time.setSystemTime((GENESIS + 99 + KEEP_FOR + 1) * 1000)
      chain.mine(50_000)

      const followed = await head(chain, store).follow()

      expect(followed.height).toEqual(50_100)
      expect(store.numbers()).toEqual([50_100])
    })

    it('keeps blocks too old to keep while the chain has not moved on', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      time.setSystemTime((GENESIS + 100 + KEEP_FOR + 1) * 1000)

      const followed = await head(chain, store).follow()

      expect(followed.height).toEqual(100)
      expect(store.numbers()).toEqual([100])
    })

    it('drops to the fork after a reorg and stores what replaced the blocks next', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(97),
        chain.block(98),
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      chain.reorg(99, 101)

      expect(await indexer.follow()).toEqual({
        height: 98,
        stored: 0,
        again: true,
      })
      expect(store.hashes()).toEqual(['0x97', '0x98'])

      expect(await indexer.follow()).toEqual({
        height: 101,
        stored: 3,
        again: false,
      })
      expect(store.hashes()).toEqual([
        '0x97',
        '0x98',
        '0x99-1',
        '0x100-1',
        '0x101-1',
      ])
    })

    it('keeps its blocks when a node serves the next block from another fork', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)
      chain.mine()
      chain.serveFromForkOnce(101)

      expect(await indexer.follow()).toEqual({
        height: 100,
        stored: 0,
        again: false,
      })
      expect(store.hashes()).toEqual(['0x100'])

      expect((await indexer.follow()).height).toEqual(101)
      expect(store.hashes()).toEqual(['0x100', '0x101'])
    })

    it('stores nothing from a batch whose blocks do not link', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      chain.mine(3)
      chain.serveFromForkOnce(102)

      const followed = await head(chain, store).follow()

      expect(followed).toEqual({ height: 100, stored: 0, again: false })
      expect(store.numbers()).toEqual([100])
    })

    it('drops to 0 and restarts at the latest block after a reorg past every remembered block', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      chain.reorg(90, 105)

      expect(await indexer.follow()).toEqual({
        height: 0,
        stored: 0,
        again: true,
      })
      expect(store.numbers()).toEqual([])

      expect((await indexer.follow()).height).toEqual(105)
      expect(store.hashes()).toEqual(['0x105-1'])
    })

    it('tries the delete again next tick when it failed', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      chain.reorg(100, 101)
      store.repository.deleteAfter.rejectsWithOnce(new Error('timeout'))

      await expect(indexer.follow()).toBeRejectedWith('timeout')
      expect(store.hashes()).toEqual(['0x99', '0x100'])

      expect((await indexer.follow()).height).toEqual(99)
      expect(store.hashes()).toEqual(['0x99'])
    })

    it('holds its height when a node behind the load balancer answers for an older head', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      chain.lagOnce(2)

      const followed = await head(chain, store).follow()

      expect(followed).toEqual({ height: 100, stored: 0, again: false })
      expect(store.numbers()).toEqual([100])
    })

    it('waits for a block the answering node has not got yet', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)
      chain.mine()
      chain.failToServeOnce(101)

      expect(await indexer.follow()).toEqual({
        height: 100,
        stored: 0,
        again: false,
      })
      expect((await indexer.follow()).height).toEqual(101)
    })

    it('fails on any other error', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      chain.mine()
      chain.getBlocks.rejectsWithOnce(new Error('rate limited'))

      await expect(head(chain, store).follow()).toBeRejectedWith('rate limited')
    })
  })

  describe(ChainHeadIndexer.prototype.getBlocks.name, () => {
    it('returns the blocks it just stored without asking the source again', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(98)])
      const indexer = head(chain, store)
      await indexer.follow()

      const blocks = await indexer.getBlocks(99, 100)

      expect(blocks).toEqual([chain.block(99), chain.block(100)])
      expect(chain.fetched()).toEqual([[99, 100]])
    })

    it('fetches the blocks it no longer holds', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])

      const blocks = await head(chain, store).getBlocks(99, 100)

      expect(blocks).toEqual([chain.block(99), chain.block(100)])
    })

    it('refuses a block other than the one it stored', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      // the head has not ticked since, so it still holds the replaced block
      chain.reorg(100)

      await expect(indexer.getBlocks(99, 100)).toBeRejectedWith(
        'Source served a block the chain head has not stored',
      )
    })

    it('forgets the blocks a reorg replaced', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(98)])
      const indexer = head(chain, store)
      await indexer.follow()
      chain.reorg(100, 101)
      await indexer.follow()
      await indexer.follow()

      const blocks = await indexer.getBlocks(100, 101)

      expect(blocks.map((b) => b.hash)).toEqual(['0x100-1', '0x101-1'])
    })

    it('refuses a block from before it started, which it cannot check', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])

      await expect(head(chain, store).getBlocks(99, 100)).toBeRejectedWith(
        'Source served a block the chain head has not stored',
      )
    })
  })

  describe(ChainHeadIndexer.prototype.tick.name, () => {
    it('returns the height and ticks again in ten seconds while blocks come', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(99)])

      expect(await head(chain, store).tick()).toEqual(100)

      expect(secondsToNextTick(time)).toEqual(10)
    })

    it('ticks again at once while it is behind', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(90)])

      expect(await head(chain, store, 4).tick()).toEqual(94)

      expect(secondsToNextTick(time)).toEqual(0)
    })

    it('checks a chain with no new blocks less and less often, up to once a minute', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)

      const waits: number[] = []
      for (let i = 0; i < 7; i++) {
        await indexer.tick()
        waits.push(secondsToNextTick(time))
      }

      expect(waits).toEqual([20, 30, 40, 50, 60, 60, 60])
    })

    it('goes back to every ten seconds once a block comes', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)
      await indexer.tick()
      await indexer.tick()
      chain.mine()

      await indexer.tick()

      expect(secondsToNextTick(time)).toEqual(10)
    })

    it('deletes the blocks too old to keep, every ten minutes', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)

      await indexer.tick()
      await indexer.tick()
      time.setSystemTime((NOW + 10 * UnixTime.MINUTE) * 1000)
      await indexer.tick()

      expect(
        store.repository.deleteBefore.calls.map((call) => call.args),
      ).toEqual([
        [CHAIN, NOW - KEEP_FOR],
        [CHAIN, NOW + 10 * UnixTime.MINUTE - KEEP_FOR],
      ])
    })
  })

  describe(ChainHeadIndexer.prototype.keepAtLeast.name, () => {
    it('keeps blocks for the reader that looks furthest back', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)

      indexer.keepAtLeast(25 * UnixTime.HOUR)
      indexer.keepAtLeast(UnixTime.HOUR)
      await indexer.tick()

      expect(store.repository.deleteBefore).toHaveBeenOnlyCalledWith(
        CHAIN,
        NOW - 25 * UnixTime.HOUR,
      )
    })
  })
})

/** Ticked by the tests alone: the tick it schedules for itself does nothing */
class TestedChainHeadIndexer extends ChainHeadIndexer {
  protected override requestTick() {}
}

function head(chain: FakeChain, store: FakeChainBlocks, batchSize = 100) {
  return new TestedChainHeadIndexer(
    { chain: CHAIN, source: chain, db: store.db, batchSize, keepFor: KEEP_FOR },
    Logger.SILENT,
  )
}

function secondsToNextTick(time: InstalledClock) {
  const before = time.now
  time.next()
  return (time.now - before) / 1000
}
