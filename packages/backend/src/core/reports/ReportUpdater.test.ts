import { Logger, mock } from '@l2beat/common'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { AggregateReportRepository } from '../../peripherals/database/AggregateReportRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { BALANCES, NOW, PRICES, PROJECTS } from '../../test/projects'
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { aggregateReports } from './aggregateReports'
import { createReports } from './createReports'
import { getReportConfigHash } from './getReportConfigHash'
import { OP_TOKEN_ID, OPTIMISM_PROJECT_ID } from './optimism'
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
      balance: 214748364000000000000000000n,
      balanceEth: 214748364000000n,
      balanceUsd: 21474836400000n,
      timestamp: NOW.add(1, 'hours'),
      projectId: OPTIMISM_PROJECT_ID,
    },
  ]
  const AGGREGATE_REPORTS = aggregateReports(REPORTS, PROJECTS, NOW)
  const FUTURE_AGGREGATE_REPORTS = aggregateReports(
    FUTURE_REPORTS,
    PROJECTS,
    NOW.add(1, 'hours'),
  )

  describe(ReportUpdater.prototype.update.name, () => {
    it('calculates and saves reports', async () => {
      const priceUpdater = mock<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(FUTURE_PRICES)
          .returnsOnce(PRICES),
      })
      const balanceUpdater = mock<BalanceUpdater>({
        getBalancesWhenReady: mockFn()
          .returnsOnce(FUTURE_BALANCES)
          .returnsOnce(BALANCES),
      })
      const reportRepository = mock<ReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const aggregateReportRepository = mock<AggregateReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const reportStatusRepository = mock<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const reportUpdater = new ReportUpdater(
        priceUpdater,
        balanceUpdater,
        reportRepository,
        aggregateReportRepository,
        reportStatusRepository,
        mock<Clock>(),
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.update(NOW.add(1, 'hours'))
      await reportUpdater.update(NOW)

      const configHash = getReportConfigHash(PROJECTS)
      expect(reportStatusRepository.add).toHaveBeenCalledExactlyWith([
        [{ configHash, timestamp: NOW.add(1, 'hours') }],
        [{ configHash, timestamp: NOW }],
      ])
      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [FUTURE_REPORTS],
        [REPORTS],
      ])
      expect(
        aggregateReportRepository.addOrUpdateMany,
      ).toHaveBeenCalledExactlyWith([
        [FUTURE_AGGREGATE_REPORTS],
        [AGGREGATE_REPORTS],
      ])
    })
  })

  describe(ReportUpdater.prototype.start.name, () => {
    it('skips known timestamps', async () => {
      const priceUpdater = mock<PriceUpdater>({
        getPricesWhenReady: mockFn()
          .returnsOnce(FUTURE_PRICES)
          .returnsOnce(PRICES),
      })
      const balanceUpdater = mock<BalanceUpdater>({
        getBalancesWhenReady: mockFn()
          .returnsOnce(FUTURE_BALANCES)
          .returnsOnce(BALANCES),
      })
      const reportRepository = mock<ReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const aggregateReportRepository = mock<AggregateReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const reportStatusRepository = mock<ReportStatusRepository>({
        getByConfigHash: async () => [
          NOW.add(-1, 'hours'),
          NOW.add(2, 'hours'),
        ],
        add: async ({ configHash }) => configHash,
      })

      const clock = mock<Clock>({
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
        aggregateReportRepository,
        reportStatusRepository,
        clock,
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.start()

      await waitForExpect(() => {
        const configHash = getReportConfigHash(PROJECTS)
        expect(reportStatusRepository.add).toHaveBeenCalledExactlyWith([
          [{ configHash, timestamp: NOW.add(1, 'hours') }],
          [{ configHash, timestamp: NOW }],
        ])

        expect(reportRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
          [FUTURE_REPORTS],
          [REPORTS],
        ])

        expect(
          aggregateReportRepository.addOrUpdateMany,
        ).toHaveBeenCalledExactlyWith([
          [FUTURE_AGGREGATE_REPORTS],
          [AGGREGATE_REPORTS],
        ])
      })
    })
  })
})
