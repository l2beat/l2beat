import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { BlockBackfillIndexer } from './BlockBackfillIndexer'
import { TxsCountService } from './types'

describe(BlockBackfillIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockBackfillIndexer.prototype.update.name, () => {
    it('execute update', async () => {
      const indexer = createIndexer(50)

      const mockDoUpdate = mockFn().resolvesTo(50)
      indexer.doUpdate = mockDoUpdate

      const newSafeHeight = await indexer.update(0, 100)

      expect(mockDoUpdate).toHaveBeenCalledWith(0, 50)
      expect(newSafeHeight).toEqual(50)
    })

    it('execute update adjusted to blockNumberBeforeCutOffPoint', async () => {
      const mockCutOffPoint = 50
      const mockBlockNumberBeforeCutOffPoint = 20
      const indexer = createIndexer(
        mockCutOffPoint,
        mockBlockNumberBeforeCutOffPoint,
      )

      const mockDoUpdate = mockFn().resolvesTo(mockCutOffPoint)
      indexer.doUpdate = mockDoUpdate

      const newSafeHeight = await indexer.update(0, 100)

      expect(mockDoUpdate).toHaveBeenCalledWith(
        mockBlockNumberBeforeCutOffPoint,
        mockCutOffPoint,
      )
      expect(newSafeHeight).toEqual(mockCutOffPoint)
    })

    it('skips update if backfill completed ', async () => {
      const indexer = createIndexer(50)

      const mockDoUpdate = mockFn().resolvesTo(0)
      indexer.doUpdate = mockDoUpdate

      const newSafeHeight = await indexer.update(50, 100)

      expect(mockDoUpdate).not.toHaveBeenCalledWith()
      expect(newSafeHeight).toEqual(100)
    })

    it('throws if cutOffPoint not defined', async () => {
      const indexer = createIndexer()

      expect(async () => await indexer.update(0, 1)).toBeRejectedWith(
        `Cut-off point (${undefined}) should be less than or equal to the target height ${1}`,
      )
    })

    it('throws if cutOffPoint > to', async () => {
      const mockCutOffPoint = 50
      const indexer = createIndexer(mockCutOffPoint)

      expect(async () => await indexer.update(0, 1)).toBeRejectedWith(
        `Cut-off point (${mockCutOffPoint}) should be less than or equal to the target height ${1}`,
      )
    })
  })

  describe(BlockBackfillIndexer.prototype.invalidate.name, () => {
    it('does not execute invalidation', async () => {
      const indexer = createIndexer()

      const mockDoInvalidate = mockFn().resolvesTo(50)
      indexer.doInvalidate = mockDoInvalidate

      const newSafeHeight = await indexer.invalidate(50)

      expect(mockDoInvalidate).not.toHaveBeenCalled()
      expect(newSafeHeight).toEqual(50)
    })
  })
})

function createIndexer(
  cutOffPoint?: number,
  blockNumberBeforeCutOffPoint?: number,
): BlockBackfillIndexer {
  return new BlockBackfillIndexer({
    logger: Logger.SILENT,
    parents: [],
    txsCountService: mockObject<TxsCountService>(),
    db: mockDatabase({
      activity: mockObject<Database['activity']>({
        getProjectBlockNumberBeforeCutOffPoint: mockFn().resolvesTo(
          blockNumberBeforeCutOffPoint ?? 0,
        ),
      }),
    }),
    projectId: ProjectId('a'),
    indexerService: mockObject<IndexerService>(),
    minHeight: 0,
    batchSize: 1,
    cutOffPoint,
  })
}
