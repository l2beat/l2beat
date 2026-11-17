import { Logger } from '@l2beat/backend-tools'
import type { Database, LiveActivityBlockRecord } from '@l2beat/database'
import type { EVMBlockWithTransactions } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import range from 'lodash/range'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { LIVE_BLOCKS_KEPT_FOR } from './LiveActivityCleaner'
import { LiveActivityIndexer } from './LiveActivityIndexer'

const PROJECT = ProjectId('base')
const CONFIG_HASH = 'current'
/** Block 0. Each block comes a second after the one before, and block 3600 just now */
const GENESIS = UnixTime.now() - UnixTime.HOUR

describe(LiveActivityIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(LiveActivityIndexer.prototype.update.name, () => {
    it('starts at the newest block when nothing is stored', async () => {
      const store = new FakeStore()
      const { indexer, getBlocks } = setup(store)

      expect(await indexer.update(0, 3600)).toEqual(3600)

      expect(store.numbers()).toEqual([3600])
      expect(getBlocks).toHaveBeenOnlyCalledWith(3600, 3600)
    })

    it('continues from the stored blocks a batch at a time', async () => {
      const store = new FakeStore([3590])
      const { indexer } = setup(store, 4)

      expect(await indexer.update(3591, 3600)).toEqual(3594)
      expect(await indexer.update(3595, 3600)).toEqual(3598)
      expect(await indexer.update(3599, 3600)).toEqual(3600)

      expect(store.numbers()).toEqual(range(3590, 3601))
    })

    it('starts at the newest block when the stored ones do not reach up to the update', async () => {
      const store = new FakeStore([3500])
      const { indexer } = setup(store)

      expect(await indexer.update(3591, 3600)).toEqual(3600)

      expect(store.numbers()).toEqual([3500, 3600])
    })

    it('starts at the newest block when the stored ones are older than the cleaner keeps', async () => {
      const old = UnixTime.now() - LIVE_BLOCKS_KEPT_FOR - 1
      const store = new FakeStore([{ number: 100, timestamp: old }])
      const { indexer } = setup(store)

      expect(await indexer.update(101, 3600)).toEqual(3600)

      expect(store.numbers()).toEqual([100, 3600])
    })

    it('stores the counts with the hashes and gas', async () => {
      const store = new FakeStore()
      const { indexer } = setup(store)

      await indexer.update(0, 3600)

      expect(store.rows).toEqual([
        {
          projectId: PROJECT,
          number: 3600,
          hash: '0x3600',
          parentHash: '0x3599',
          timestamp: GENESIS + 3600,
          count: 10,
          uopsCount: 12,
          gasUsed: 2_000_000,
        },
      ])
    })
  })

  describe(LiveActivityIndexer.prototype.invalidate.name, () => {
    it('deletes the blocks above the height the chain head dropped to', async () => {
      const store = new FakeStore(range(3595, 3601))
      const { indexer } = setup(store)

      expect(await indexer.invalidate(3597)).toEqual(3597)

      expect(store.numbers()).toEqual([3595, 3596, 3597])
    })

    it('continues from the blocks left below the height', async () => {
      const store = new FakeStore(range(3595, 3600))
      const { indexer } = setup(store)
      await indexer.update(3600, 3600)

      await indexer.invalidate(3597)
      expect(await indexer.update(3598, 3600)).toEqual(3600)

      expect(store.numbers()).toEqual(range(3595, 3601))
    })
  })

  describe(LiveActivityIndexer.prototype.dropBlocksOfAnotherConfig.name, () => {
    it('deletes the stored blocks counted under another config', async () => {
      const store = new FakeStore([3599, 3600])
      store.configHash = 'old'

      await setup(store).indexer.dropBlocksOfAnotherConfig()

      expect(store.numbers()).toEqual([])
    })

    it('keeps the stored blocks counted under the same config', async () => {
      const store = new FakeStore([3599, 3600])
      store.configHash = CONFIG_HASH

      await setup(store).indexer.dropBlocksOfAnotherConfig()

      expect(store.numbers()).toEqual([3599, 3600])
    })

    it('keeps the stored blocks when no config was saved yet', async () => {
      const store = new FakeStore([3599, 3600])

      await setup(store).indexer.dropBlocksOfAnotherConfig()

      expect(store.numbers()).toEqual([3599, 3600])
    })
  })
})

function setup(store: FakeStore, batchSize = 100) {
  const getBlocks = mockFn(async (from: number, to: number) =>
    range(from, to + 1).map(block),
  )
  const indexer = new LiveActivityIndexer(
    {
      projectId: PROJECT,
      batchSize,
      configHash: CONFIG_HASH,
      blocks: { getBlocks },
      count: (b) => ({
        number: b.number,
        timestamp: b.timestamp,
        txsCount: 10,
        uopsCount: 12,
      }),
      db: store.db,
      parents: [],
      indexerService: mockObject<IndexerService>({}),
    },
    Logger.SILENT,
  )
  return { indexer, getBlocks }
}

function block(number: number): EVMBlockWithTransactions {
  return {
    number,
    hash: `0x${number}`,
    parentHash: `0x${number - 1}`,
    timestamp: GENESIS + number,
    logsBloom: '0x',
    gasUsed: 2_000_000,
    transactions: [],
  }
}

class FakeStore {
  rows: LiveActivityBlockRecord[]
  configHash: string | undefined
  readonly db = mockDatabase({
    liveActivityBlock: mockObject<Database['liveActivityBlock']>({
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
    }),
    indexerState: mockObject<Database['indexerState']>({
      findByIndexerId: async (indexerId) =>
        this.configHash === undefined
          ? undefined
          : { indexerId, safeHeight: 0, configHash: this.configHash },
    }),
  })

  constructor(
    stored: (number | { number: number; timestamp: UnixTime })[] = [],
  ) {
    this.rows = stored.map((s) => {
      const number = typeof s === 'number' ? s : s.number
      const b = block(number)
      return {
        projectId: PROJECT,
        number,
        hash: b.hash,
        parentHash: b.parentHash,
        timestamp: typeof s === 'number' ? b.timestamp : s.timestamp,
        count: 10,
        uopsCount: 12,
        gasUsed: b.gasUsed,
      }
    })
  }

  numbers() {
    return this.rows.map((r) => r.number)
  }

  private keep(predicate: (row: LiveActivityBlockRecord) => boolean) {
    const before = this.rows.length
    this.rows = this.rows.filter(predicate)
    return before - this.rows.length
  }
}
