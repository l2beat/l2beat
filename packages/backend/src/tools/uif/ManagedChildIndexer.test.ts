import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'

import type { IndexerService } from './IndexerService'
import { _TEST_ONLY_resetUniqueIds } from './ids'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from './ManagedChildIndexer'

describe(ManagedChildIndexer.name, () => {
  afterEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('constructor throws on duplicate indexer ids', () => {
      const common = {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        logger: Logger.SILENT,
        minHeight: 0,
      }
      new TestIndexer({ ...common, name: 'a' })
      expect(() => {
        new TestIndexer({ ...common, name: 'a' })
      }).toThrow('Indexer id a is duplicated!')
    })
  })

  describe(ManagedChildIndexer.prototype.initialize.name, () => {
    it('returns safe height', async () => {
      const indexerService = mockObject<IndexerService>({
        getIndexerState: async () => ({
          indexerId: 'indexer',
          safeHeight: 1,
        }),
      })

      const indexer = new TestIndexer({
        parents: [],
        name: 'indexer',
        minHeight: 0,
        indexerService,
        logger: Logger.SILENT,
      })

      const result = await indexer.initialize()

      expect(result).toEqual({ safeHeight: 1, configHash: undefined })
    })

    it('returns minHeight - 1 if safeHeight not defined', async () => {
      const indexerService = mockObject<IndexerService>({
        getIndexerState: async () => undefined,
      })

      const indexer = new TestIndexer({
        parents: [],
        name: 'indexer',
        minHeight: 100,
        indexerService,
        logger: Logger.SILENT,
      })

      const result = await indexer.initialize()

      expect(result).toEqual({ safeHeight: 99, configHash: undefined })
    })

    it('invalidates on config change', async () => {
      const indexerService = mockObject<IndexerService>({
        getIndexerState: async () => ({
          indexerId: 'indexer',
          safeHeight: 111,
          configHash: 'old-hash',
        }),
      })

      const minHeight = 100
      const indexer = new TestIndexer({
        parents: [],
        name: 'indexer',
        minHeight: minHeight,
        configHash: 'new-hash',
        indexerService,
        logger: Logger.SILENT,
      })

      const result = await indexer.initialize()

      expect(result).toEqual({
        safeHeight: minHeight - 1,
        configHash: 'new-hash',
      })
    })
  })

  it(ManagedChildIndexer.prototype.setSafeHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      setSafeHeight: async () => {},
    })

    const indexer = new TestIndexer({
      parents: [],
      name: 'indexer',
      minHeight: 0,
      indexerService,
      logger: Logger.SILENT,
    })

    await indexer.setSafeHeight(1)

    expect(indexerService.setSafeHeight).toHaveBeenOnlyCalledWith('indexer', 1)
  })
})

class TestIndexer extends ManagedChildIndexer {
  constructor(override readonly options: ManagedChildIndexerOptions) {
    super(options)
  }

  override update(_from: number, to: number): Promise<number> {
    return Promise.resolve(to)
  }

  override invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
