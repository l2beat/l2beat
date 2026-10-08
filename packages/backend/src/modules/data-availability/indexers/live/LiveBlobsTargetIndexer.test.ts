import { Logger } from '@l2beat/backend-tools'
import type { Database, LiveBlockRecord } from '@l2beat/database'
import type { IRpcClient } from '@l2beat/shared'
import { slotStart, UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { LiveBlobsTargetIndexer } from './LiveBlobsTargetIndexer'

/**
 * Methodology: a fake chain answers the RPC and a fake table holds the stored
 * blocks. Block `n` sits in slot `n + SLOT_OFFSET`, and a chain that forked
 * after block `f` has different hashes for the blocks above `f`, each block
 * pointing at the hash of the one before it on its own chain. Fake timers
 * stand in for the wall clock and hold the scheduled next tick
 */
const HEAD = 20_000_100

describe(LiveBlobsTargetIndexer.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  describe(LiveBlobsTargetIndexer.prototype.tick.name, () => {
    it('follows the head when nothing is stored yet', async () => {
      const { indexer } = setup(time, { head: HEAD, stored: [] })

      expect(await indexer.tick()).toEqual(HEAD)
      // The next block is due when the next slot starts, a second after that
      // it has reached the RPC
      expect(secondsToNextTick(time)).toEqual(12)
    })

    it('schedules the next tick to the fraction of a second', async () => {
      const { indexer } = setup(time, {
        head: HEAD,
        stored: [],
        now: slotStart(slotOf(HEAD)) + 1.5,
      })

      await indexer.tick()

      expect(secondsToNextTick(time)).toEqual(11.5)
    })

    it('follows a head built on the newest stored block', async () => {
      const { indexer, rpc, liveBlock } = setup(time, {
        head: HEAD,
        stored: storedRange(HEAD - 10, HEAD - 1),
      })

      expect(await indexer.tick()).toEqual(HEAD)
      // The head's parent hash says it all, no block is fetched to compare
      // getBlock is overloaded, earl picks the includeTxs: true signature
      expect(rpc.getBlock).toHaveBeenOnlyCalledWith(
        'latest',
        false as unknown as true,
      )
      // Nor read: the newest stored block is the one compared
      expect(liveBlock.findHead).toHaveBeenCalledTimes(1)
      expect(liveBlock.getByBlockNumberRange).not.toHaveBeenCalled()
    })

    it('checks the newest stored block while the backfill is behind', async () => {
      const { indexer, rpc } = setup(time, {
        head: HEAD,
        stored: storedRange(HEAD - 20, HEAD - 10),
      })

      expect(await indexer.tick()).toEqual(HEAD)
      expect(rpc.getBlock).toHaveBeenNthCalledWith(
        2,
        HEAD - 10,
        false as unknown as true,
      )
    })

    it('ignores a lower head from a lagging RPC', async () => {
      const chain = { head: HEAD, forkedAfter: undefined }
      const { indexer } = setup(time, {
        chain,
        stored: [],
        now: slotStart(slotOf(HEAD)) + 1,
      })
      await indexer.tick()

      chain.head = HEAD - 2
      expect(await indexer.tick()).toEqual(HEAD)
      // A stale answer says nothing of the slot under way: ask again soon
      expect(secondsToNextTick(time)).toEqual(0.25)
    })

    it('ignores a head lower than the newest stored block after a restart', async () => {
      const { indexer } = setup(time, {
        head: HEAD - 2,
        stored: storedRange(HEAD - 10, HEAD),
      })

      // Reporting HEAD - 2 would make the child drop two good blocks
      expect(await indexer.tick()).toEqual(HEAD)
    })

    it('returns the fork height when the chain moved off the stored blocks', async () => {
      const { indexer } = setup(time, {
        head: HEAD + 1,
        forkedAfter: HEAD - 3,
        stored: storedRange(HEAD - 10, HEAD),
      })

      expect(await indexer.tick()).toEqual(HEAD - 3)
      // The child drops the blocks above the fork, then the head is followed
      // again without waiting for the next slot. Not at once: until the child
      // is done, every tick would find the same fork
      expect(secondsToNextTick(time)).toEqual(0.25)
    })

    it('returns the fork height when a block of the same height replaced the head', async () => {
      const { indexer, rpc } = setup(time, {
        head: HEAD,
        forkedAfter: HEAD - 1,
        stored: storedRange(HEAD - 10, HEAD),
      })

      // The stored head is orphaned now: waiting for the next block would
      // show it for another slot
      expect(await indexer.tick()).toEqual(HEAD - 1)
      // The head's own hash gives it away, the parent is fetched to confirm
      expect(rpc.getBlock).toHaveBeenCalledTimes(2)
    })

    it('follows the head again after reporting a fork', async () => {
      const { indexer } = setup(time, {
        head: HEAD + 1,
        forkedAfter: HEAD - 3,
        // The child already dropped the blocks above the fork
        stored: storedRange(HEAD - 10, HEAD - 3),
      })

      expect(await indexer.tick()).toEqual(HEAD + 1)
    })

    it('refetches the whole window when the fork is deeper than 32 blocks', async () => {
      const { indexer } = setup(time, {
        head: HEAD + 1,
        forkedAfter: HEAD - 40,
        stored: storedRange(HEAD - 100, HEAD),
      })

      expect(await indexer.tick()).toEqual(0)
    })

    it('keeps asking every quarter second while the slot has no block yet', async () => {
      const { indexer } = setup(time, {
        head: HEAD,
        stored: [],
        // Two seconds into the slot after the head's
        now: slotStart(slotOf(HEAD) + 1) + 2,
      })

      await indexer.tick()

      expect(secondsToNextTick(time)).toEqual(0.25)
    })

    it('logs the head once per new head or new slot', async () => {
      const info = mockFn().returns(undefined)
      const logger: Logger = mockObject<Logger>({
        info,
        tag: () => logger,
        for: () => logger,
      })
      const start = slotStart(slotOf(HEAD)) + 1.5
      const { indexer } = setup(time, {
        head: HEAD,
        stored: [],
        now: start,
        logger,
      })

      // Moving the clock without running the timers keeps the scheduled
      // ticks, and their logs, out of it
      await indexer.tick()
      time.setSystemTime((start + 0.25) * 1000)
      await indexer.tick()
      time.setSystemTime((start + 12.25) * 1000)
      await indexer.tick()

      expect(info).toHaveBeenCalledTimes(2)
      expect(info).toHaveBeenNthCalledWith(1, 'Live head', {
        head: slotOf(HEAD),
        blockNumber: HEAD,
        lagSlots: 0,
        delaySeconds: 1.5,
      })
      expect(info).toHaveBeenNthCalledWith(2, 'Live head', {
        head: slotOf(HEAD),
        blockNumber: HEAD,
        lagSlots: 1,
        delaySeconds: 13.75,
      })
    })
  })
})

const SLOT_OFFSET = -8_000_000

function slotOf(blockNumber: number) {
  return blockNumber + SLOT_OFFSET
}

function hashOf(blockNumber: number, forkedAfter: number | undefined) {
  const fork = forkedAfter !== undefined && blockNumber > forkedAfter
  return `0x${fork ? 'b' : 'a'}${blockNumber}`
}

function chainBlock(blockNumber: number, forkedAfter: number | undefined) {
  return {
    number: blockNumber,
    hash: hashOf(blockNumber, forkedAfter),
    parentHash: hashOf(blockNumber - 1, forkedAfter),
    timestamp: slotStart(slotOf(blockNumber)),
    logsBloom: '0x',
  }
}

function storedRange(from: number, to: number): LiveBlockRecord[] {
  const blocks: LiveBlockRecord[] = []
  for (let n = from; n <= to; n++) {
    blocks.push({
      slot: slotOf(n),
      blockNumber: n,
      hash: hashOf(n, undefined),
      timestamp: UnixTime(slotStart(slotOf(n))),
      blobCount: 0,
    })
  }
  return blocks
}

/** Runs the clock to the scheduled tick, which then starts */
function secondsToNextTick(time: InstalledClock) {
  const before = time.now
  time.next()
  return (time.now - before) / 1000
}

function setup(
  time: InstalledClock,
  options: {
    head?: number
    forkedAfter?: number
    chain?: { head: number; forkedAfter: number | undefined }
    stored: LiveBlockRecord[]
    /** Unix seconds */
    now?: number
    logger?: Logger
  },
) {
  const chain = options.chain ?? {
    head: options.head ?? HEAD,
    forkedAfter: options.forkedAfter,
  }
  const rpc = mockObject<IRpcClient>({
    getBlock: mockFn(async (blockNumber: number | 'latest') =>
      chainBlock(
        blockNumber === 'latest' ? chain.head : blockNumber,
        chain.forkedAfter,
      ),
    ) as unknown as IRpcClient['getBlock'],
  })
  const stored = options.stored
  const liveBlock = mockObject<Database['liveBlock']>({
    findHead: async () => stored.at(-1),
    getByBlockNumberRange: async (from: number, to: number) =>
      stored.filter((b) => from <= b.blockNumber && b.blockNumber <= to),
  })
  const db = mockObject<Database>({ liveBlock })
  // A second into the head's slot, when its block has just landed
  const now = options.now ?? slotStart(slotOf(chain.head)) + 1
  time.setSystemTime(now * 1000)
  const indexer = new LiveBlobsTargetIndexer(
    { rpc, db },
    options.logger ?? Logger.SILENT,
  )
  return { indexer, rpc, liveBlock }
}
