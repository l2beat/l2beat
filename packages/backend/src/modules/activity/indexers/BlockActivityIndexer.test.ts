import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { BlockActivityIndexer } from './BlockActivityIndexer'
import { TxsCountService } from './types'

describe(BlockActivityIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockActivityIndexer.prototype.update.name, () => {
    it('execute update', async () => {
      const indexer = createIndexer()

      const mockDoUpdate = mockFn().resolvesTo(50)
      indexer.doUpdate = mockDoUpdate

      const newSafeHeight = await indexer.update(0, 100)

      expect(mockDoUpdate).toHaveBeenCalledWith(0, 100)
      expect(newSafeHeight).toEqual(50)
    })

    it('make update adjusted to cutOffPoint', async () => {
      const indexer = createIndexer(50)

      const mockDoUpdate = mockFn().resolvesTo(100)
      indexer.doUpdate = mockDoUpdate

      const newSafeHeight = await indexer.update(0, 100)

      expect(mockDoUpdate).toHaveBeenCalledWith(50, 100)
      expect(newSafeHeight).toEqual(100)
    })

    it('throws if cutOffPoint > to', async () => {
      const mockCutOffPoint = 50
      const mockTo = 40
      const indexer = createIndexer(mockCutOffPoint)

      expect(async () => await indexer.update(0, mockTo)).toBeRejectedWith(
        `Cut-off point (${mockCutOffPoint}) should be less than or equal to the target height ${mockTo}`,
      )
    })
  })

  describe(BlockActivityIndexer.prototype.invalidate.name, () => {
    it('execute invalidation', async () => {
      const indexer = createIndexer()

      const mockDoInvalidate = mockFn().resolvesTo(50)
      indexer.doInvalidate = mockDoInvalidate

      const newSafeHeight = await indexer.invalidate(50)

      expect(mockDoInvalidate).toHaveBeenCalledWith(50)
      expect(newSafeHeight).toEqual(50)
    })

    it('execute invalidation adjusted to cutoffPoint', async () => {
      const indexer = createIndexer(50)

      const mockDoInvalidate = mockFn().resolvesTo(50)
      indexer.doInvalidate = mockDoInvalidate

      const newSafeHeight = await indexer.invalidate(20)

      expect(mockDoInvalidate).toHaveBeenCalledWith(50)
      expect(newSafeHeight).toEqual(20)
    })
  })
})

function createIndexer(cutOffPoint?: number): BlockActivityIndexer {
  return new BlockActivityIndexer({
    logger: Logger.SILENT,
    parents: [],
    txsCountService: mockObject<TxsCountService>(),
    db: mockObject<Database>({}),
    projectId: ProjectId('a'),
    indexerService: mockObject<IndexerService>(),
    minHeight: 0,
    batchSize: 1,
    cutOffPoint,
  })
}
