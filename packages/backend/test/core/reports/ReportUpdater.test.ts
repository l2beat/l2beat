import { Logger, mock } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { createReports } from '../../../src/core/reports/createReports'
import { ReportUpdater } from '../../../src/core/reports/ReportUpdater'
import { BalanceRepository } from '../../../src/peripherals/database/BalanceRepository'
import { PriceRepository } from '../../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../../src/peripherals/database/ReportRepository'
import { BALANCES, NOW, PRICES, PROJECTS } from './fakes'

describe(ReportUpdater.name, () => {
  describe(ReportUpdater.prototype.update.name, () => {
    it('calculates and saves reports', async () => {
      const futurePrices = PRICES.map((price) => ({
        ...price,
        timestamp: NOW.add(1, 'hours'),
      }))
      const futureBalances = BALANCES.map((balance) => ({
        ...balance,
        timestamp: NOW.add(1, 'hours'),
      }))

      const priceRepository = mock<PriceRepository>({
        getByTimestamp: mockFn().returnsOnce(PRICES).returnsOnce(futurePrices),
      })
      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: mockFn()
          .returnsOnce(BALANCES)
          .returnsOnce(futureBalances),
      })
      const reportRepository = mock<ReportRepository>({
        addOrUpdateMany: mockFn().returns({}),
      })

      const reportUpdater = new ReportUpdater(
        priceRepository,
        balanceRepository,
        reportRepository,
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.update([NOW, NOW.add(1, 'hours')])

      expect(reportRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [createReports(PRICES, BALANCES, PROJECTS)],
        [createReports(futurePrices, futureBalances, PROJECTS)],
      ])
    })
  })
})
