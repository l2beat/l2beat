import { Logger } from '@l2beat/shared'
import { ChainId, Hash256, UnixTime, ValueType } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { describe } from 'mocha'
import waitForExpect from 'wait-for-expect'

import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { REPORTS_MOCK as MOCK } from '../../test/mockReports'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { NATIVE_ASSET_CONFIG_HASH, NMVUpdater } from './NMVUpdater'

describe(NMVUpdater.name, () => {
  describe(NMVUpdater.prototype.update.name, () => {
    it('calculates and saves reports', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
        getByTimestampAndPreciseAsset: async () => MOCK.FUTURE_REPORTS,
      })

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const nmvUpdater = new NMVUpdater(
        priceUpdater,
        reportRepository,
        reportStatusRepository,
        mockObject<Clock>(),
        Logger.SILENT,
        new UnixTime(0),
      )

      await nmvUpdater.update(MOCK.NOW.add(1, 'hours'))
      await nmvUpdater.update(MOCK.NOW)

      expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
        configHash: NATIVE_ASSET_CONFIG_HASH,
        timestamp: MOCK.NOW.add(1, 'hours'),
        chainId: ChainId.NMV,
        valueType: ValueType.NMV,
      })
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
        configHash: NATIVE_ASSET_CONFIG_HASH,
        timestamp: MOCK.NOW,
        chainId: ChainId.NMV,
        valueType: ValueType.NMV,
      })

      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledTimes(2)
      expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
        1,
        MOCK.FUTURE_OP_REPORT,
      )
      expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(2, [])

      const reports = await nmvUpdater.getReportsWhenReady(
        MOCK.NOW.add(1, 'hours'),
      )
      // ensure that the updater updated internal knownSet
      expect(reports).toEqual(MOCK.FUTURE_REPORTS)
    })

    it('throws if timestamp < minTimestamp', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn(),
      })
      const status = mockObject<ReportStatusRepository>({
        add: async () => Hash256.random(),
      })
      const updater = new NMVUpdater(
        priceUpdater,
        mockObject<ReportRepository>(),
        status,
        mockObject<Clock>(),
        Logger.SILENT,
        new UnixTime(1000),
      )
      await expect(
        async () => await updater.update(new UnixTime(999)),
      ).toBeRejectedWith('Timestamp cannot be smaller than minTimestamp')

      expect(priceUpdater.getPricesWhenReady).not.toHaveBeenCalled()
    })
  })

  describe(NMVUpdater.prototype.start.name, () => {
    it('skips known timestamps', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [
          MOCK.NOW.add(-1, 'hours'),
          MOCK.NOW.add(2, 'hours'),
        ],
        add: async ({ configHash }) => configHash,
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

      const nmvUpdater = new NMVUpdater(
        priceUpdater,
        reportRepository,
        reportStatusRepository,
        clock,
        Logger.SILENT,
        new UnixTime(0),
      )

      await nmvUpdater.start()

      await waitForExpect(() => {
        expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
          configHash: NATIVE_ASSET_CONFIG_HASH,
          timestamp: MOCK.NOW.add(1, 'hours'),
          chainId: ChainId.NMV,
          valueType: ValueType.NMV,
        })
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
          configHash: NATIVE_ASSET_CONFIG_HASH,
          timestamp: MOCK.NOW,
          chainId: ChainId.NMV,
          valueType: ValueType.NMV,
        })

        expect(reportRepository.addOrUpdateMany).toHaveBeenCalledTimes(2)
        expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
          1,
          MOCK.FUTURE_OP_REPORT,
        )
        expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(2, [])
      })
    })
  })

  describe(NMVUpdater.prototype.getReportsWhenReady.name, () => {
    it('returns known timestamps', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
        getByTimestampAndPreciseAsset: async () => MOCK.REPORTS,
      })

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [
          MOCK.NOW.add(-1, 'hours'),
          MOCK.NOW.add(2, 'hours'),
        ],
        add: async ({ configHash }) => configHash,
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

      const nmvUpdater = new NMVUpdater(
        priceUpdater,
        reportRepository,
        reportStatusRepository,
        clock,
        Logger.SILENT,
        new UnixTime(0),
      )

      await nmvUpdater.start()

      const reports = await nmvUpdater.getReportsWhenReady(
        MOCK.NOW.add(-1, 'hours'),
      )

      expect(reports).toEqual(MOCK.REPORTS)
    })
  })
})
