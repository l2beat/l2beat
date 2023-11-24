import { Logger } from '@l2beat/backend-tools'
import { ChainId, Hash256, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { REPORTS_MOCK as MOCK } from '../../test/mockCirculatingSupplyReports'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { getTokensConfigHash } from '../reports/getTokensConfigHash'
import { CirculatingSupplyUpdater } from '../totalSupply/CirculatingSupplyUpdater'
import { CirculatingSupplyFormulaUpdater } from './CirculatingSupplyFormulaUpdater'

describe(CirculatingSupplyFormulaUpdater.name, () => {
  describe(CirculatingSupplyFormulaUpdater.prototype.update.name, () => {
    it('calculates and saves reports', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const circulatingSupplyUpdater = mockObject<CirculatingSupplyUpdater>({
        getCirculatingSuppliesWhenReady: mockFn()
          .returnsOnce(MOCK.TOTAL_SUPPLIES)
          .returnsOnce(MOCK.TOTAL_SUPPLIES),
      })
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
        getByTimestampAndPreciseAsset: mockFn()
          .returnsOnce([])
          .returnsOnce(MOCK.FUTURE_REPORTS)
          .returnsOnce([]),
      })

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const ebvUpdater = new CirculatingSupplyFormulaUpdater(
        priceUpdater,
        circulatingSupplyUpdater,
        reportRepository,
        reportStatusRepository,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
        mockObject<Clock>(),
        MOCK.TOKENS,
        Logger.SILENT,
        new UnixTime(0),
      )

      await ebvUpdater.update(MOCK.NOW.add(1, 'hours'))
      await ebvUpdater.update(MOCK.NOW)

      const configHash = getTokensConfigHash(MOCK.TOKENS)

      expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
        configHash,
        timestamp: MOCK.NOW.add(1, 'hours'),
        chainId: ChainId.ARBITRUM,
      })
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
        configHash,
        timestamp: MOCK.NOW,
        chainId: ChainId.ARBITRUM,
      })

      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledTimes(2)
      expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
        1,
        MOCK.FUTURE_REPORTS,
      )
      expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
        2,
        MOCK.REPORTS,
      )

      const reports = await ebvUpdater.getReportsWhenReady(
        MOCK.NOW.add(1, 'hours'),
      )

      expect(reports).toEqual(MOCK.FUTURE_REPORTS)
    })

    it('throws if timestamp < minTimestamp', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn(),
      })
      const suppliesUpdater = mockObject<CirculatingSupplyUpdater>({
        getCirculatingSuppliesWhenReady: mockFn(),
      })
      const status = mockObject<ReportStatusRepository>({
        add: async () => Hash256.random(),
      })
      const updater = new CirculatingSupplyFormulaUpdater(
        priceUpdater,
        suppliesUpdater,
        mockObject<ReportRepository>(),
        status,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
        mockObject<Clock>(),
        MOCK.TOKENS,
        Logger.SILENT,
        new UnixTime(1000),
      )

      await expect(
        async () => await updater.update(new UnixTime(999)),
      ).toBeRejectedWith('Timestamp cannot be smaller than minTimestamp')

      expect(priceUpdater.getPricesWhenReady).not.toHaveBeenCalled()
      expect(
        suppliesUpdater.getCirculatingSuppliesWhenReady,
      ).not.toHaveBeenCalled()
    })
  })

  describe(CirculatingSupplyFormulaUpdater.prototype.start.name, () => {
    it('skips known timestamps', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const circulatingSupplyUpdater = mockObject<CirculatingSupplyUpdater>({
        getCirculatingSuppliesWhenReady: mockFn()
          .returnsOnce(MOCK.TOTAL_SUPPLIES)
          .returnsOnce(MOCK.TOTAL_SUPPLIES),
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

      const ebvUpdater = new CirculatingSupplyFormulaUpdater(
        priceUpdater,
        circulatingSupplyUpdater,
        reportRepository,
        reportStatusRepository,
        ProjectId.ARBITRUM,
        ChainId.ARBITRUM,
        clock,
        MOCK.TOKENS,
        Logger.SILENT,
        new UnixTime(0),
      )

      await ebvUpdater.start()

      await waitForExpect(() => {
        const configHash = getTokensConfigHash(MOCK.TOKENS)

        expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
          configHash,
          timestamp: MOCK.NOW.add(1, 'hours'),
          chainId: ChainId.ARBITRUM,
        })
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
          configHash,
          timestamp: MOCK.NOW,
          chainId: ChainId.ARBITRUM,
        })

        expect(reportRepository.addOrUpdateMany).toHaveBeenCalledTimes(2)
        expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
          1,
          MOCK.FUTURE_REPORTS,
        )
        expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
          2,
          MOCK.REPORTS,
        )
      })
    })
  })

  describe(
    CirculatingSupplyFormulaUpdater.prototype.getReportsWhenReady.name,
    () => {
      it('returns known timestamps', async () => {
        const priceUpdater = mockObject<PriceUpdater>({
          getPricesWhenReady: mockFn()
            .returnsOnce(MOCK.FUTURE_PRICES)
            .returnsOnce(MOCK.PRICES),
        })
        const circulatingSupplyUpdater = mockObject<CirculatingSupplyUpdater>({
          getCirculatingSuppliesWhenReady: mockFn()
            .returnsOnce(MOCK.TOTAL_SUPPLIES)
            .returnsOnce(MOCK.TOTAL_SUPPLIES),
        })
        const reportRepository = mockObject<ReportRepository>({
          addOrUpdateMany: async () => 0,
          getByTimestampAndPreciseAsset: mockFn()
            .returnsOnce([])
            .returnsOnce(MOCK.REPORTS)
            .returnsOnce([]),
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

        const ebvUpdater = new CirculatingSupplyFormulaUpdater(
          priceUpdater,
          circulatingSupplyUpdater,
          reportRepository,
          reportStatusRepository,
          ProjectId.ARBITRUM,
          ChainId.ARBITRUM,
          clock,
          MOCK.TOKENS,
          Logger.SILENT,
          new UnixTime(0),
        )

        await ebvUpdater.start()

        const reports = await ebvUpdater.getReportsWhenReady(
          MOCK.NOW.add(-1, 'hours'),
        )

        expect(reports).toEqual(MOCK.REPORTS)
      })
    },
  )
})
