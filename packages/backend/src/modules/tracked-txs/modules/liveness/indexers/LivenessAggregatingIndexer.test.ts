import { Logger } from '@l2beat/backend-tools'
import {
  TrackedTxConfigEntry,
  TrackedTxUseWithId,
  TrackedTxsConfig,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Project } from '../../../../../model/Project'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { AggregatedLivenessRepository } from '../repositories/AggregatedLivenessRepository'
import { LivenessRepository } from '../repositories/LivenessRepository'
import {
  LivenessAggregatingIndexer,
  LivenessAggregatingIndexerDeps,
} from './LivenessAggregatingIndexer'

const MOCK_PROJECTS = [
  mockObject<Project>({
    isArchived: false,
    trackedTxsConfig: mockObject<TrackedTxsConfig>({
      entries: [
        mockObject<TrackedTxConfigEntry>({
          uses: [
            mockObject<TrackedTxUseWithId>({
              type: 'liveness',
              subtype: 'batchSubmissions',
            }),
          ],
          untilTimestampExclusive: UnixTime.now(),
        }),
      ],
    }),
  }),
]

describe(LivenessAggregatingIndexer.name, () => {
  describe(LivenessAggregatingIndexer.prototype.update.name, () => {})
  describe(LivenessAggregatingIndexer.prototype.invalidate.name, () => {
    it('should return new safeHeigh and not delete data', async () => {
      const livenessRepositoryMock = mockObject<LivenessRepository>({
        deleteAll: mockFn().resolvesTo(1),
      })

      const safeHightMock = UnixTime.now().toNumber()

      const indexer = createIndexer({
        livenessRepository: livenessRepositoryMock,
      })

      const result = await indexer.invalidate(safeHightMock)

      expect(livenessRepositoryMock.deleteAll).not.toHaveBeenCalled()

      expect(result).toEqual(safeHightMock)
    })
  })
})

function createIndexer(deps?: Partial<LivenessAggregatingIndexerDeps>) {
  return new LivenessAggregatingIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    livenessRepository: mockObject<LivenessRepository>(),
    aggregatedLivenessRepository: mockObject<AggregatedLivenessRepository>({
      addOrUpdateMany: mockFn().resolvesTo(1),
    }),
    projects: MOCK_PROJECTS,
    ...deps,
  })
}
