import { Logger } from '@l2beat/shared'
import { ChainId, Hash256, UnixTime, ValueType } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { REPORTS_MOCK as MOCK } from '../../test/mockTotalSupplyReports'
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { getEBVConfigHash } from '../reports/getEBVConfigHash'
import { TotalSupplyUpdater } from '../totalSupply/TotalSupplyUpdater'
import { ArbitrumEBVUpdater } from './ArbitrumEBVUpdater'

describe(ArbitrumEBVUpdater.name, () => {
  describe(ArbitrumEBVUpdater.prototype.update.name, () => {
    it('calculates and saves reports', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const balanceUpdater = mockObject<BalanceUpdater>({
        getBalancesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_BALANCES)
          .returnsOnce(MOCK.BALANCES),
      })
      const totalSupplyUpdater = mockObject<TotalSupplyUpdater>({
        getTotalSuppliesWhenReady: mockFn()
          .returnsOnce(MOCK.TOTAL_SUPPLIES)
          .returnsOnce(MOCK.TOTAL_SUPPLIES),
      })
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
        getByTimestampAndPreciseAsset: async () => MOCK.FUTURE_REPORTS,
      })

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const ebvUpdater = new ArbitrumEBVUpdater(
        priceUpdater,
        balanceUpdater,
        totalSupplyUpdater,
        reportRepository,
        reportStatusRepository,
        mockObject<Clock>(),
        [MOCK.PROJECT],
        MOCK.TOKENS,
        Logger.SILENT,
        new UnixTime(0),
      )

      await ebvUpdater.update(MOCK.NOW.add(1, 'hours'))
      await ebvUpdater.update(MOCK.NOW)

      const configHash = getEBVConfigHash(MOCK.PROJECT, MOCK.TOKENS)

      expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
        configHash,
        timestamp: MOCK.NOW.add(1, 'hours'),
        chainId: ChainId.ARBITRUM,
        valueType: ValueType.EBV,
      })
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
        configHash,
        timestamp: MOCK.NOW,
        chainId: ChainId.ARBITRUM,
        valueType: ValueType.EBV,
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
      // ensure that the updater updated internal knownSet
      expect(reports).toEqual(MOCK.FUTURE_REPORTS)
    })

    it('throws if timestamp < minTimestamp', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn(),
      })
      const balanceUpdater = mockObject<BalanceUpdater>({
        getBalancesWhenReady: mockFn(),
      })
      const suppliesUpdater = mockObject<TotalSupplyUpdater>({
        getTotalSuppliesWhenReady: mockFn(),
      })
      const status = mockObject<ReportStatusRepository>({
        add: async () => Hash256.random(),
      })
      const updater = new ArbitrumEBVUpdater(
        priceUpdater,
        balanceUpdater,
        suppliesUpdater,
        mockObject<ReportRepository>(),
        status,
        mockObject<Clock>(),
        [MOCK.PROJECT],
        MOCK.TOKENS,
        Logger.SILENT,
        new UnixTime(1000),
      )

      await expect(
        async () => await updater.update(new UnixTime(999)),
      ).toBeRejectedWith('Timestamp cannot be smaller than minTimestamp')

      expect(priceUpdater.getPricesWhenReady).not.toHaveBeenCalled()
      expect(balanceUpdater.getBalancesWhenReady).not.toHaveBeenCalled()
      expect(suppliesUpdater.getTotalSuppliesWhenReady).not.toHaveBeenCalled()
    })
  })

  describe(ArbitrumEBVUpdater.prototype.start.name, () => {
    it('skips known timestamps', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const balanceUpdater = mockObject<BalanceUpdater>({
        getBalancesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_BALANCES)
          .returnsOnce(MOCK.BALANCES),
      })
      const totalSupplyUpdater = mockObject<TotalSupplyUpdater>({
        getTotalSuppliesWhenReady: mockFn()
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

      const ebvUpdater = new ArbitrumEBVUpdater(
        priceUpdater,
        balanceUpdater,
        totalSupplyUpdater,
        reportRepository,
        reportStatusRepository,
        clock,
        [MOCK.PROJECT],
        MOCK.TOKENS,
        Logger.SILENT,
        new UnixTime(0),
      )

      await ebvUpdater.start()

      await waitForExpect(() => {
        const configHash = getEBVConfigHash(MOCK.PROJECT, MOCK.TOKENS)

        expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
          configHash,
          timestamp: MOCK.NOW.add(1, 'hours'),
          chainId: ChainId.ARBITRUM,
          valueType: ValueType.EBV,
        })
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
          configHash,
          timestamp: MOCK.NOW,
          chainId: ChainId.ARBITRUM,
          valueType: ValueType.EBV,
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

  describe(ArbitrumEBVUpdater.prototype.getReportsWhenReady.name, () => {
    it('returns known timestamps', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_PRICES)
          .returnsOnce(MOCK.PRICES),
      })
      const balanceUpdater = mockObject<BalanceUpdater>({
        getBalancesWhenReady: mockFn()
          .returnsOnce(MOCK.FUTURE_BALANCES)
          .returnsOnce(MOCK.BALANCES),
      })
      const totalSupplyUpdater = mockObject<TotalSupplyUpdater>({
        getTotalSuppliesWhenReady: mockFn()
          .returnsOnce(MOCK.TOTAL_SUPPLIES)
          .returnsOnce(MOCK.TOTAL_SUPPLIES),
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

      const ebvUpdater = new ArbitrumEBVUpdater(
        priceUpdater,
        balanceUpdater,
        totalSupplyUpdater,
        reportRepository,
        reportStatusRepository,
        clock,
        [MOCK.PROJECT],
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
  })
})
