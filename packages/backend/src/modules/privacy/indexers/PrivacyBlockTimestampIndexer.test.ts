import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyBlockTimestampConfig } from '../types'
import { PrivacyBlockTimestampIndexer } from './PrivacyBlockTimestampIndexer'

describe(PrivacyBlockTimestampIndexer.name, () => {
  describe(PrivacyBlockTimestampIndexer.prototype.multiUpdate.name, () => {
    it('fetches block number for the next hour and saves it to DB', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + 5 * UnixTime.HOUR

      const blockTimestampProvider = {
        getBlockNumberAtOrBefore: vi.fn().mockReturnValueOnce(666),
      } as unknown as BlockTimestampProvider

      const privacyBlockTimestampRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['privacyBlockTimestamp']

      const indexer = new PrivacyBlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepository,
          }),
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenCalledExactlyOnceWith(from, 'ethereum')

      expect(
        privacyBlockTimestampRepository.upsertMany,
      ).toHaveBeenCalledExactlyOnceWith([
        {
          configurationId: config('config-1', 'ethereum').id,
          chain: 'ethereum',
          timestamp: from,
          blockNumber: 666,
        },
      ])

      expect(safeHeight).toStrictEqual(from)
    })

    it('rounds non-aligned from up to the next hour', async () => {
      const hourStart = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const from = hourStart + 120 // 2 minutes into the hour
      const to = hourStart + 5 * UnixTime.HOUR
      const expectedTimestamp = hourStart + UnixTime.HOUR

      const blockTimestampProvider = {
        getBlockNumberAtOrBefore: vi.fn().mockReturnValueOnce(777),
      } as unknown as BlockTimestampProvider

      const privacyBlockTimestampRepository = {
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      } as unknown as Database['privacyBlockTimestamp']

      const indexer = new PrivacyBlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepository,
          }),
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenCalledExactlyOnceWith(expectedTimestamp, 'ethereum')

      expect(safeHeight).toStrictEqual(expectedTimestamp)
    })

    it('returns to value if timestamp is out of range', async () => {
      const hourStart = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const from = hourStart + 120
      const to = hourStart + 30 * 60 // before the next hour boundary

      const blockTimestampProvider = {} as unknown as BlockTimestampProvider

      const indexer = new PrivacyBlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider,
          db: mockDatabase({
            privacyBlockTimestamp:
              {} as unknown as Database['privacyBlockTimestamp'],
          }),
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(safeHeight).toStrictEqual(to)
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const from = UnixTime.toStartOf(UnixTime.now(), 'hour')
      const to = from + 5 * UnixTime.HOUR

      const blockTimestampProvider = {
        getBlockNumberAtOrBefore: vi
          .fn()
          .mockReturnValueOnce(123)
          .mockReturnValueOnce(122),
      } as unknown as BlockTimestampProvider

      const indexer = new PrivacyBlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider,
          db: mockDatabase({
            privacyBlockTimestamp: {
              upsertMany: vi.fn().mockReturnValue(undefined),
            } as unknown as Database['privacyBlockTimestamp'],
          }),
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      await updateFn()

      await expect(
        async () =>
          await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')]),
      ).rejects.toThrow('Block number cannot be smaller')
    })
  })

  describe(PrivacyBlockTimestampIndexer.prototype.trimData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const privacyBlockTimestampRepository = {
        deleteByConfigInTimeRange: vi
          .fn()
          .mockReturnValueOnce(3)
          .mockReturnValueOnce(2),
      } as unknown as Database['privacyBlockTimestamp']

      const indexer = new PrivacyBlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider: {} as unknown as BlockTimestampProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepository,
          }),
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      const removalConfigs = [
        { id: 'config-1', range: [100, 200] as [number, number] },
        { id: 'config-2', range: [300, 400] as [number, number] },
      ]

      await indexer.trimData(removalConfigs)

      expect(
        privacyBlockTimestampRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].range[0]),
        UnixTime(removalConfigs[0].range[1]),
      )

      expect(
        privacyBlockTimestampRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].range[0]),
        UnixTime(removalConfigs[1].range[1]),
      )
    })
  })

  describe(PrivacyBlockTimestampIndexer.prototype.wipeData.name, () => {
    it('deletes all records for the given configurations', async () => {
      const privacyBlockTimestampRepository = {
        deleteByConfigIds: vi.fn().mockReturnValue(3),
      } as unknown as Database['privacyBlockTimestamp']
      const indexer = new PrivacyBlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider: {} as unknown as BlockTimestampProvider,
          db: mockDatabase({
            privacyBlockTimestamp: privacyBlockTimestampRepository,
          }),
          parents: [],
          indexerService: {} as unknown as IndexerService,
        },
        Logger.SILENT,
      )

      await indexer.wipeData([{ id: 'config-1' }, { id: 'config-2' }])

      expect(
        privacyBlockTimestampRepository.deleteByConfigIds,
      ).toHaveBeenCalledExactlyOnceWith(['config-1', 'config-2'])
    })
  })

  it('throws if more than one configuration is provided', () => {
    expect(
      () =>
        new PrivacyBlockTimestampIndexer(
          {
            configurations: [
              config('config-1', 'ethereum'),
              config('config-2', 'ethereum'),
            ],
            blockTimestampProvider: {} as unknown as BlockTimestampProvider,
            db: mockDatabase(),
            parents: [],
            indexerService: {} as unknown as IndexerService,
          },
          Logger.SILENT,
        ),
    ).toThrow('This indexer should take only one configuration')
  })

  describe(PrivacyBlockTimestampIndexer.idToConfigurationId.name, () => {
    it('is deterministic for the same chain', () => {
      const id1 = PrivacyBlockTimestampIndexer.idToConfigurationId({
        chain: 'ethereum',
        sinceTimestamp: UnixTime(123),
      })
      const id2 = PrivacyBlockTimestampIndexer.idToConfigurationId({
        chain: 'ethereum',
        sinceTimestamp: UnixTime(999),
      })
      expect(id1).toStrictEqual('0ceab271a1a3')
      expect(id1).toStrictEqual(id2)
    })

    it('differs across chains', () => {
      const id1 = PrivacyBlockTimestampIndexer.idToConfigurationId({
        chain: 'ethereum',
        sinceTimestamp: UnixTime(0),
      })
      const id2 = PrivacyBlockTimestampIndexer.idToConfigurationId({
        chain: 'arbitrum',
        sinceTimestamp: UnixTime(0),
      })
      expect(id1).not.toStrictEqual(id2)
    })
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(
  id: string,
  chain: string,
): Configuration<PrivacyBlockTimestampConfig> {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      id,
      chain,
      sinceTimestamp: UnixTime(0),
    },
  }
}
