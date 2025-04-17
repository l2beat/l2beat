import { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import { TokenId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { Database } from '@l2beat/database'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../../tvl/utils/SyncOptimizer'
import type { ValueService } from '../services/ValueService'
import type { DBStorage } from '../tools/DBStorage'
import { TokenValueIndexer } from './TokenValueIndexer'

describe(TokenValueIndexer.name, () => {
  describe(TokenValueIndexer.prototype.multiUpdate.name, () => {
    it('calculates token values and saves them to DB', async () => {
      const from = 100
      const to = 300
      const timestamps = [UnixTime(150), UnixTime(200), UnixTime(250)]
      const project = 'test-project'

      const mockToken1 = createMockToken('token-1')
      const mockToken2 = createMockToken('token-2')

      const configs = [
        createMockConfig(mockToken1),
        createMockConfig(mockToken2),
      ]

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce(timestamps),
      })

      const dbStorage = mockObject<DBStorage>({
        preloadPrices: mockFn().returnsOnce(undefined),
        preloadAmounts: mockFn().returnsOnce(undefined),
      })

      const valueService = mockObject<ValueService>({
        calculate: mockFn().returnsOnce([
          {
            timestamp: timestamps[0],
            projectId: project,
            tokenId: 'token-1',
            amount: 100,
            value: 1000,
            valueForProject: 1000,
            valueForSummary: 1000,
          },
          {
            timestamp: timestamps[0],
            projectId: project,
            tokenId: 'token-2',
            amount: 200,
            value: 2000,
            valueForProject: 2000,
            valueForSummary: 2000,
          },
          {
            timestamp: timestamps[1],
            projectId: project,
            tokenId: 'token-1',
            amount: 150,
            value: 1500,
            valueForProject: 1500,
            valueForSummary: 1500,
          },
          {
            timestamp: timestamps[1],
            projectId: project,
            tokenId: 'token-2',
            amount: 250,
            value: 2500,
            valueForProject: 2500,
            valueForSummary: 2500,
          },
          {
            timestamp: timestamps[2],
            projectId: project,
            tokenId: 'token-1',
            amount: 180,
            value: 1800,
            valueForProject: 1800,
            valueForSummary: 1800,
          },
          {
            timestamp: timestamps[2],
            projectId: project,
            tokenId: 'token-2',
            amount: 280,
            value: 2800,
            valueForProject: 2800,
            valueForSummary: 2800,
          },
        ]),
      })

      const tvsTokenValueRepository = mockObject<Database['tvsTokenValue']>({
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new TokenValueIndexer({
        logger: Logger.SILENT,
        configurations: configs,
        db: mockDatabase({
          tvsTokenValue: tvsTokenValueRepository,
        }),
        syncOptimizer,
        dbStorage,
        valueService,
        project,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampsToSync).toHaveBeenOnlyCalledWith(
        from,
        to,
        10,
      )

      expect(dbStorage.preloadPrices).toHaveBeenCalled()
      expect(dbStorage.preloadAmounts).toHaveBeenCalled()

      expect(valueService.calculate).toHaveBeenOnlyCalledWith(
        {
          projectId: project,
          tokens: configs.map((c) => c.properties),
        },
        timestamps,
      )

      const expectedRecords: TokenValueRecord[] = [
        tokenValue(timestamps[0], mockToken1, project, 100),
        tokenValue(timestamps[0], mockToken2, project, 200),
        tokenValue(timestamps[1], mockToken1, project, 150),
        tokenValue(timestamps[1], mockToken2, project, 250),
        tokenValue(timestamps[2], mockToken1, project, 180),
        tokenValue(timestamps[2], mockToken2, project, 280),
      ]

      expect(tvsTokenValueRepository.insertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(timestamps[timestamps.length - 1])
    })

    it('returns to value if no timestamps to sync', async () => {
      const from = 100
      const to = 300
      const timestamps: UnixTime[] = []
      const project = 'test-project'

      const mockToken = createMockToken('token-1')
      const configs = [createMockConfig(mockToken)]

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampsToSync: mockFn().returnsOnce(timestamps),
      })

      const indexer = new TokenValueIndexer({
        logger: Logger.SILENT,
        configurations: configs,
        db: mockDatabase({}),
        syncOptimizer,
        dbStorage: mockObject<DBStorage>({}),
        valueService: mockObject<ValueService>({}),
        project,
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampsToSync).toHaveBeenOnlyCalledWith(
        from,
        to,
        10,
      )
      expect(safeHeight).toEqual(to)
    })
  })

  describe(TokenValueIndexer.prototype.removeData.name, () => {
    it('deletes records for configuration in time range', async () => {
      const tvsTokenValueRepository = mockObject<Database['tvsTokenValue']>({
        deleteByConfigInTimeRange: mockFn().returns(1),
      })

      const mockToken = createMockToken('token-1')
      const configs = [createMockConfig(mockToken)]

      const indexer = new TokenValueIndexer({
        logger: Logger.SILENT,
        configurations: configs,
        db: mockDatabase({
          tvsTokenValue: tvsTokenValueRepository,
        }),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        dbStorage: mockObject<DBStorage>({}),
        valueService: mockObject<ValueService>({}),
        project: 'test-project',
        maxTimestampsToProcessAtOnce: 10,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const removalConfigs = [
        {
          id: 'config-1',
          from: 100,
          to: 200,
        },
        {
          id: 'config-2',
          from: 300,
          to: 400,
        },
      ]

      await indexer.removeData(removalConfigs)

      expect(
        tvsTokenValueRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].from),
        UnixTime(removalConfigs[0].to),
      )

      expect(
        tvsTokenValueRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].from),
        UnixTime(removalConfigs[1].to),
      )
    })
  })

  describe(TokenValueIndexer.idToConfigurationId.name, () => {
    it('generates proper configuration ID', () => {
      // more complex token configuration, with multiple prices and amounts
      const token: TvsToken = {
        mode: 'auto' as const,
        id: TokenId('id'),
        priceId: `token`,
        symbol: `symbol`,
        name: `Token`,
        amount: {
          type: 'totalSupply',
          address: '0x1234567890123456789012345678901234567890',
          sinceTimestamp: 0,
          decimals: 18,
          chain: 'chain',
        },
        valueForProject: {
          type: 'calculation',
          operator: 'diff',
          arguments: [
            {
              type: 'value',
              priceId: 'token',
              amount: {
                type: 'totalSupply',
                address: '0x1234567890123456789012345678901234567890',
                sinceTimestamp: 0,
                decimals: 18,
                chain: 'chain',
              },
            },
            {
              type: 'value',
              priceId: 'token-2',
              amount: {
                type: 'balanceOfEscrow',
                address: '0x1234567890123456789012345678901234567890',
                escrowAddress: '0x1234567890123456789012345678901234567890',
                sinceTimestamp: 0,
                decimals: 18,
                chain: 'chain',
              },
            },
          ],
        },
        category: 'other' as const,
        source: 'canonical' as const,
        isAssociated: true,
      }

      const configId = TokenValueIndexer.idToConfigurationId(token)

      expect(configId).toEqual('c4b862cc3e9e')
    })
  })

  function tokenValue(
    timestamp: UnixTime,
    token: TvsToken,
    projectId: string,
    amount: number,
  ) {
    return {
      timestamp,
      configurationId: TokenValueIndexer.idToConfigurationId(token),
      projectId,
      tokenId: token.id,
      amount,
      value: amount * 10,
      valueForProject: amount * 10,
      valueForSummary: amount * 10,
    }
  }

  function createMockToken(id: string): TvsToken {
    return {
      mode: 'auto',
      id: TokenId(id),
      priceId: `price-${id}`,
      symbol: `SYM-${id}`,
      name: `Token ${id}`,
      amount: {
        type: 'totalSupply',
        address: '0x1234567890123456789012345678901234567890',
        sinceTimestamp: 0,
        decimals: 18,
        chain: 'chain',
      },
      category: 'other',
      source: 'canonical',
      isAssociated: true,
    }
  }

  function createMockConfig(token: TvsToken): Configuration<TvsToken> {
    return {
      id: `config-${token.id}`,
      properties: token,
      minHeight: 0,
      maxHeight: null,
    }
  }

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})
