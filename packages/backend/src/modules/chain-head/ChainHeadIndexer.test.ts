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

    it('fetches headers only while no reader reads whole blocks', async () => {
      const chain = new FakeChain(102, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])

      const followed = await headOfHeaders(chain, store).follow()

      expect(followed).toEqual({ height: 102, stored: 2, again: false })
      expect(store.hashes()).toEqual(['0x100', '0x101', '0x102'])
      expect(chain.getHeaders).toHaveBeenOnlyCalledWith(101, 102)
      expect(chain.getBlocks).not.toHaveBeenCalled()
    })

    it("stores each block's logs bloom, except where it is of the logs of other blocks", async () => {
      const chain = new FakeChain(102, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      chain.getBlocks.resolvesToOnce([
        { ...chain.block(101), logsBloom: '0xbloom' },
        // as on a chain that executes blocks after it has ordered them
        { ...chain.block(102), logsBloom: '0xbloom', settledHeight: 100 },
      ])

      await head(chain, store).follow()

      expect(store.rows.slice(1).map((row) => row.logsBloom)).toEqual([
        '0xbloom',
        null,
      ])
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

    it('drops to the fork when a block of the same height replaced its tip', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(98),
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      chain.reorg(100)

      expect(await indexer.follow()).toEqual({
        height: 99,
        stored: 0,
        again: true,
      })
      expect(store.hashes()).toEqual(['0x98', '0x99'])

      expect(await indexer.follow()).toEqual({
        height: 100,
        stored: 1,
        again: false,
      })
      expect(store.hashes()).toEqual(['0x98', '0x99', '0x100-1'])
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

    it('finds the fork among the older stored blocks after a reorg past the remembered ones', async () => {
      const chain = new FakeChain(300, GENESIS)
      const store = new FakeChainBlocks(
        CHAIN,
        range(100, 301).map((number) => chain.block(number)),
      )
      const indexer = head(chain, store)
      chain.reorg(150, 305)

      expect(await indexer.follow()).toEqual({
        height: 149,
        stored: 0,
        again: true,
      })
      expect(store.numbers()).toEqual(range(100, 150))
      // every remembered block, then the older ones by halving
      expect(chain.getBlockHash.calls.length).toBeLessThan(64 + 12)

      expect(await indexer.follow()).toEqual({
        height: 249,
        stored: 100,
        again: true,
      })
      expect(store.hashes().slice(49, 51)).toEqual(['0x149', '0x150-1'])
    })

    it('deletes nothing when the source disagrees with itself about where the chain forked', async () => {
      const chain = new FakeChain(300, GENESIS)
      const store = new FakeChainBlocks(
        CHAIN,
        range(100, 301).map((number) => chain.block(number)),
      )
      const indexer = head(chain, store)
      chain.reorg(150, 305)
      // the chain still has block 149, but one node says otherwise
      chain.answerHashFromForkOnce(149)

      await expect(indexer.follow()).toBeRejectedWith(
        'Source disagreed with itself about where the chain forked',
      )
      expect(store.numbers()).toEqual(range(100, 301))

      expect((await indexer.follow()).height).toEqual(149)
      expect(store.numbers()).toEqual(range(100, 150))
    })

    it('deletes nothing either when it is a shallow fork the source disagrees with itself about', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(98),
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      chain.reorg(100, 101)
      // the chain still has block 99, but one node says otherwise
      chain.answerHashFromForkOnce(99)

      await expect(indexer.follow()).toBeRejectedWith(
        'Source disagreed with itself about where the chain forked',
      )
      expect(store.hashes()).toEqual(['0x98', '0x99', '0x100'])

      expect((await indexer.follow()).height).toEqual(99)
    })

    it('drops to 0 and restarts at the latest block after a reorg past every stored block', async () => {
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

    it('records the time whenever the source has no block newer than the stored ones', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(98)])
      const indexer = head(chain, store, 1)

      // behind: block 99 stored, block 100 waiting
      await indexer.follow()
      expect(store.confirmed).toEqual(undefined)

      await indexer.follow()
      expect(store.confirmed).toEqual({
        chain: CHAIN,
        number: 100,
        confirmedAt: NOW,
      })

      time.setSystemTime((NOW + 30) * 1000)
      await indexer.follow()
      expect(store.confirmed?.confirmedAt).toEqual(NOW + 30)
    })

    it('records nothing when a node that is behind answers', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      chain.lagOnce(2)

      await head(chain, store).follow()

      expect(store.confirmed).toEqual(undefined)
    })

    it('holds its height when a node behind the load balancer answers for an older head', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      chain.lagOnce(2)

      const followed = await head(chain, store).follow()

      expect(followed).toEqual({ height: 100, stored: 0, again: false })
      expect(store.numbers()).toEqual([100])
    })

    it('drops to the fork when the chain went over to a shorter one', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(98),
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      // block 99 was replaced, and nothing has been built on it yet
      chain.reorg(99, 99)

      expect(await indexer.follow()).toEqual({
        height: 98,
        stored: 0,
        again: true,
      })
      expect(store.hashes()).toEqual(['0x98'])

      expect((await indexer.follow()).height).toEqual(99)
      expect(store.hashes()).toEqual(['0x98', '0x99-1'])
    })

    it('finds the fork of a shorter chain among the older stored blocks too', async () => {
      const chain = new FakeChain(300, GENESIS)
      const store = new FakeChainBlocks(
        CHAIN,
        range(100, 301).map((number) => chain.block(number)),
      )
      const indexer = head(chain, store)
      // the chain now ends at block 200, below every block the head remembers
      chain.reorg(150, 200)

      expect((await indexer.follow()).height).toEqual(149)
      expect(store.numbers()).toEqual(range(100, 150))
    })

    it('deletes nothing when a node that is behind first answers from another fork, then for the stored block', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(98),
        chain.block(99),
        chain.block(100),
      ])
      chain.lagOnce(1)
      chain.answerHashFromForkOnce(99)

      const followed = await head(chain, store).follow()

      expect(followed).toEqual({ height: 100, stored: 0, again: false })
      expect(store.numbers()).toEqual([98, 99, 100])
    })

    it('holds its height when a node that is behind answers, and is on the same chain', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(98),
        chain.block(99),
        chain.block(100),
      ])
      chain.lagOnce(1)

      const followed = await head(chain, store).follow()

      expect(followed).toEqual({ height: 100, stored: 0, again: false })
      expect(store.numbers()).toEqual([98, 99, 100])
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

    it('keeps asking every ten seconds through the gaps a chain usually has between blocks', async () => {
      // blocks twelve seconds apart, as Ethereum's are
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      store.rows[0].timestamp = store.rows[1].timestamp - 12
      const indexer = head(chain, store)

      const waits: number[] = []
      for (let i = 0; i < 6; i++) {
        await indexer.tick()
        waits.push(secondsToNextTick(time))
      }

      expect(waits).toEqual([10, 10, 10, 10, 20, 30])
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

    it('still drops to the fork after a tick that failed to delete old blocks', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(98),
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      chain.reorg(99, 101)
      store.repository.deleteBefore.rejectsWithOnce(new Error('timeout'))

      await expect(indexer.tick()).toBeRejectedWith('timeout')

      expect(await indexer.tick()).toEqual(98)
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

  describe(ChainHeadIndexer.prototype.readLogs.name, () => {
    const POOL = '0xpool'
    const TOKEN = '0xtoken'
    const [DEPOSIT, WITHDRAWAL, TRANSFER] = [
      '0xdeposit',
      '0xwithdrawal',
      '0xtransfer',
    ]

    it('returns the logs of the stored blocks in the order of the chain, with the time of their block', async () => {
      const chain = new FakeChain(100, GENESIS)
      chain.emit(99, { address: POOL, topics: ['0xa'], data: '0x' })
      chain.emit(100, { address: POOL, topics: ['0xb'], data: '0x' })
      chain.emit(100, { address: POOL, topics: ['0xc'], data: '0x' })
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      const read = readerOf(head(chain, store), store, {
        addresses: [POOL],
        topics: [],
      })

      const logs = await read(99, 100)

      expect(
        logs.map((log) => [log.blockNumber, log.topics[0], log.blockTimestamp]),
      ).toEqual([
        [99, '0xa', GENESIS + 99],
        [100, '0xb', GENESIS + 100],
        [100, '0xc', GENESIS + 100],
      ])
    })

    it('asks once per block for all the readers that filter the same topic positions, and gives each only its logs', async () => {
      const chain = new FakeChain(100, GENESIS)
      chain.emit(100, { address: POOL, topics: [DEPOSIT], data: '0x' })
      chain.emit(100, { address: POOL, topics: [WITHDRAWAL], data: '0x' })
      chain.emit(100, { address: TOKEN, topics: [DEPOSIT], data: '0x' })
      chain.emit(100, {
        address: TOKEN,
        topics: [TRANSFER, '0xa', POOL],
        data: '0x',
      })
      chain.emit(100, {
        address: TOKEN,
        topics: [TRANSFER, '0xa', '0xb'],
        data: '0x',
      })
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      const indexer = head(chain, store)
      const deposits = readerOf(indexer, store, {
        addresses: [POOL],
        topics: [[DEPOSIT]],
      })
      const withdrawals = readerOf(indexer, store, {
        addresses: [POOL],
        topics: [WITHDRAWAL, null],
      })
      const transfers = readerOf(indexer, store, {
        addresses: [TOKEN],
        topics: [[TRANSFER], null, [POOL]],
      })

      const read = await Promise.all([
        deposits(99, 100),
        withdrawals(99, 100),
        transfers(99, 100),
        deposits(100, 100),
      ])

      expect(read.map((logs) => logs.map((log) => log.logIndex))).toEqual([
        [0],
        [1],
        [3],
        [0],
      ])
      // two blocks, each asked about once for either kind of filter
      expect(chain.getLogs.calls.map((call) => call.args)).toEqualUnsorted([
        [chain.hashOf(99), [POOL], [[DEPOSIT, WITHDRAWAL]]],
        [chain.hashOf(100), [POOL], [[DEPOSIT, WITHDRAWAL]]],
        [chain.hashOf(99), [TOKEN], [[TRANSFER], null, [POOL]]],
        [chain.hashOf(100), [TOKEN], [[TRANSFER], null, [POOL]]],
      ])
    })

    it('holds back only the readers that share a filter the source refuses', async () => {
      const chain = new FakeChain(100, GENESIS)
      chain.emit(100, { address: POOL, topics: [DEPOSIT], data: '0x' })
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)
      const deposits = readerOf(indexer, store, {
        addresses: [POOL],
        topics: [[DEPOSIT]],
      })
      const transfers = readerOf(indexer, store, {
        addresses: [TOKEN],
        topics: [[TRANSFER], null, [POOL]],
      })
      chain.refuseLogsOf(TOKEN)

      await expect(transfers(100, 100)).toBeRejectedWith('Filter refused')
      expect((await deposits(100, 100)).length).toEqual(1)
    })

    it('takes no need once logs were read, as they were fetched without it', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [chain.block(100)])
      const indexer = head(chain, store)
      await readerOf(indexer, store, { addresses: [POOL], topics: [] })(
        100,
        100,
      )

      expect(() =>
        readerOf(indexer, store, { addresses: [TOKEN], topics: [] }),
      ).toThrow('Logs to read were named after the first were read')
    })

    it('takes no need without an address, which would ask for the logs of every address', () => {
      const chain = new FakeChain(100, GENESIS)
      const indexer = head(chain, new FakeChainBlocks(CHAIN))

      expect(() =>
        indexer.readLogs({ addresses: [], topics: [[TRANSFER]] }),
      ).toThrow('A reader named no address to read the logs of')
    })

    it('asks again only for the block whose logs were not served', async () => {
      const chain = new FakeChain(100, GENESIS)
      chain.emit(100, { address: POOL, topics: [DEPOSIT], data: '0x' })
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      const read = readerOf(head(chain, store), store, {
        addresses: [POOL],
        topics: [],
      })
      chain.failToServeLogsOnce(100)

      await expect(read(99, 100)).toBeRejectedWith('Unknown block')
      expect((await read(99, 100)).length).toEqual(1)

      expect(chain.getLogs.calls.map((call) => call.args[0])).toEqual([
        chain.hashOf(99),
        chain.hashOf(100),
        chain.hashOf(100),
      ])
    })

    describe('blocks a few minutes old', () => {
      // block 1000 was made now, so block 600 four hundred seconds ago
      const OLD_GENESIS = NOW - 1000

      it('are read in one request for the range, and the newest ones still by hash', async () => {
        const chain = new FakeChain(1000, OLD_GENESIS)
        chain.emit(698, { address: POOL, topics: [DEPOSIT], data: '0x' })
        chain.emit(699, { address: POOL, topics: [WITHDRAWAL], data: '0x' })
        chain.emit(701, { address: POOL, topics: [DEPOSIT], data: '0x' })
        const store = new FakeChainBlocks(
          CHAIN,
          range(697, 702).map((number) => chain.block(number)),
        )
        const read = readerOf(head(chain, store), store, {
          addresses: [POOL],
          topics: [[DEPOSIT]],
        })

        const logs = await read(697, 701)

        expect(
          logs.map((log) => [log.blockNumber, log.blockTimestamp]),
        ).toEqual([
          [698, OLD_GENESIS + 698],
          [701, OLD_GENESIS + 701],
        ])
        // blocks 697 to 699 are over five minutes old
        expect(chain.getLogsInRange).toHaveBeenOnlyCalledWith(
          697,
          699,
          [POOL],
          [[DEPOSIT]],
        )
        expect(chain.getLogs.calls.map((call) => call.args[0])).toEqual([
          chain.hashOf(700),
          chain.hashOf(701),
        ])
      })

      it('are refused when the range answers with a log of another block than the one stored', async () => {
        const chain = new FakeChain(1000, OLD_GENESIS)
        const store = new FakeChainBlocks(
          CHAIN,
          range(598, 601).map((number) => chain.block(number)),
        )
        const read = readerOf(head(chain, store), store, {
          addresses: [POOL],
          topics: [],
        })
        // the head has not ticked since, so it still holds the replaced block
        chain.reorg(600)
        chain.emit(600, { address: POOL, topics: [DEPOSIT], data: '0x' })

        await expect(read(598, 600)).toBeRejectedWith(
          'Source served logs of another block',
        )
      })
    })

    describe('on a chain that fills logs blooms in', () => {
      const POOL_ = '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'
      const OTHER = '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
      const DEPOSIT_ = `0x${'d'.repeat(64)}`
      const USER = `0x${'a'.repeat(64)}`

      function chainWithBlooms(genesis = GENESIS) {
        const chain = new FakeChain(1000, genesis)
        chain.fillsBlooms = true
        return chain
      }

      it('asks nothing about a block whose bloom rules the logs out, or that has no logs', async () => {
        const chain = chainWithBlooms()
        chain.emit(997, { address: POOL_, topics: [DEPOSIT_], data: '0x' })
        chain.emit(998, { address: OTHER, topics: [DEPOSIT_], data: '0x' })
        chain.emit(1000, { address: POOL_, topics: [USER], data: '0x' })
        const store = new FakeChainBlocks(
          CHAIN,
          range(997, 1001).map((number) => chain.block(number)),
        )
        const read = readerOf(head(chain, store), store, {
          addresses: [POOL_],
          topics: [[DEPOSIT_]],
        })

        const logs = await read(997, 1000)

        expect(logs.map((log) => log.blockNumber)).toEqual([997])
        // 998 has another address, 999 no logs, 1000 another topic
        expect(chain.getLogs.calls.map((call) => call.args[0])).toEqual([
          chain.hashOf(997),
        ])
      })

      it('asks about blocks a few minutes old by hash as well, and never by range', async () => {
        // block 1000 was made now, so these over five minutes ago
        const chain = chainWithBlooms(NOW - 1000)
        chain.emit(598, { address: POOL_, topics: [DEPOSIT_], data: '0x' })
        chain.emit(600, { address: OTHER, topics: [DEPOSIT_], data: '0x' })
        const store = new FakeChainBlocks(
          CHAIN,
          range(598, 601).map((number) => chain.block(number)),
        )
        const read = readerOf(head(chain, store), store, {
          addresses: [POOL_],
          topics: [],
        })

        const logs = await read(598, 600)

        expect(logs.map((log) => log.blockNumber)).toEqual([598])
        expect(chain.getLogsInRange).not.toHaveBeenCalled()
        expect(chain.getLogs.calls.map((call) => call.args[0])).toEqual([
          chain.hashOf(598),
        ])
      })

      it('asks about every block again once a log comes back that its bloom does not have', async () => {
        const chain = chainWithBlooms()
        chain.emit(999, { address: OTHER, topics: [DEPOSIT_], data: '0x' })
        chain.emit(1000, { address: POOL_, topics: [DEPOSIT_], data: '0x' })
        const blocks = [chain.block(999), chain.block(1000)]
        // the node then serves block 1000 with a log its bloom was not made of
        chain.emit(1000, { address: POOL_, topics: [USER], data: '0x' })
        const store = new FakeChainBlocks(CHAIN, blocks)
        const read = readerOf(head(chain, store), store, {
          addresses: [POOL_],
          topics: [],
        })

        await read(1000, 1000)
        await read(999, 999)

        expect(chain.getLogs.calls.map((call) => call.args[0])).toEqual([
          chain.hashOf(1000),
          // ruled out by its bloom, which is no longer believed
          chain.hashOf(999),
        ])
      })
    })

    it('fails for a stored block the chain replaced, and does not return the logs of its replacement', async () => {
      const chain = new FakeChain(100, GENESIS)
      const store = new FakeChainBlocks(CHAIN, [
        chain.block(99),
        chain.block(100),
      ])
      const read = readerOf(head(chain, store), store, {
        addresses: [POOL],
        topics: [],
      })
      // the head has not ticked since, so it still holds the replaced block
      chain.reorg(100)
      chain.emit(100, { address: POOL, topics: ['0xa'], data: '0x' })

      await expect(read(99, 100)).toBeRejectedWith('Unknown block')
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

/** Reads the logs of the stored blocks with the numbers, both ends included, as a reader of the head does */
function readerOf(
  indexer: ChainHeadIndexer,
  store: FakeChainBlocks,
  need: Parameters<ChainHeadIndexer['readLogs']>[0],
) {
  const read = indexer.readLogs(need)
  return (from: number, to: number) =>
    read(store.rows.filter((row) => row.number >= from && row.number <= to))
}

/** A head with a reader of whole blocks, as live activity is */
function head(chain: FakeChain, store: FakeChainBlocks, batchSize = 100) {
  const indexer = headOfHeaders(chain, store, batchSize)
  indexer.fetchFullBlocks()
  return indexer
}

function headOfHeaders(
  chain: FakeChain,
  store: FakeChainBlocks,
  batchSize = 100,
) {
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
