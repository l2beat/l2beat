import { Logger } from '@l2beat/shared'
import { ValueType } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { BALANCES, NOW, PRICES, PROJECTS } from '../../test/projects'
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { aggregateReports } from './aggregateReports'
import { createReports } from './createReports'
import { OP_TOKEN_ID, OPTIMISM_PROJECT_ID } from './custom/optimism'
import { getReportConfigHash } from './getReportConfigHash'
import { ReportUpdater } from './ReportUpdater'

describe(ReportUpdater.name, () => {
  const FUTURE_PRICES = PRICES.map((price) => ({
    ...price,
    timestamp: NOW.add(1, 'hours'),
  }))
  FUTURE_PRICES.push({
    priceUsd: 1000,
    assetId: OP_TOKEN_ID,
    timestamp: NOW.add(1, 'hours'),
  })
  const FUTURE_BALANCES = BALANCES.map((balance) => ({
    ...balance,
    timestamp: NOW.add(1, 'hours'),
  }))
  const REPORTS = createReports(PRICES, BALANCES, PROJECTS)
  const FUTURE_REPORTS = [
    ...createReports(FUTURE_PRICES, FUTURE_BALANCES, PROJECTS),
    {
      asset: OP_TOKEN_ID,
      type: ValueType.NMV,
      amount: 644594782000000000000000000n,
      ethValue: 644594782000000n,
      usdValue: 64459478200000n,
      timestamp: NOW.add(1, 'hours'),
      projectId: OPTIMISM_PROJECT_ID,
    },
  ]
  const AGGREGATED_REPORTS = aggregateReports(REPORTS, PROJECTS, NOW)
  const FUTURE_AGGREGATE_REPORTS = aggregateReports(
    FUTURE_REPORTS,
    PROJECTS,
    NOW.add(1, 'hours'),
  )

  describe(ReportUpdater.prototype.update.name, () => {
    it('calculates and saves reports', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(FUTURE_PRICES)
          .returnsOnce(PRICES),
      })
      const balanceUpdater = mockObject<BalanceUpdater>({
        getBalancesWhenReady: mockFn()
          .returnsOnce(FUTURE_BALANCES)
          .returnsOnce(BALANCES),
      })
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const aggregatedReportRepository = mockObject<AggregatedReportRepository>(
        {
          addOrUpdateMany: async () => 0,
        },
      )

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const reportUpdater = new ReportUpdater(
        priceUpdater,
        balanceUpdater,
        reportRepository,
        aggregatedReportRepository,
        reportStatusRepository,
        mockObject<Clock>(),
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.update(NOW.add(1, 'hours'))
      await reportUpdater.update(NOW)

      const configHash = getReportConfigHash(PROJECTS)

      expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
        configHash,
        timestamp: NOW.add(1, 'hours'),
      })
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
        configHash,
        timestamp: NOW,
      })

      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledTimes(2)
      expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
        1,
        FUTURE_REPORTS,
      )
      expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
        2,
        REPORTS,
      )

      expect(aggregatedReportRepository.addOrUpdateMany).toHaveBeenCalledTimes(
        2,
      )
      expect(
        aggregatedReportRepository.addOrUpdateMany,
      ).toHaveBeenNthCalledWith(1, FUTURE_AGGREGATE_REPORTS)
      expect(
        aggregatedReportRepository.addOrUpdateMany,
      ).toHaveBeenNthCalledWith(2, AGGREGATED_REPORTS)
    })
  })

  describe(ReportUpdater.prototype.start.name, () => {
    it('skips known timestamps', async () => {
      const priceUpdater = mockObject<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(FUTURE_PRICES)
          .returnsOnce(PRICES),
      })
      const balanceUpdater = mockObject<BalanceUpdater>({
        getBalancesWhenReady: mockFn()
          .returnsOnce(FUTURE_BALANCES)
          .returnsOnce(BALANCES),
      })
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const aggregatedReportRepository = mockObject<AggregatedReportRepository>(
        {
          addOrUpdateMany: async () => 0,
        },
      )

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [
          NOW.add(-1, 'hours'),
          NOW.add(2, 'hours'),
        ],
        add: async ({ configHash }) => configHash,
      })

      const clock = mockObject<Clock>({
        onEveryHour: (callback) => {
          callback(NOW.add(-1, 'hours'))
          callback(NOW)
          callback(NOW.add(1, 'hours'))
          callback(NOW.add(2, 'hours'))
          return () => {}
        },
      })

      const reportUpdater = new ReportUpdater(
        priceUpdater,
        balanceUpdater,
        reportRepository,
        aggregatedReportRepository,
        reportStatusRepository,
        clock,
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.start()

      await waitForExpect(() => {
        const configHash = getReportConfigHash(PROJECTS)

        expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
          configHash,
          timestamp: NOW.add(1, 'hours'),
        })
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
          configHash,
          timestamp: NOW,
        })

        expect(reportRepository.addOrUpdateMany).toHaveBeenCalledTimes(2)
        expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
          1,
          FUTURE_REPORTS,
        )
        expect(reportRepository.addOrUpdateMany).toHaveBeenNthCalledWith(
          2,
          REPORTS,
        )

        expect(
          aggregatedReportRepository.addOrUpdateMany,
        ).toHaveBeenCalledTimes(2)
        expect(
          aggregatedReportRepository.addOrUpdateMany,
        ).toHaveBeenNthCalledWith(1, FUTURE_AGGREGATE_REPORTS)
        expect(
          aggregatedReportRepository.addOrUpdateMany,
        ).toHaveBeenNthCalledWith(2, AGGREGATED_REPORTS)
      })
    })
  })
})
