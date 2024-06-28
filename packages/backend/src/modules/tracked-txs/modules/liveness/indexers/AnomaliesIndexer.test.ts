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
import { AnomaliesRepository } from '../repositories/AnomaliesRepository'
import { LivenessRepository } from '../repositories/LivenessRepository'
import {
  AnomaliesIndexer,
  AnomaliesIndexerIndexerDeps,
} from './AnomaliesIndexer'

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

describe(AnomaliesIndexer.name, () => {
  describe(AnomaliesIndexer.prototype.update.name, () => {})
  describe(AnomaliesIndexer.prototype.invalidate.name, () => {
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

function createIndexer(deps?: Partial<AnomaliesIndexerIndexerDeps>) {
  return new AnomaliesIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    livenessRepository: mockObject<LivenessRepository>(),
    anomaliesRepository: mockObject<AnomaliesRepository>({
      addOrUpdateMany: mockFn().resolvesTo(1),
    }),
    projects: MOCK_PROJECTS,
    ...deps,
  })
}
