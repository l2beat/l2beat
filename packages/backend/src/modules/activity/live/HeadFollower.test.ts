import { Logger } from '@l2beat/backend-tools'
import type { Database, LiveActivityBlockRecord } from '@l2beat/database'
import { NotFoundOnRpcError } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import range from 'lodash/range'
import { mockDatabase } from '../../../test/database'
import { HeadFollower, type LinkedBlock } from './HeadFollower'
import { LIVE_BLOCKS_KEPT_FOR } from './LiveActivityCleaner'

const PROJECT = ProjectId('base')
const GENESIS = UnixTime.now() - UnixTime.HOUR

describe(HeadFollower.name, () => {
  describe(HeadFollower.prototype.follow.name, () => {
    it('starts at the latest block when nothing is stored', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore()

      expect(await follower(chain, store).follow()).toEqual(1)

      expect(store.numbers()).toEqual([100])
    })

    it('continues from the stored blocks in batches', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore([chain.block(90)])

      await follower(chain, store, 4).follow()

      expect(store.numbers()).toEqual(range(90, 101))
      expect(chain.fetched()).toEqual([
        [91, 94],
        [95, 98],
        [99, 100],
      ])
    })

    it('fetches only the blocks it has not stored yet', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore()
      const head = follower(chain, store)
      await head.follow()

      chain.latest = 102
      expect(await head.follow()).toEqual(2)

      expect(chain.fetched()).toEqual([
        [100, 100],
        [101, 102],
      ])
    })

    it('starts at the latest block when the stored ones are about to be cleaned', async () => {
      const chain = new FakeChain(100)
      const old = {
        ...chain.block(50),
        timestamp: UnixTime.now() - LIVE_BLOCKS_KEPT_FOR - 60,
      }
      const store = new FakeStore([old])

      await follower(chain, store).follow()

      expect(store.numbers()).toEqual([50, 100])
    })

    it('deletes reorged blocks and stores what replaced them next time', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore([chain.block(97), chain.block(98)])
      const head = follower(chain, store)
      await head.follow()

      chain.reorg(99)
      chain.latest = 101
      expect(await head.follow()).toEqual(0)
      expect(store.numbers()).toEqual([97, 98])

      await head.follow()
      expect(store.hashes()).toEqual([
        '0x97',
        '0x98',
        '0x99-1',
        '0x100-1',
        '0x101-1',
      ])
    })

    it('keeps its blocks when a node serves the next block from another fork', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore([chain.block(99)])
      chain.serveFromForkOnce(100)

      expect(await follower(chain, store).follow()).toEqual(0)

      expect(store.numbers()).toEqual([99])
      expect(store.repository.deleteByProjectAfter).not.toHaveBeenCalled()
      expect(store.repository.deleteByProject).not.toHaveBeenCalled()
    })

    it('stores nothing from a batch whose blocks do not link', async () => {
      const chain = new FakeChain(102)
      const store = new FakeStore([chain.block(99)])
      chain.serveFromForkOnce(101)

      expect(await follower(chain, store).follow()).toEqual(0)

      expect(store.numbers()).toEqual([99])
    })

    it('restarts at the latest block after a reorg past every remembered block', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore([chain.block(98), chain.block(99)])
      const head = follower(chain, store)

      chain.reorg(90)
      await head.follow()
      expect(store.numbers()).toEqual([])

      chain.latest = 102
      await head.follow()
      expect(store.hashes()).toEqual(['0x102-1'])
    })

    it('tries the delete again next run when it failed', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore([chain.block(98), chain.block(99)])
      const head = follower(chain, store)
      store.repository.deleteByProject.rejectsWithOnce(new Error('DB down'))

      chain.reorg(90)
      await expect(head.follow()).toBeRejectedWith('DB down')
      expect(store.numbers()).toEqual([98, 99])

      await head.follow()
      expect(store.numbers()).toEqual([])
    })

    it('stores the counts with the hashes and gas', async () => {
      const chain = new FakeChain(100)
      const store = new FakeStore()

      await follower(chain, store).follow()

      expect(store.rows).toEqual([
        {
          projectId: PROJECT,
          number: 100,
          hash: '0x100',
          parentHash: '0x99',
          timestamp: GENESIS + 100,
          count: 10,
          uopsCount: 12,
          gasUsed: 2_000_000,
        },
      ])
    })
  })

  describe(HeadFollower.prototype.run.name, () => {
    it('checks a chain with no new blocks less and less often', async () => {
      const chain = new FakeChain(100)
      const head = follower(chain, new FakeStore())
      await head.run()

      await runTimes(head, 6)
      // idle runs skip 1, then 2 runs, so 3 of the 6 check
      expect(chain.latestCalls()).toEqual(4)

      chain.latest = 101
      await runTimes(head, 4)
      // 3 runs skipped, then a block, and the wait is over
      expect(chain.latestCalls()).toEqual(5)
      await runTimes(head, 1)
      expect(chain.latestCalls()).toEqual(6)
    })

    it('waits for a block a node behind the load balancer has not got', async () => {
      const chain = new FakeChain(100)
      chain.getBlocks.rejectsWithOnce(new NotFoundOnRpcError('Block not found'))

      await expect(follower(chain, new FakeStore()).run()).not.toBeRejected()
    })

    it('fails on any other error', async () => {
      const chain = new FakeChain(100)
      chain.getBlocks.rejectsWithOnce(new Error('Invalid response'))

      await expect(follower(chain, new FakeStore()).run()).toBeRejectedWith(
        'Invalid response',
      )
    })
  })
})

function follower(chain: FakeChain, store: FakeStore, batchSize = 100) {
  return new HeadFollower(
    { projectId: PROJECT, batchSize, fetcher: chain, db: store.db },
    Logger.SILENT,
  )
}

async function runTimes(head: HeadFollower, times: number) {
  for (let i = 0; i < times; i++) await head.run()
}

/** Block `n` has hash `0x<n>`, or `0x<n>-<k>` once the k-th reorg replaced it */
class FakeChain {
  private replacedFrom: number[] = []
  private readonly forkedOnce = new Set<number>()

  constructor(public latest: number) {}

  getLatestBlockNumber = mockFn(async () => this.latest)
  getBlocks = mockFn(async (from: number, to: number) =>
    range(from, to + 1).map((n) => this.serve(n)),
  )

  reorg(from: number) {
    this.replacedFrom.push(from)
  }

  serveFromForkOnce(number: number) {
    this.forkedOnce.add(number)
  }

  block(number: number): LinkedBlock {
    return {
      number,
      hash: this.hashOf(number),
      parentHash: this.hashOf(number - 1),
      timestamp: GENESIS + number,
      txsCount: 10,
      uopsCount: 12,
      gasUsed: 2_000_000,
    }
  }

  fetched() {
    return this.getBlocks.calls.map((call) => call.args)
  }

  latestCalls() {
    return this.getLatestBlockNumber.calls.length
  }

  private serve(number: number): LinkedBlock {
    const block = this.block(number)
    if (!this.forkedOnce.delete(number)) return block
    return { ...block, hash: `${block.hash}x`, parentHash: '0xother' }
  }

  private hashOf(number: number) {
    const reorgs = this.replacedFrom.filter((from) => number >= from).length
    return reorgs === 0 ? `0x${number}` : `0x${number}-${reorgs}`
  }
}

class FakeStore {
  rows: LiveActivityBlockRecord[]
  readonly repository = mockObject<Database['liveActivityBlock']>({
    getNewest: async (_, limit) => this.rows.slice(-limit),
    upsertMany: async (records) => {
      const numbers = new Set(records.map((r) => r.number))
      this.rows = [
        ...this.rows.filter((r) => !numbers.has(r.number)),
        ...records,
      ]
      this.rows.sort((a, b) => a.number - b.number)
      return records.length
    },
    deleteByProjectAfter: async (_, number) =>
      this.keep((r) => r.number <= number),
    deleteByProject: async () => this.keep(() => false),
  })
  readonly db = mockDatabase({ liveActivityBlock: this.repository })

  constructor(blocks: LinkedBlock[] = []) {
    this.rows = blocks.map((block) => ({
      projectId: PROJECT,
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      count: block.txsCount,
      uopsCount: block.uopsCount,
      gasUsed: block.gasUsed,
    }))
  }

  numbers() {
    return this.rows.map((r) => r.number)
  }

  hashes() {
    return this.rows.map((r) => r.hash)
  }

  private keep(predicate: (row: LiveActivityBlockRecord) => boolean) {
    const before = this.rows.length
    this.rows = this.rows.filter(predicate)
    return before - this.rows.length
  }
}
