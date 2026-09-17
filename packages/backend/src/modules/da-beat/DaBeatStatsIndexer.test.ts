import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { DaBeatStatsProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

      const statsProvider = {
        getStats: vi.fn(),
      } as unknown as DaBeatStatsProvider

      const daBeatStatsRepository = {
        upsert: vi.fn(),
      } as unknown as Database['daBeatStats']

      const indexer = createIndexer({
        statsProvider,
        db: mockDatabase({ daBeatStats: daBeatStatsRepository }),
      })

      const result = await indexer.update(from, to)

      expect(statsProvider.getStats).not.toHaveBeenCalled()
      expect(daBeatStatsRepository.upsert).not.toHaveBeenCalled()
      expect(result).toStrictEqual(to)
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

      const statsProvider = {
        getStats: vi.fn().mockReturnValueOnce(mockStats),
      } as unknown as DaBeatStatsProvider

      const daBeatStatsRepository = {
        upsert: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['daBeatStats']

      const indexer = createIndexer({
        projectId,
        statsProvider,
        db: mockDatabase({ daBeatStats: daBeatStatsRepository }),
      })

      const result = await indexer.update(from, to)

      expect(statsProvider.getStats).toHaveBeenCalledExactlyOnceWith(projectId)
      expect(daBeatStatsRepository.upsert).toHaveBeenCalledExactlyOnceWith({
        ...mockStats,
        id: projectId,
      })
      expect(result).toStrictEqual(to)
    })

    it('skips update when no stats were found', async () => {
      const from = UnixTime.fromDate(new Date('2023-01-01T10:30:00Z'))
      const to = UnixTime.fromDate(new Date('2023-01-01T10:45:00Z'))

      const statsProvider = {
        getStats: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as DaBeatStatsProvider

      const daBeatStatsRepository = {
        upsert: vi.fn(),
      } as unknown as Database['daBeatStats']

      const indexer = createIndexer({
        statsProvider,
        db: mockDatabase({ daBeatStats: daBeatStatsRepository }),
      })

      const result = await indexer.update(from, to)

      expect(statsProvider.getStats).not.toHaveBeenCalled()
      expect(daBeatStatsRepository.upsert).not.toHaveBeenCalled()
      expect(result).toStrictEqual(to)
    })
  })

  describe(DaBeatStatsIndexer.prototype.invalidate.name, () => {
    it('returns targetHeight unchanged', async () => {
      const indexer = createIndexer({})
      const targetHeight = 12345

      const result = await indexer.invalidate(targetHeight)

      expect(result).toStrictEqual(targetHeight)
    })
  })
})

function createIndexer(
  overrides: Partial<DaBeatStatsIndexerDeps> = {},
): DaBeatStatsIndexer {
  const defaults: DaBeatStatsIndexerDeps = {
    projectId: ProjectId('default-project'),
    db: mockDatabase({ daBeatStats: {} as unknown as Database['daBeatStats'] }),
    statsProvider: {} as unknown as DaBeatStatsProvider,
    parents: [],
    indexerService: {} as unknown as IndexerService,
    minHeight: 0,
  }

  return new DaBeatStatsIndexer({ ...defaults, ...overrides }, Logger.SILENT)
}
