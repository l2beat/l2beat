import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { DaBeatStatsProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import {
  DaBeatStatsIndexer,
  type DaBeatStatsIndexerDeps,
} from './DaBeatStatsIndexer'

describe(DaBeatStatsIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(DaBeatStatsIndexer.prototype.update.name, () => {
    it('skips update when from and to are in the same hour', async () => {
      const from = UnixTime.fromDate(new Date('2023-01-01T10:30:00Z'))
      const to = UnixTime.fromDate(new Date('2023-01-01T10:45:00Z'))

      const statsProvider = mockObject<DaBeatStatsProvider>({
        getStats: mockFn(),
      })

      const daBeatStatsRepository = mockObject<Database['daBeatStats']>({
        upsert: mockFn(),
      })

      const indexer = createIndexer({
        statsProvider,
        db: mockDatabase({ daBeatStats: daBeatStatsRepository }),
      })

      const result = await indexer.update(from, to)

      expect(statsProvider.getStats).not.toHaveBeenCalled()
      expect(daBeatStatsRepository.upsert).not.toHaveBeenCalled()
      expect(result).toEqual(to)
    })

    it('fetches stats and saves them to DB when from and to are in different hours', async () => {
      const from = UnixTime.fromDate(new Date('2023-01-01T10:00:00Z'))
      const to = UnixTime.fromDate(new Date('2023-01-01T11:00:00Z'))
      const projectId = ProjectId('test-project')

      const mockStats = {
        totalStake: 1000n,
        thresholdStake: 666n,
        numberOfValidators: 100,
      }

      const statsProvider = mockObject<DaBeatStatsProvider>({
        getStats: mockFn().returnsOnce(mockStats),
      })

      const daBeatStatsRepository = mockObject<Database['daBeatStats']>({
        upsert: mockFn().returnsOnce(undefined),
      })

      const indexer = createIndexer({
        projectId,
        statsProvider,
        db: mockDatabase({ daBeatStats: daBeatStatsRepository }),
      })

      const result = await indexer.update(from, to)

      expect(statsProvider.getStats).toHaveBeenOnlyCalledWith(projectId)
      expect(daBeatStatsRepository.upsert).toHaveBeenOnlyCalledWith({
        ...mockStats,
        id: projectId,
      })
      expect(result).toEqual(to)
    })

    it('skips update when no stats were found', async () => {
      const from = UnixTime.fromDate(new Date('2023-01-01T10:30:00Z'))
      const to = UnixTime.fromDate(new Date('2023-01-01T10:45:00Z'))

      const statsProvider = mockObject<DaBeatStatsProvider>({
        getStats: mockFn().returnsOnce(undefined),
      })

      const daBeatStatsRepository = mockObject<Database['daBeatStats']>({
        upsert: mockFn(),
      })

      const indexer = createIndexer({
        statsProvider,
        db: mockDatabase({ daBeatStats: daBeatStatsRepository }),
      })

      const result = await indexer.update(from, to)

      expect(statsProvider.getStats).not.toHaveBeenCalled()
      expect(daBeatStatsRepository.upsert).not.toHaveBeenCalled()
      expect(result).toEqual(to)
    })
  })

  describe(DaBeatStatsIndexer.prototype.invalidate.name, () => {
    it('returns targetHeight unchanged', async () => {
      const indexer = createIndexer({})
      const targetHeight = 12345

      const result = await indexer.invalidate(targetHeight)

      expect(result).toEqual(targetHeight)
    })
  })
})

function createIndexer(
  overrides: Partial<DaBeatStatsIndexerDeps> = {},
): DaBeatStatsIndexer {
  const defaults: DaBeatStatsIndexerDeps = {
    projectId: ProjectId('default-project'),
    db: mockDatabase({ daBeatStats: mockObject() }),
    statsProvider: mockObject<DaBeatStatsProvider>(),
    parents: [],
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
  }

  return new DaBeatStatsIndexer({ ...defaults, ...overrides })
}
