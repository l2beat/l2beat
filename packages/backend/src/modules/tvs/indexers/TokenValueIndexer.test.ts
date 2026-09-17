import { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
import type { Database, TokenValueRecord } from '@l2beat/database'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { ValueService } from '../services/ValueService'
import type { DBStorage } from '../tools/DBStorage'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import { TokenValueIndexer } from './TokenValueIndexer'

describe(TokenValueIndexer.name, () => {
  describe(TokenValueIndexer.prototype.multiUpdate.name, () => {
    it('calculates token values, saves them to DB and updates sync metadata', async () => {
      const from = 100
      const to = 300
      const timestamps = [UnixTime(150), UnixTime(200), UnixTime(250)]
      const project = 'test-project'

      const mockToken1 = createMockToken('token-1')
      const mockToken2 = createMockToken('token-2')

      const configs = [config(mockToken1), config(mockToken2)]

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce(timestamps),
      } as unknown as SyncOptimizer

      const dbStorage = {
        preloadPrices: vi.fn().mockReturnValueOnce(undefined),
        preloadAmounts: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as DBStorage

      const valueService = {
        calculate: vi.fn().mockReturnValueOnce([
          { ...value(timestamps[0], project, 'token-1', 100), priceUsd: 10 },
          { ...value(timestamps[0], project, 'token-2', 200), priceUsd: 20 },
          { ...value(timestamps[1], project, 'token-1', 150), priceUsd: 10 },
          { ...value(timestamps[1], project, 'token-2', 250), priceUsd: 20 },
          { ...value(timestamps[2], project, 'token-1', 180), priceUsd: 10 },
          { ...value(timestamps[2], project, 'token-2', 280), priceUsd: 20 },
        ]),
      } as unknown as ValueService

      const tvsTokenValueRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['tvsTokenValue']

      const syncMetadataRepository = {
        updateSyncedUntil: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['syncMetadata']

      const indexer = new TokenValueIndexer(
        {
          configurations: configs,
          db: mockDatabase({
            tvsTokenValue: tvsTokenValueRepository,
            syncMetadata: syncMetadataRepository,
          }),
          syncOptimizer,
          dbStorage,
          valueService,
          project,
          maxTimestampsToProcessAtOnce: 10,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampsToSync).toHaveBeenCalledExactlyOnceWith(
        from,
        to,
        10,
      )

      expect(dbStorage.preloadPrices).toHaveBeenCalled()
      expect(dbStorage.preloadAmounts).toHaveBeenCalled()

      expect(valueService.calculate).toHaveBeenCalledExactlyOnceWith(
        {
          projectId: project,
          tokens: configs.map((c) => c.properties),
        },
        timestamps,
      )

      const expectedRecords: TokenValueRecord[] = [
        record(timestamps[0], mockToken1, project, 100, 10),
        record(timestamps[0], mockToken2, project, 200, 20),
        record(timestamps[1], mockToken1, project, 150, 10),
        record(timestamps[1], mockToken2, project, 250, 20),
        record(timestamps[2], mockToken1, project, 180, 10),
        record(timestamps[2], mockToken2, project, 280, 20),
      ]

      expect(
        tvsTokenValueRepository.upsertMany,
      ).toHaveBeenCalledExactlyOnceWith(expectedRecords)
      expect(safeHeight).toEqual(timestamps[timestamps.length - 1])
      expect(
        syncMetadataRepository.updateSyncedUntil,
      ).toHaveBeenCalledExactlyOnceWith(
        'tvs',
        configs.map((c) => c.properties.id),
        timestamps[timestamps.length - 1],
      )
    })

    it('returns to value if no timestamps to sync', async () => {
      const from = 100
      const to = 300
      const timestamps: UnixTime[] = []
      const project = 'test-project'

      const mockToken = createMockToken('token-1')
      const configs = [config(mockToken)]

      const syncOptimizer = {
        getTimestampsToSync: vi.fn().mockReturnValueOnce(timestamps),
      } as unknown as SyncOptimizer

      const indexer = new TokenValueIndexer(
        {
          configurations: configs,
          db: mockDatabase({}),
          syncOptimizer,
          dbStorage: {} as unknown as DBStorage,
          valueService: {} as unknown as ValueService,
          project,
          maxTimestampsToProcessAtOnce: 10,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampsToSync).toHaveBeenCalledExactlyOnceWith(
        from,
        to,
        10,
      )
      expect(safeHeight).toEqual(to)
    })
  })

  describe(TokenValueIndexer.prototype.trimData.name, () => {
    it('deletes records for configuration in time range', async () => {
      const tvsTokenValueRepository = {
        deleteByConfigInTimeRange: vi.fn().mockReturnValue(1),
      } as unknown as Database['tvsTokenValue']

      const mockToken = createMockToken('token-1')
      const configs = [config(mockToken)]

      const indexer = new TokenValueIndexer(
        {
          configurations: configs,
          db: mockDatabase({
            tvsTokenValue: tvsTokenValueRepository,
          }),
          syncOptimizer: {} as unknown as SyncOptimizer,
          dbStorage: {} as unknown as DBStorage,
          valueService: {} as unknown as ValueService,
          project: 'test-project',
          maxTimestampsToProcessAtOnce: 10,
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const removalConfigs = [
        {
          type: 'trim' as const,
          id: 'config-1',
          range: [100, 200] as [number, number],
        },
        {
          type: 'trim' as const,
          id: 'config-2',
          range: [300, 400] as [number, number],
        },
      ]

      await indexer.trimData(removalConfigs)

      expect(
        tvsTokenValueRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].range[0]),
        UnixTime(removalConfigs[0].range[1]),
      )

      expect(
        tvsTokenValueRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].range[0]),
        UnixTime(removalConfigs[1].range[1]),
      )
    })
  })

  describe(TokenValueIndexer.idToConfigurationId.name, () => {
    it('generates proper configuration ID', () => {
      // more complex token configuration, with multiple prices and amounts
      const token: TvsToken = {
        mode: 'auto' as const,
        id: TokenId('id'),
        priceId: 'token',
        symbol: 'symbol',
        name: 'Token',
        amount: {
          type: 'totalSupply',
          address: EthereumAddress(
            '0x1234567890123456789012345678901234567890',
          ),
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
                address: EthereumAddress(
                  '0x1234567890123456789012345678901234567890',
                ),
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
                address: EthereumAddress(
                  '0x1234567890123456789012345678901234567890',
                ),
                escrowAddress: EthereumAddress(
                  '0x1234567890123456789012345678901234567890',
                ),
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

      expect(configId).toBe('c4b862cc3e9e')
    })
  })

  function createMockToken(id: string): TvsToken {
    return {
      mode: 'auto',
      id: TokenId(id),
      priceId: `price-${id}`,
      symbol: `SYM-${id}`,
      name: `Token ${id}`,
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0x1234567890123456789012345678901234567890'),
        sinceTimestamp: 0,
        decimals: 18,
        chain: 'chain',
      },
      category: 'other',
      source: 'canonical',
      isAssociated: true,
    }
  }

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(token: TvsToken): Configuration<TvsToken> {
  return {
    id: `config-${token.id}`,
    properties: token,
    minHeight: 0,
    maxHeight: null,
  }
}

function value(
  timestamp: UnixTime,
  projectId: string,
  tokenId: string,
  amount: number,
) {
  return {
    timestamp,
    projectId,
    tokenId,
    amount,
    value: amount * 10,
    valueForProject: amount * 10,
    valueForSummary: amount * 10,
  }
}

function record(
  timestamp: UnixTime,
  token: TvsToken,
  projectId: string,
  amount: number,
  priceUsd: number,
) {
  return {
    ...value(timestamp, projectId, token.id, amount),
    configurationId: TokenValueIndexer.idToConfigurationId(token),
    priceUsd,
  }
}
