import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'

import { IndexerService } from './IndexerService'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from './ManagedChildIndexer'

describe(ManagedChildIndexer.name, () => {
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

    it('returns minHeight if safeHeight not defined', async () => {
      const indexerService = mockObject<IndexerService>({
        getSafeHeight: async () => undefined,
      })

      const indexer = new TestIndexer({
        parents: [],
        id: 'indexer',
        minHeight: 0,
        indexerService,
        logger: Logger.SILENT,
      })

      const result = await indexer.initialize()

      expect(indexerService.getSafeHeight).toHaveBeenOnlyCalledWith('indexer')
      expect(result).toEqual(0)
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
