import { Logger } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../peripherals/database/AggregatedReportStatusRepository'
import { REPORTS_MOCK as MOCK } from '../../test/mockReports'
import { NMVUpdater } from '../assets/NMVUpdater'
import { Clock } from '../Clock'
import { AggregatedReportUpdater } from './AggregatedReportUpdater'
import { getReportConfigHash } from './getReportConfigHash'
import { ReportUpdater } from './ReportUpdater'

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

      const reportUpdater = mockObject<ReportUpdater>({
        getReportsWhenReady: async () => MOCK.REPORTS,
      })
      const nativeAssetUpdater = mockObject<NMVUpdater>({
        getReportsWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_OP_REPORT)
          .returnsOnce([]),
      })

      const aggregatedReportUpdater = new AggregatedReportUpdater(
        reportUpdater,
        nativeAssetUpdater,
        aggregatedReportRepository,
        aggregatedReportStatusRepository,
        mockObject<Clock>(),
        MOCK.PROJECTS,
        Logger.SILENT,
      )

      await aggregatedReportUpdater.update(MOCK.NOW.add(1, 'hours'))
      await aggregatedReportUpdater.update(MOCK.NOW)

      const configHash = getReportConfigHash(MOCK.PROJECTS)

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
      ).toHaveBeenNthCalledWith(1, MOCK.FUTURE_AGGREGATE_REPORTS_WITH_NATIVE_OP)
      expect(
        aggregatedReportRepository.addOrUpdateMany,
      ).toHaveBeenNthCalledWith(2, MOCK.AGGREGATED_REPORTS)
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

      const reportUpdater = mockObject<ReportUpdater>({
        getReportsWhenReady: async () => MOCK.REPORTS,
      })
      const nativeAssetUpdater = mockObject<NMVUpdater>({
        getReportsWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_OP_REPORT)
          .returnsOnce([]),
      })

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
        reportUpdater,
        nativeAssetUpdater,
        aggregatedReportRepository,
        aggregatedReportStatusRepository,
        clock,
        MOCK.PROJECTS,
        Logger.SILENT,
      )

      await aggregatedReportUpdater.start()

      await waitForExpect(() => {
        const configHash = getReportConfigHash(MOCK.PROJECTS)
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
          MOCK.FUTURE_AGGREGATE_REPORTS_WITH_NATIVE_OP,
        )
        expect(
          aggregatedReportRepository.addOrUpdateMany,
        ).toHaveBeenNthCalledWith(2, MOCK.AGGREGATED_REPORTS)
      })
    })
  })
})
