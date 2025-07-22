import { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
import type { Database, TokenValueRecord } from '@l2beat/database'
import { TokenId, type UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import { ProjectValueIndexer } from './ProjectValueIndexer'

describe(ProjectValueIndexer.name, () => {
  const mockTokens = new Map<string, TvsToken>([
    ['token1', tokenConfig('token1', 'canonical', 'ether', false)],
    ['token2', tokenConfig('token2', 'external', 'stablecoin', true)],
    ['token3', tokenConfig('token3', 'native', 'other', false)],
    ['token4', tokenConfig('token4', 'native', 'btc', false)],
    ['token5', tokenConfig('token5', 'native', 'rwaRestricted', false)],
    ['token6', tokenConfig('token6', 'native', 'rwaPublic', true)],
  ])

  describe(ProjectValueIndexer.prototype.multiUpdate.name, () => {
    it('processes timestamps and saves aggregated records', async () => {
      const timestamps = [1000, 2000]

      const mockTokenValues: TokenValueRecord[] = [
        tokenRecord('token1', timestamps[0], 100),
        tokenRecord('token2', timestamps[0], 200),
        tokenRecord('token3', timestamps[0], 300),
        tokenRecord('token4', timestamps[0], 400),
        tokenRecord('token5', timestamps[0], 500),
        tokenRecord('token6', timestamps[0], 600),
      ]

      const tokenRepository = mockObject<Database['tvsTokenValue']>({
        getByProject: mockFn().resolvesToOnce(mockTokenValues),
      })
      const projectRepository = mockObject<Database['tvsProjectValue']>({
        upsertMany: mockFn().resolvesToOnce(undefined),
      })
      const db = mockObject<Database>({
        tvsTokenValue: tokenRepository,
        tvsProjectValue: projectRepository,
      })

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returns(timestamps),
      })

      const indexer = new ProjectValueIndexer({
        db,
        logger: Logger.SILENT,
        configurations: [config('id', 'project', 100, 200)],
        syncOptimizer,
        tokens: mockTokens,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      const result = await indexer.multiUpdate(100, 200, [
        config('id', 'project', 100, 200),
      ])
      await result()

      expect(tokenRepository.getByProject).toHaveBeenOnlyCalledWith(
        'project',
        1000,
        2000,
      )

      expect(projectRepository.upsertMany).toHaveBeenCalledTimes(1)
      // 4 records per timestamp (2 timestamps)
      expect(projectRepository.upsertMany.calls[0].args[0].length).toEqual(8)
    })

    it('returns early if no timestamps to process', async () => {
      const db = mockObject<Database>()

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returns([]),
      })

      const indexer = new ProjectValueIndexer({
        db,
        logger: Logger.SILENT,
        configurations: [config('id', 'project', 100, 200)],
        syncOptimizer,
        tokens: mockTokens,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      const result = await (
        await indexer.multiUpdate(100, 200, [config('id', 'project', 100, 200)])
      )()
      expect(result).toEqual(200)
    })
  })

  describe(ProjectValueIndexer.prototype.aggregateForTimestamp.name, () => {
    it('correctly aggregates token values for a timestamp', () => {
      const indexer = new ProjectValueIndexer({
        db: mockObject<Database>(),
        logger: Logger.SILENT,
        configurations: [config('id', 'project', 100, 200)],
        syncOptimizer: mockObject<SyncOptimizer>(),
        tokens: mockTokens,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      const timestamp = 1000

      const tokensForTimestamp = [
        tokenRecord('token1', timestamp, 100),
        tokenRecord('token2', timestamp, 200),
        tokenRecord('token3', timestamp, 300),
        tokenRecord('token4', timestamp, 400),
        tokenRecord('token5', timestamp, 500),
        tokenRecord('token6', timestamp, 600),
      ]

      const result = indexer.aggregateForTimestamp(
        'project',
        timestamp,
        tokensForTimestamp,
      )

      expect(result.length).toEqual(4)

      // Check SUMMARY record
      const summaryRecord = result.find((r) => r.type === 'SUMMARY')
      expect(summaryRecord?.value).toEqual(2100) // sum of all token values
      expect(summaryRecord?.canonical).toEqual(100)
      expect(summaryRecord?.external).toEqual(200)
      expect(summaryRecord?.native).toEqual(1800)
      expect(summaryRecord?.ether).toEqual(100)
      expect(summaryRecord?.stablecoin).toEqual(200)
      expect(summaryRecord?.other).toEqual(300)
      expect(summaryRecord?.associated).toEqual(800) // only token2 and token6 are associated
      expect(summaryRecord?.btc).toEqual(400)
      expect(summaryRecord?.rwaRestricted).toEqual(500)
      expect(summaryRecord?.rwaPublic).toEqual(600)

      // Check PROJECT record
      const projectRecord = result.find((r) => r.type === 'PROJECT')
      expect(projectRecord?.value).toEqual(2100) // sum of all token values
      expect(projectRecord?.canonical).toEqual(100)
      expect(projectRecord?.external).toEqual(200)
      expect(projectRecord?.native).toEqual(1800)
      expect(projectRecord?.ether).toEqual(100)
      expect(projectRecord?.stablecoin).toEqual(200)
      expect(projectRecord?.other).toEqual(300)
      expect(projectRecord?.associated).toEqual(800) // only token2 and token6 are associated
      expect(projectRecord?.btc).toEqual(400)
      expect(projectRecord?.rwaRestricted).toEqual(500)
      expect(projectRecord?.rwaPublic).toEqual(600)

      // Check SUMMARY_WA record (without associated)
      const summaryWaRecord = result.find((r) => r.type === 'SUMMARY_WA')
      expect(summaryWaRecord?.value).toEqual(1300) // 2100 - 800 (token2 and token6 are associated)

      // Check PROJECT_WA record (without associated)
      const projectWaRecord = result.find((r) => r.type === 'PROJECT_WA')
      expect(projectWaRecord?.value).toEqual(1300) // 2100 - 800 (token2 and token6 are associated)
    })
  })

  describe(ProjectValueIndexer.prototype.removeData.name, () => {
    it('trims project values based on configuration', async () => {
      const projectRepository = mockObject<Database['tvsProjectValue']>({
        trimProject: mockFn().resolvesToOnce(10),
      })
      const db = mockObject<Database>({
        tvsProjectValue: projectRepository,
      })

      const indexer = new ProjectValueIndexer({
        db,
        logger: Logger.SILENT,
        configurations: [config('id', 'project', 100, 200)],
        tokens: mockTokens,
        syncOptimizer: mockObject<SyncOptimizer>(),
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      await indexer.removeData([
        {
          id: 'id',
          from: 100,
          to: 200,
        },
      ])

      expect(projectRepository.trimProject).toHaveBeenOnlyCalledWith(
        'project',
        100,
        200,
      )
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(
  id: string,
  project: string,
  minHeight: number,
  maxHeight: number,
) {
  return {
    id,
    properties: {
      project,
    },
    minHeight,
    maxHeight,
  }
}

function tokenConfig(
  id: string,
  source: string,
  category: string,
  isAssociated: boolean,
) {
  return mockObject<TvsToken>({
    mode: 'auto',
    id: TokenId(id),
    source: source as TvsToken['source'],
    category: category as TvsToken['category'],
    isAssociated,
  })
}

function tokenRecord(tokenId: string, timestamp: UnixTime, value: number) {
  return mockObject<TokenValueRecord>({
    timestamp,
    tokenId,
    amount: value,
    valueForProject: value,
    valueForSummary: value,
  })
}
