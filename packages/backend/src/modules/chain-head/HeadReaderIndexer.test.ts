import { Logger } from '@l2beat/backend-tools'
import type { ChainBlockRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earl'
import { mockDatabase } from '../../test/database'
import { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import { ChainHeadIndexer } from './ChainHeadIndexer'
import {
  HeadReaderIndexer,
  type HeadReaderIndexerOptions,
} from './HeadReaderIndexer'
import {
  FakeChain,
  FakeChainBlocks,
  FakeChainHeadCursors,
  FakeIndexerStates,
} from './test/FakeChain'

/**
 * Methodology: the real chain head and a reader that stores one row per
 * block run under UIF, as in production, against a fake chain and tables in
 * memory. Fake timers move the head from one tick to the next. A process
 * that died is a test that starts from the tables it would have left
 */
const CHAIN = 'base'
const READER = 'test_reader::base'
const NOW = UnixTime.fromDate(new Date('2026-11-18T12:00:00Z'))

interface Row {
  number: number
  hash: string
  timestamp: UnixTime
}

describe(HeadReaderIndexer.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
    time = install({ now: NOW * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  it('reads the blocks as the head gets them, and promises them from the first', async () => {
    const { chain, hashes, cursor, start, nextTick } = setup()
    await start()

    chain.mine(3)
    await nextTick()

    expect(hashes()).toEqual(['0x100', '0x101', '0x102', '0x103'])
    expect(cursor()).toEqual({
      indexerId: READER,
      chain: CHAIN,
      sinceNumber: 100,
      sinceTimestamp: NOW,
      startedAt: NOW,
      number: 103,
      hash: '0x103',
      timestamp: NOW + 3,
    })
  })

  it('starts from the oldest block the head already has', async () => {
    const { hashes, cursor, start } = setup({
      prepare: (chain, tables) => {
        tables.store([chain.block(98), chain.block(99), chain.block(100)])
      },
    })
    await start()

    expect(hashes()).toEqual(['0x98', '0x99', '0x100'])
    expect(cursor()?.sinceNumber).toEqual(98)
  })

  it('replaces what a reorg replaced, and keeps what it promised before', async () => {
    const { chain, hashes, cursor, reads, start, nextTick } = setup()
    await start()
    chain.mine(3)
    await nextTick()

    chain.reorg(102, 104)
    await nextTick()

    expect(hashes()).toEqual([
      '0x100',
      '0x101',
      '0x102-1',
      '0x103-1',
      '0x104-1',
    ])
    // blocks 100 and 101 are not read again
    expect(reads()).toEqual([
      [100, 100],
      [101, 103],
      [102, 104],
    ])
    expect(cursor()).toEqual({
      indexerId: READER,
      chain: CHAIN,
      sinceNumber: 100,
      sinceTimestamp: NOW,
      startedAt: NOW,
      number: 104,
      hash: '0x104-1',
      timestamp: NOW + 4,
    })
  })

  it('stores nothing of blocks the head left while they were read', async () => {
    const { chain, tables, hashes, cursor, start, nextTick } = setup()
    await start()
    chain.mine(2)
    let release = () => {}
    tables.holdRead = new Promise((resolve) => {
      release = resolve
    })
    await nextTick()

    // the reader has blocks 101 and 102, and the head drops 102 before they are saved
    chain.reorg(102, 103)
    await nextTick()
    release()
    await nextTick()

    expect(tables.saved).not.toInclude('0x102')
    expect(hashes()).toEqual(['0x100', '0x101', '0x102-1', '0x103-1'])
    expect(cursor()?.hash).toEqual('0x103-1')
  })

  it('adds nothing to rows of a block the head left just before the new blocks were fetched', async () => {
    const { chain, tables, hashes, cursor, start, nextTick } = setup()
    await start()
    chain.mine(2)
    // the head replaces blocks 100 to 102 after the reader found block 100
    // still there, and before it fetches 101 and 102
    const getByNumberRange = tables.chainBlocks.repository.getByNumberRange
    let replaced = false
    tables.chainBlocks.repository.getByNumberRange = mockFn(
      async (name: string, from: number, to: number) => {
        if (!replaced && from === 101 && to === 102) {
          replaced = true
          chain.reorg(100, 102)
          tables.store([100, 101, 102].map((number) => chain.block(number)))
        }
        return await getByNumberRange(name, from, to)
      },
    )

    await nextTick()
    // nothing added to the rows of the block that is gone
    expect(hashes()).toEqual(['0x100'])
    expect(cursor()?.number).toEqual(100)

    await nextTick()
    await nextTick()
    // and once it tried again, only rows of blocks the chain has
    expect(hashes().every((hash) => hash.endsWith('-1'))).toEqual(true)
    expect(cursor()?.hash).toEqual('0x102-1')
  })

  it('keeps nothing when the block it is told to go back to was replaced again before it looked', async () => {
    const { chain, tables, reader, hashes, cursor, start, nextTick } = setup()
    await start()
    chain.mine(3)
    await nextTick()
    expect(hashes()).toEqual(['0x100', '0x101', '0x102', '0x103'])

    // a reorg replaced block 103 and the head said to go back to 102, then
    // another replaced 102 as well before the reader got to it
    tables.chainBlocks.rows = tables.chainBlocks.rows.map((row) =>
      row.number >= 102 ? { ...row, hash: `${row.hash}-again` } : row,
    )
    await reader.invalidate(102)

    expect(hashes()).toEqual([])
    expect(cursor()).toEqual(undefined)
  })

  it('starts over after a reorg past every block the head stored', async () => {
    const { chain, hashes, cursor, start, nextTick } = setup()
    await start()
    chain.mine(3)
    await nextTick()

    chain.reorg(90, 105)
    await nextTick()

    expect(hashes()).toEqual(['0x105-1'])
    expect(cursor()?.sinceNumber).toEqual(105)
  })

  it('reads everything again when the head left its block and it never heard', async () => {
    // the head dropped block 100 for a reorg and stored what replaced it, and
    // the process died before the reader was invalidated
    const { hashes, cursor, start } = setup({
      prepare: (chain, tables) => {
        const [before, replaced] = [chain.block(99), chain.block(100)]
        chain.reorg(100, 101)
        tables.store([before, chain.block(100), chain.block(101)])
        tables.read([before, replaced], { safeHeight: 100 })
      },
    })
    await start()

    expect(hashes()).toEqual(['0x99', '0x100-1', '0x101-1'])
    expect(cursor()?.hash).toEqual('0x101-1')
  })

  it('reads everything again when it was ahead of its height and the head left its block', async () => {
    // the process died after the rows of block 101 were stored and before
    // the height was, and the head replaced blocks 100 and 101 on the way.
    // UIF then invalidates down to block 100, which is not the one read
    const { hashes, start } = setup({
      prepare: (chain, tables) => {
        const read = [chain.block(99), chain.block(100), chain.block(101)]
        chain.reorg(100, 101)
        tables.store([chain.block(99), chain.block(100), chain.block(101)])
        tables.read(read, { safeHeight: 100 })
      },
    })
    await start()

    expect(hashes()).toEqual(['0x99', '0x100-1', '0x101-1'])
  })

  it('keeps what it read when it was ahead of its height on the same chain', async () => {
    const { hashes, cursor, start } = setup({
      prepare: (chain, tables) => {
        chain.mine(1)
        const blocks = [98, 99, 100, 101].map((n) => chain.block(n))
        tables.store(blocks)
        tables.read(blocks.slice(1), { safeHeight: 100 })
      },
    })
    await start()

    // from block 98 had it started over
    expect(cursor()?.sinceNumber).toEqual(99)
    expect(hashes()).toEqual(['0x99', '0x100', '0x101'])
  })

  for (const batchSize of [2, 5]) {
    it(`catches up ${batchSize} blocks at a time after starting over below its height`, async () => {
      const { hashes, start } = setup({
        batchSize,
        prepare: (chain, tables) => {
          const read = [chain.block(99), chain.block(100)]
          chain.reorg(100, 101)
          tables.store([96, 97, 98, 99, 100, 101].map((n) => chain.block(n)))
          tables.read(read, { safeHeight: 100 })
        },
      })
      await start()

      expect(hashes()).toEqual([
        '0x96',
        '0x97',
        '0x98',
        '0x99',
        '0x100-1',
        '0x101-1',
      ])
    })
  }

  it('starts over when its configuration changed', async () => {
    const { hashes, cursor, start } = setup({
      prepare: (chain, tables) => {
        const blocks = [98, 99, 100].map((n) => chain.block(n))
        tables.store(blocks)
        tables.read(
          [
            { ...blocks[1], hash: 'read under the old configuration' },
            blocks[2],
          ],
          { safeHeight: 100, configHash: 'old' },
        )
      },
    })
    await start()

    expect(hashes()).toEqual(['0x98', '0x99', '0x100'])
    expect(cursor()?.sinceNumber).toEqual(98)
  })

  it('deletes what is older than kept, and promises only what is left', async () => {
    const { chain, numbers, cursor, start } = setup({
      keepFor: 30,
      prepare: (chain, tables) => {
        // a block a second, the newest one now
        const blocks = Array.from({ length: 61 }, (_, i) => chain.block(40 + i))
        tables.store(blocks)
        tables.read(blocks, { safeHeight: 100 })
      },
    })
    await start()

    chain.mine(1)
    // by the head's next tick, ten seconds on, the blocks under number 80
    // are older than kept
    await time.tickAsync(10_000)

    expect(numbers()).toEqual(Array.from({ length: 22 }, (_, i) => 80 + i))
    expect(cursor()?.sinceNumber).toEqual(80)
    expect(cursor()?.sinceTimestamp).toEqual(NOW - 20)
    // when it started over is not moved by the cleaning
    expect(cursor()?.startedAt).toEqual(NOW - 60)
  })

  function setup(
    options: {
      batchSize?: number
      keepFor?: number
      prepare?: (chain: FakeChain, tables: Tables) => void
    } = {},
  ) {
    const chain = new FakeChain(100, NOW - 100)
    const tables = new Tables()
    options.prepare?.(chain, tables)

    const keepFor = options.keepFor ?? UnixTime.HOUR
    const head = new ChainHeadIndexer(
      { chain: CHAIN, source: chain, db: tables.db, batchSize: 100, keepFor },
      Logger.SILENT,
    )
    const reader = new BlockReader(
      {
        chain: CHAIN,
        head,
        name: 'test_reader',
        tags: { tag: CHAIN },
        configHash: 'current',
        batchSize: options.batchSize ?? 100,
        keepFor,
        indexerService: new IndexerService(tables.db),
        db: tables.db,
      },
      tables,
    )

    return {
      chain,
      tables,
      reader,
      hashes: () => tables.rows.map((r) => r.hash),
      numbers: () => tables.rows.map((r) => r.number),
      cursor: () => tables.cursors.rows.get(READER),
      reads: () => tables.reads,
      start: async () => {
        await reader.start()
        await head.start()
        await time.tickAsync(1)
      },
      /** The tick ten seconds on, and the one the head asks for at once after dropping blocks */
      nextTick: async () => {
        await time.tickAsync(10_000)
        await time.tickAsync(1)
      },
    }
  }
})

/** Stores every block it reads, with the hash it read it under */
class BlockReader extends HeadReaderIndexer {
  constructor(
    private readonly reads: HeadReaderIndexerOptions,
    private readonly tables: Tables,
  ) {
    super(reads, Logger.SILENT)
  }

  protected override async read(stored: ChainBlockRecord[]) {
    const [from, to] = [stored[0].number, stored[stored.length - 1].number]
    this.tables.reads.push([from, to])
    const blocks = await this.reads.head.getBlocks(from, to)
    await this.tables.holdRead
    return async () => {
      this.tables.saved.push(...blocks.map((block) => block.hash))
      this.tables.rows.push(
        ...blocks.map(({ number, hash, timestamp }) => ({
          number,
          hash,
          timestamp,
        })),
      )
    }
  }

  protected override async deleteAfter(number: number) {
    return this.tables.keep((row) => row.number <= number)
  }

  protected override async deleteBefore(timestamp: UnixTime) {
    return this.tables.keep((row) => row.timestamp >= timestamp)
  }
}

/** Everything the head and the reader keep in the database, in memory */
class Tables {
  rows: Row[] = []
  /** The block ranges the reader was asked for */
  readonly reads: [number, number][] = []
  /** The hash of every block the reader ever saved */
  readonly saved: string[] = []
  /** Reads wait for it between fetching the blocks and saving them */
  holdRead: Promise<void> | undefined
  readonly chainBlocks = new FakeChainBlocks(CHAIN)
  readonly cursors = new FakeChainHeadCursors()
  private readonly states = new FakeIndexerStates()

  readonly db = mockDatabase({
    chainBlock: this.chainBlocks.repository,
    chainHead: this.chainBlocks.headRepository,
    chainHeadCursor: this.cursors.repository,
    indexerState: this.states.repository,
  })

  /** What the head stored before the process started */
  store(blocks: (Row & { parentHash: string })[]) {
    this.chainBlocks.rows = blocks.map((block) => ({
      chain: CHAIN,
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      logsBloom: null,
    }))
  }

  /** What the reader stored before the process started, up to the last of the blocks */
  read(blocks: Row[], state: { safeHeight: number; configHash?: string }) {
    this.rows = blocks.map(({ number, hash, timestamp }) => ({
      number,
      hash,
      timestamp,
    }))
    const first = blocks[0]
    const last = blocks[blocks.length - 1]
    this.cursors.rows.set(READER, {
      indexerId: READER,
      chain: CHAIN,
      sinceNumber: first.number,
      sinceTimestamp: first.timestamp,
      startedAt: first.timestamp,
      number: last.number,
      hash: last.hash,
      timestamp: last.timestamp,
    })
    this.states.rows.set(READER, { configHash: 'current', ...state })
  }

  keep(predicate: (row: Row) => boolean) {
    const before = this.rows.length
    this.rows = this.rows.filter(predicate)
    return before - this.rows.length
  }
}
