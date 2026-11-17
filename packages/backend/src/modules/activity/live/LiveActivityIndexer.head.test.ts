import { Logger } from '@l2beat/backend-tools'
import type { Database, LiveActivityBlockRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { ChainHeadIndexer } from '../../chain-head/ChainHeadIndexer'
import { FakeChain, FakeChainBlocks } from '../../chain-head/test/FakeChain'
import { LIVE_BLOCKS_KEPT_FOR } from './LiveActivityCleaner'
import { LiveActivityIndexer } from './LiveActivityIndexer'

/**
 * Methodology: the real chain head and the real live activity indexer run
 * under UIF, as in production, against a fake chain and tables in memory.
 * Fake timers move the head from one tick to the next
 */
const PROJECT = ProjectId('base')
const NOW = UnixTime.fromDate(new Date('2026-11-17T12:00:00Z'))

describe(`${LiveActivityIndexer.name} under the chain head`, () => {
  let time: InstalledClock

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
    time = install({ now: NOW * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  it('stores the blocks as the head gets them', async () => {
    const { chain, rows, start, nextTick } = setup()
    await start()
    expect(rows().map((r) => r.number)).toEqual([100])

    chain.mine(3)
    await nextTick()

    expect(rows().map((r) => r.hash)).toEqual([
      '0x100',
      '0x101',
      '0x102',
      '0x103',
    ])
  })

  it('replaces the blocks a reorg replaced', async () => {
    const { chain, rows, start, nextTick } = setup()
    await start()
    chain.mine(3)
    await nextTick()

    chain.reorg(102, 104)
    await nextTick()

    expect(rows().map((r) => r.hash)).toEqual([
      '0x100',
      '0x101',
      '0x102-1',
      '0x103-1',
      '0x104-1',
    ])
  })

  it('starts over at the newest block after a reorg past every remembered block', async () => {
    const { chain, rows, start, nextTick } = setup()
    await start()
    chain.mine(3)
    await nextTick()

    chain.reorg(90, 105)
    await nextTick()

    expect(rows().map((r) => r.hash)).toEqual(['0x105-1'])
  })

  function setup() {
    const chain = new FakeChain(100, NOW - 100)
    const chainBlocks = new FakeChainBlocks('base')
    const live = new FakeLiveBlocks()
    const states = new Map<
      string,
      { safeHeight: number; configHash?: string }
    >()
    const db = mockObject<Database>({
      chainBlock: chainBlocks.repository,
      liveActivityBlock: live.repository,
      indexerState: mockObject<Database['indexerState']>({
        findByIndexerId: async (indexerId) => {
          const state = states.get(indexerId)
          return state && { indexerId, ...state }
        },
        upsert: async (record) => {
          states.set(record.indexerId, record)
        },
        updateSafeHeight: async (indexerId, safeHeight) => {
          states.set(indexerId, { ...states.get(indexerId), safeHeight })
          return 1
        },
      }),
    })

    const head = new ChainHeadIndexer(
      {
        chain: 'base',
        source: chain,
        db,
        batchSize: 100,
        keepFor: LIVE_BLOCKS_KEPT_FOR,
      },
      Logger.SILENT,
    )
    const indexer = new LiveActivityIndexer(
      {
        projectId: PROJECT,
        batchSize: 100,
        configHash: 'current',
        blocks: head,
        count: (block) => ({
          number: block.number,
          timestamp: block.timestamp,
          txsCount: block.transactions.length,
          uopsCount: null,
        }),
        db,
        parents: [head],
        indexerService: new IndexerService(db),
      },
      Logger.SILENT,
    )

    return {
      chain,
      rows: () => live.rows,
      start: async () => {
        await indexer.start()
        await head.start()
        await time.tickAsync(0)
      },
      /** The tick ten seconds on, and the one the head asks for at once after dropping blocks */
      nextTick: async () => {
        await time.tickAsync(10_000)
        await time.tickAsync(1)
      },
    }
  }
})

class FakeLiveBlocks {
  rows: LiveActivityBlockRecord[] = []
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
    deleteByProjectAfter: async (_, number) => {
      const before = this.rows.length
      this.rows = this.rows.filter((r) => r.number <= number)
      return before - this.rows.length
    },
  })
}
