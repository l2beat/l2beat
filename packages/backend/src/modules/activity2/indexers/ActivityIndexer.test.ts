import { Logger } from '@l2beat/backend-tools'
import { ActivityRepository } from '@l2beat/database/src/activity/repository'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { TxsCountProvider } from '../services/TxsCountProvider'
import { ActivityIndexer } from './ActivityIndexer'

describe(ActivityIndexer.name, () => {
  describe(ActivityIndexer.prototype.invalidate.name, () => {
    it('deletes records after targetHeight and returns the new safe height', async () => {
      const activityRepository = mockObject<ActivityRepository>({
        deleteAfter: mockFn().resolvesTo(undefined),
      })

      const indexer = new ActivityIndexer({
        logger: Logger.SILENT,
        parents: [],
        txsCountProvider: mockObject<TxsCountProvider>({}),
        activityRepository,
        projectId: ProjectId('a'),
        indexerService: mockObject<IndexerService>({}),
        minHeight: 0,
      })

      const targetHeight = 10
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(activityRepository.deleteAfter).toHaveBeenCalledWith(
        new UnixTime(targetHeight),
        ProjectId('a'),
      )
      expect(newSafeHeight).toEqual(targetHeight)
    })
  })
})
