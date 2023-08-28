import { Logger } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../peripherals/database/AggregatedReportStatusRepository'
import { REPORTS_MOCK as MOCK } from '../../test/mockReports'
import { AssetUpdater, CBVUpdater } from '../assets'
import { NATIVE_ASSET_CONFIG_HASH, NMVUpdater } from '../assets/NMVUpdater'
import { Clock } from '../Clock'
import { AggregatedReportUpdater } from './AggregatedReportUpdater'
import { getAggregatedConfigHash } from './getAggregatedConfigHash'
import { getReportConfigHash } from './getReportConfigHash'

describe(AggregatedReportUpdater.name, () => {
  describe(AggregatedReportUpdater.prototype.update.name, () => {
    it('calculates and saves reports', async () => {
      const aggregatedReportRepository = mockObject<AggregatedReportRepository>(
        {
          addOrUpdateMany: async () => 0,
        },
      )

      const aggregatedReportStatusRepository =
        mockObject<AggregatedReportStatusRepository>({
          getByConfigHash: async () => [],
          add: async ({ configHash }) => configHash,
        })

      const cbvUpdater = mockObject<CBVUpdater>({
        getReportsWhenReady: async () => MOCK.REPORTS,
        getChainId: mockFn().returns(ChainId.ETHEREUM),
        getConfigHash: mockFn().returns(getReportConfigHash(MOCK.PROJECTS)),
        getMinTimestamp: () => new UnixTime(0),
      })
      const nmvUpdater = mockObject<NMVUpdater>({
        getReportsWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_OP_REPORT)
          .returnsOnce([]),
        getChainId: mockFn().returns(ChainId.NMV),
        getConfigHash: mockFn().returns(NATIVE_ASSET_CONFIG_HASH),
        getMinTimestamp: () => new UnixTime(0),
      })
      const configHash = getAggregatedConfigHash([nmvUpdater, cbvUpdater])

      const aggregatedReportUpdater = new AggregatedReportUpdater(
        [cbvUpdater, nmvUpdater],
        aggregatedReportRepository,
        aggregatedReportStatusRepository,
        mockObject<Clock>(),
        MOCK.PROJECTS,
        Logger.SILENT,
      )

      await aggregatedReportUpdater.update(MOCK.NOW.add(1, 'hours'))
      await aggregatedReportUpdater.update(MOCK.NOW)

      expect(aggregatedReportStatusRepository.add).toHaveBeenNthCalledWith(1, {
        configHash,
        timestamp: MOCK.NOW.add(1, 'hours'),
      })
      expect(aggregatedReportStatusRepository.add).toHaveBeenNthCalledWith(2, {
        configHash,
        timestamp: MOCK.NOW,
      })

      expect(aggregatedReportRepository.addOrUpdateMany).toHaveBeenCalledTimes(
        2,
      )
      expect(
        aggregatedReportRepository.addOrUpdateMany,
      ).toHaveBeenNthCalledWith(
        1,
        MOCK.FUTURE_AGGREGATE_REPORTS_WITH_NATIVE_OP.filter(
          (r) => r.usdValue > 0,
        ),
      )
      expect(
        aggregatedReportRepository.addOrUpdateMany,
      ).toHaveBeenNthCalledWith(
        2,
        MOCK.AGGREGATED_REPORTS.filter((r) => r.usdValue > 0),
      )
    })

    it('calls only updaters with proper minTimestamp', async () => {
      const timestamp = MOCK.NOW

      const firstUpdater = mockObject<AssetUpdater>({
        getReportsWhenReady: mockFn().returns([]),
        getChainId: mockFn().returns(ChainId.ETHEREUM),
        getConfigHash: mockFn().returns(''),
        getMinTimestamp: mockFn().returns(timestamp),
      })

      const secondUpdater = mockObject<AssetUpdater>({
        getReportsWhenReady: mockFn().returns([]),
        getChainId: mockFn().returns(ChainId.ETHEREUM),
        getConfigHash: mockFn().returns(''),
        getMinTimestamp: mockFn().returns(timestamp.add(1, 'hours')),
      })

      const aggregatedReportRepository = mockObject<AggregatedReportRepository>(
        {
          addOrUpdateMany: async () => 0,
        },
      )

      const aggregatedReportStatusRepository =
        mockObject<AggregatedReportStatusRepository>({
          getByConfigHash: async () => [],
          add: async ({ configHash }) => configHash,
        })

      const aggregatedReportUpdater = new AggregatedReportUpdater(
        [firstUpdater, secondUpdater],
        aggregatedReportRepository,
        aggregatedReportStatusRepository,
        mockObject<Clock>(),
        MOCK.PROJECTS,
        Logger.SILENT,
      )

      await aggregatedReportUpdater.update(timestamp)

      expect(firstUpdater.getReportsWhenReady).toHaveBeenCalledTimes(1)
      expect(secondUpdater.getReportsWhenReady).toHaveBeenCalledTimes(0)
    })
  })

  describe(AggregatedReportUpdater.prototype.start.name, () => {
    it('skips known timestamps', async () => {
      const aggregatedReportRepository = mockObject<AggregatedReportRepository>(
        {
          addOrUpdateMany: async () => 0,
        },
      )
      const aggregatedReportStatusRepository =
        mockObject<AggregatedReportStatusRepository>({
          getByConfigHash: async () => [
            MOCK.NOW.add(-1, 'hours'),
            MOCK.NOW.add(2, 'hours'),
          ],
          add: async ({ configHash }) => configHash,
        })

      const cbvUpdater = mockObject<CBVUpdater>({
        getReportsWhenReady: async () => MOCK.REPORTS,
        getChainId: mockFn().returns(ChainId.ETHEREUM),
        getConfigHash: mockFn().returns(getReportConfigHash(MOCK.PROJECTS)),
        getMinTimestamp: () => new UnixTime(0),
      })
      const nmvUpdater = mockObject<NMVUpdater>({
        getReportsWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_OP_REPORT)
          .returnsOnce([]),
        getChainId: mockFn().returns(ChainId.NMV),
        getConfigHash: mockFn().returns(NATIVE_ASSET_CONFIG_HASH),
        getMinTimestamp: () => new UnixTime(0),
      })
      const configHash = getAggregatedConfigHash([nmvUpdater, cbvUpdater])

      const clock = mockObject<Clock>({
        onEveryHour: (callback) => {
          callback(MOCK.NOW.add(-1, 'hours'))
          callback(MOCK.NOW)
          callback(MOCK.NOW.add(1, 'hours'))
          callback(MOCK.NOW.add(2, 'hours'))
          return () => {}
        },
      })

      const aggregatedReportUpdater = new AggregatedReportUpdater(
        [cbvUpdater, nmvUpdater],
        aggregatedReportRepository,
        aggregatedReportStatusRepository,
        clock,
        MOCK.PROJECTS,
        Logger.SILENT,
      )

      await aggregatedReportUpdater.start()

      await waitForExpect(() => {
        expect(aggregatedReportStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(aggregatedReportStatusRepository.add).toHaveBeenNthCalledWith(
          1,
          {
            configHash,
            timestamp: MOCK.NOW.add(1, 'hours'),
          },
        )
        expect(aggregatedReportStatusRepository.add).toHaveBeenNthCalledWith(
          2,
          {
            configHash,
            timestamp: MOCK.NOW,
          },
        )
        expect(
          aggregatedReportRepository.addOrUpdateMany,
        ).toHaveBeenCalledTimes(2)
        expect(
          aggregatedReportRepository.addOrUpdateMany,
        ).toHaveBeenNthCalledWith(
          1,
          MOCK.FUTURE_AGGREGATE_REPORTS_WITH_NATIVE_OP.filter(
            (r) => r.usdValue > 0,
          ),
        )
        expect(
          aggregatedReportRepository.addOrUpdateMany,
        ).toHaveBeenNthCalledWith(
          2,
          MOCK.AGGREGATED_REPORTS.filter((r) => r.usdValue > 0),
        )
      })
    })
  })
})
