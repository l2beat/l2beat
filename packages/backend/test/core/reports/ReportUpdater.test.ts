import { Logger, mock } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { getConfigHash } from '../../../src/core/getConfigHash'
import { createReports } from '../../../src/core/reports/createReports'
import { ReportUpdater } from '../../../src/core/reports/ReportUpdater'
import { BalanceRepository } from '../../../src/peripherals/database/BalanceRepository'
import { PriceRepository } from '../../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../../src/peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../src/peripherals/database/ReportStatusRepository'
import { BALANCES, NOW, PRICES, PROJECTS } from './fakes'

describe(ReportUpdater.name, () => {
  describe(ReportUpdater.prototype.update.name, () => {
    const FUTURE_PRICES = PRICES.map((price) => ({
      ...price,
      timestamp: NOW.add(1, 'hours'),
    }))
    const FUTURE_BALANCES = BALANCES.map((balance) => ({
      ...balance,
      timestamp: NOW.add(1, 'hours'),
    }))

    it('calculates and saves reports', async () => {
      const priceRepository = mock<PriceRepository>({
        getByTimestamp: mockFn().returnsOnce(PRICES).returnsOnce(FUTURE_PRICES),
      })
      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: mockFn()
          .returnsOnce(BALANCES)
          .returnsOnce(FUTURE_BALANCES),
      })
      const reportRepository = mock<ReportRepository>({
        addOrUpdateMany: async () => 0,
      })

      const reportStatusRepository = mock<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const reportUpdater = new ReportUpdater(
        priceRepository,
        balanceRepository,
        reportRepository,
        reportStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.update([NOW, NOW.add(1, 'hours')])

      const configHash = getConfigHash(PROJECTS)
      expect(reportStatusRepository.add).toHaveBeenCalledExactlyWith([
        [{ configHash, timestamp: NOW }],
        [{ configHash, timestamp: NOW.add(1, 'hours') }],
      ])

      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [createReports(PRICES, BALANCES, PROJECTS)],
        [createReports(FUTURE_PRICES, FUTURE_BALANCES, PROJECTS)],
      ])
    })

    it('skips known timestamps', async () => {
      const priceRepository = mock<PriceRepository>({
        getByTimestamp: mockFn().returnsOnce(PRICES).returnsOnce(FUTURE_PRICES),
      })
      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: mockFn()
          .returnsOnce(BALANCES)
          .returnsOnce(FUTURE_BALANCES),
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

      const reportUpdater = new ReportUpdater(
        priceRepository,
        balanceRepository,
        reportRepository,
        reportStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.update([
        NOW.add(-1, 'hours'),
        NOW,
        NOW.add(1, 'hours'),
        NOW.add(2, 'hours'),
      ])

      const configHash = getConfigHash(PROJECTS)
      expect(reportStatusRepository.add).toHaveBeenCalledExactlyWith([
        [{ configHash, timestamp: NOW }],
        [{ configHash, timestamp: NOW.add(1, 'hours') }],
      ])

      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [createReports(PRICES, BALANCES, PROJECTS)],
        [createReports(FUTURE_PRICES, FUTURE_BALANCES, PROJECTS)],
      ])
    })
  })
})
