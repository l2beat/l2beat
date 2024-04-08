import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'

import { _TEST_ONLY_resetUniqueIds } from './ids'
import { IndexerService } from './IndexerService'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
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
      new TestIndexer({ ...common, id: 'a' })
      expect(() => {
        new TestIndexer({ ...common, id: 'a' })
      }).toThrow('Indexer id a is duplicated!')
    })
  })

  describe(ManagedChildIndexer.prototype.initialize.name, () => {
    it('returns safe height', async () => {
      const indexerService = mockObject<IndexerService>({
        getSafeHeight: async () => 1,
      })

      const indexer = new TestIndexer({
        parents: [],
        id: 'indexer',
        minHeight: 0,
        indexerService,
        logger: Logger.SILENT,
      })

      const result = await indexer.initialize()

      expect(result).toEqual(1)
    })

    it('returns minHeight - 1 if safeHeight not defined', async () => {
      const indexerService = mockObject<IndexerService>({
        getSafeHeight: async () => undefined,
      })

      const indexer = new TestIndexer({
        parents: [],
        id: 'indexer',
        minHeight: 100,
        indexerService,
        logger: Logger.SILENT,
      })

      const result = await indexer.initialize()

      expect(indexerService.getSafeHeight).toHaveBeenOnlyCalledWith('indexer')
      expect(result).toEqual(99)
    })
  })

  it(ManagedChildIndexer.prototype.setSafeHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      setSafeHeight: async () => {},
    })

    const indexer = new TestIndexer({
      parents: [],
      id: 'indexer',
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
