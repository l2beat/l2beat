import { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
import type { Database, TokenValueRecord } from '@l2beat/database'
import { TokenId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../../tvl/utils/SyncOptimizer'
import type { ProjectValueConfig } from '../types'
import { ProjectValueIndexer } from './ProjectValueIndexer'

describe(ProjectValueIndexer.name, () => {
  const PROJECT = 'test-project'
  const CONFIG_ID = 'test-config-id'
  const MIN_HEIGHT = 100
  const MAX_HEIGHT = 200

  const mockConfiguration: Configuration<ProjectValueConfig> = {
    id: CONFIG_ID,
    properties: {
      project: PROJECT,
    },
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  }

  const mockTokens = new Map<string, TvsToken>([
    [
      'token1',
      mockObject<TvsToken>({
        mode: 'auto',
        id: TokenId('token1'),
        priceId: 'token1-price',
        symbol: 'TKN1',
        name: 'Token 1',
        category: 'ether',
        source: 'canonical',
        isAssociated: false,
      }),
    ],
    [
      'token2',
      mockObject<TvsToken>({
        mode: 'auto',
        id: TokenId('token2'),
        priceId: 'token2-price',
        symbol: 'TKN2',
        name: 'Token 2',
        category: 'stablecoin',
        source: 'external',
        isAssociated: true,
      }),
    ],
    [
      'token3',
      mockObject<TvsToken>({
        mode: 'auto',
        id: TokenId('token3'),
        priceId: 'token3-price',
        symbol: 'TKN3',
        name: 'Token 3',
        category: 'other',
        source: 'native',
        isAssociated: false,
      }),
    ],
  ])

  describe(ProjectValueIndexer.prototype.multiUpdate.name, () => {
    it('processes timestamps and saves aggregated records', async () => {
      const timestamps = [1000, 2000]

      const mockTokenValues: TokenValueRecord[] = [
        mockObject<TokenValueRecord>({
          timestamp: 1000,
          projectId: PROJECT,
          tokenId: 'token1',
          valueForProject: 100,
          valueForSummary: 100,
        }),
        mockObject<TokenValueRecord>({
          timestamp: 1000,
          projectId: PROJECT,
          tokenId: 'token2',
          valueForProject: 200,
          valueForSummary: 200,
        }),
        mockObject<TokenValueRecord>({
          timestamp: 2000,
          projectId: PROJECT,
          tokenId: 'token3',
          valueForProject: 300,
          valueForSummary: 300,
        }),
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
        configurations: [mockConfiguration],
        syncOptimizer,
        tokens: mockTokens,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      const result = await indexer.multiUpdate(100, 200, [mockConfiguration])
      await result()

      expect(tokenRepository.getByProject).toHaveBeenOnlyCalledWith(
        PROJECT,
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
        configurations: [mockConfiguration],
        syncOptimizer,
        tokens: mockTokens,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      const result = await (
        await indexer.multiUpdate(100, 200, [mockConfiguration])
      )()
      expect(result).toEqual(200)
    })
  })

  describe(ProjectValueIndexer.prototype.aggregateForTimestamp.name, () => {
    it('correctly aggregates token values for a timestamp', () => {
      const indexer = new ProjectValueIndexer({
        db: mockObject<Database>(),
        logger: Logger.SILENT,
        configurations: [mockConfiguration],
        syncOptimizer: mockObject<SyncOptimizer>(),
        tokens: mockTokens,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      const timestamp = 1000

      const tokensForTimestamp: TokenValueRecord[] = [
        mockObject<TokenValueRecord>({
          timestamp,
          projectId: PROJECT,
          tokenId: 'token1',
          valueForProject: 100,
          valueForSummary: 100,
        }),
        mockObject<TokenValueRecord>({
          timestamp,
          projectId: PROJECT,
          tokenId: 'token2',
          valueForProject: 200,
          valueForSummary: 200,
        }),
        mockObject<TokenValueRecord>({
          timestamp,
          projectId: PROJECT,
          tokenId: 'token3',
          valueForProject: 300,
          valueForSummary: 300,
        }),
      ]

      const result = indexer.aggregateForTimestamp(
        PROJECT,
        timestamp,
        tokensForTimestamp,
      )

      expect(result.length).toEqual(4)

      // Check SUMMARY record
      const summaryRecord = result.find((r) => r.type === 'SUMMARY')
      expect(summaryRecord?.value).toEqual(600) // 100 + 200 + 300
      expect(summaryRecord?.canonical).toEqual(100)
      expect(summaryRecord?.external).toEqual(200)
      expect(summaryRecord?.native).toEqual(300)
      expect(summaryRecord?.ether).toEqual(100)
      expect(summaryRecord?.stablecoin).toEqual(200)
      expect(summaryRecord?.other).toEqual(300)
      expect(summaryRecord?.associated).toEqual(200) // only token2 is associated

      // Check PROJECT record
      const projectRecord = result.find((r) => r.type === 'PROJECT')
      expect(projectRecord?.value).toEqual(600) // 100 + 200 + 300
      expect(projectRecord?.canonical).toEqual(100)
      expect(projectRecord?.external).toEqual(200)
      expect(projectRecord?.native).toEqual(300)
      expect(projectRecord?.ether).toEqual(100)
      expect(projectRecord?.stablecoin).toEqual(200)
      expect(projectRecord?.other).toEqual(300)
      expect(projectRecord?.associated).toEqual(200) // only token2 is associated

      // Check SUMMARY_WA record (without associated)
      const summaryWaRecord = result.find((r) => r.type === 'SUMMARY_WA')
      expect(summaryWaRecord?.value).toEqual(400) // 100 + 300 - 0 (token2 is associated)

      // Check PROJECT_WA record (without associated)
      const projectWaRecord = result.find((r) => r.type === 'PROJECT_WA')
      expect(projectWaRecord?.value).toEqual(400) // 100 + 300 - 0 (token2 is associated)
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
        configurations: [mockConfiguration],
        tokens: mockTokens,
        syncOptimizer: mockObject<SyncOptimizer>(),
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>(),
      })

      await indexer.removeData([
        {
          id: CONFIG_ID,
          from: MIN_HEIGHT,
          to: MAX_HEIGHT,
        },
      ])

      expect(projectRepository.trimProject).toHaveBeenOnlyCalledWith(
        PROJECT,
        MIN_HEIGHT,
        MAX_HEIGHT,
      )
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})
