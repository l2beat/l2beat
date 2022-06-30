import { Logger, mock, UnixTime } from '@l2beat/common'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { BalanceUpdater } from '../../../src/core/BalanceUpdater'
import { Clock } from '../../../src/core/Clock'
import { getConfigHash } from '../../../src/core/getConfigHash'
import { PriceUpdater } from '../../../src/core/PriceUpdater'
import { createReports } from '../../../src/core/reports/createReports'
import { ReportUpdater } from '../../../src/core/reports/ReportUpdater'
import { ReportRepository } from '../../../src/peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../src/peripherals/database/ReportStatusRepository'
import { BALANCES, NOW, PRICES, PROJECTS } from './fakes'

describe(ReportUpdater.name, () => {
  const FUTURE_PRICES = PRICES.map((price) => ({
    ...price,
    timestamp: NOW.add(1, 'hours'),
  }))
  const FUTURE_BALANCES = BALANCES.map((balance) => ({
    ...balance,
    timestamp: NOW.add(1, 'hours'),
  }))

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

      const reportStatusRepository = mock<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const reportUpdater = new ReportUpdater(
        priceUpdater,
        balanceUpdater,
        reportRepository,
        reportStatusRepository,
        new Clock(new UnixTime(0), 0),
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.update(NOW.add(1, 'hours'))
      await reportUpdater.update(NOW)

      const configHash = getConfigHash(PROJECTS)
      expect(reportStatusRepository.add).toHaveBeenCalledExactlyWith([
        [{ configHash, timestamp: NOW.add(1, 'hours') }],
        [{ configHash, timestamp: NOW }],
      ])

      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [createReports(FUTURE_PRICES, FUTURE_BALANCES, PROJECTS)],
        [createReports(PRICES, BALANCES, PROJECTS)],
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
        reportStatusRepository,
        clock,
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.start()

      await waitForExpect(() => {
        const configHash = getConfigHash(PROJECTS)
        expect(reportStatusRepository.add).toHaveBeenCalledExactlyWith([
          [{ configHash, timestamp: NOW.add(1, 'hours') }],
          [{ configHash, timestamp: NOW }],
        ])

        expect(reportRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
          [createReports(FUTURE_PRICES, FUTURE_BALANCES, PROJECTS)],
          [createReports(PRICES, BALANCES, PROJECTS)],
        ])
      })
    })
  })
})
