import { Logger } from '@l2beat/backend-tools'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  Hash256,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import {
  ReportRecord,
  ReportRepository,
} from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { fakeToken, REPORTS_MOCK as MOCK } from '../../test/mockReports'
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { getReportConfigHash } from '../reports/getReportConfigHash'
import { ReportProject } from '../reports/ReportProject'
import { CBVUpdater } from './CBVUpdater'

describe(CBVUpdater.name, () => {
  describe(CBVUpdater.prototype.update.name, () => {
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
      const reportRepository = mockObject<ReportRepository>({
        addOrUpdateMany: async () => 0,
        getByTimestampAndPreciseAsset: async () => MOCK.FUTURE_REPORTS,
      })

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [],
        add: async ({ configHash }) => configHash,
      })

      const cbvUpdater = new CBVUpdater(
        priceUpdater,
        balanceUpdater,
        reportRepository,
        reportStatusRepository,
        mockObject<Clock>(),
        MOCK.PROJECTS,
        Logger.SILENT,
        new UnixTime(0),
      )

      await cbvUpdater.update(MOCK.NOW.add(1, 'hours'))
      await cbvUpdater.update(MOCK.NOW)

      const configHash = getReportConfigHash(MOCK.PROJECTS)

      expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
        configHash,
        timestamp: MOCK.NOW.add(1, 'hours'),
        chainId: ChainId.ETHEREUM,
      })
      expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
        configHash,
        timestamp: MOCK.NOW,
        chainId: ChainId.ETHEREUM,
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

      const reports = await cbvUpdater.getReportsWhenReady(
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
      const status = mockObject<ReportStatusRepository>({
        add: async () => Hash256.random(),
      })
      const updater = new CBVUpdater(
        priceUpdater,
        balanceUpdater,
        mockObject<ReportRepository>(),
        status,
        mockObject<Clock>(),
        MOCK.PROJECTS,
        Logger.SILENT,
        new UnixTime(1000),
      )

      await expect(
        async () => await updater.update(new UnixTime(999)),
      ).toBeRejectedWith('Timestamp cannot be smaller than minTimestamp')

      expect(priceUpdater.getPricesWhenReady).not.toHaveBeenCalled()
      expect(balanceUpdater.getBalancesWhenReady).not.toHaveBeenCalled()
    })
  })

  describe(CBVUpdater.prototype.start.name, () => {
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

      const cbvUpdater = new CBVUpdater(
        priceUpdater,
        balanceUpdater,
        reportRepository,
        reportStatusRepository,
        clock,
        MOCK.PROJECTS,
        Logger.SILENT,
        new UnixTime(0),
      )

      await cbvUpdater.start()

      await waitForExpect(() => {
        const configHash = getReportConfigHash(MOCK.PROJECTS)

        expect(reportStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(1, {
          configHash,
          timestamp: MOCK.NOW.add(1, 'hours'),
          chainId: ChainId.ETHEREUM,
        })
        expect(reportStatusRepository.add).toHaveBeenNthCalledWith(2, {
          configHash,
          timestamp: MOCK.NOW,
          chainId: ChainId.ETHEREUM,
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

  describe(CBVUpdater.prototype.getReportsWhenReady.name, () => {
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

      const cbvUpdater = new CBVUpdater(
        priceUpdater,
        balanceUpdater,
        reportRepository,
        reportStatusRepository,
        clock,
        MOCK.PROJECTS,
        Logger.SILENT,
        new UnixTime(0),
      )

      await cbvUpdater.start()

      const reports = await cbvUpdater.getReportsWhenReady(
        MOCK.NOW.add(-1, 'hours'),
      )

      expect(reports).toEqual(MOCK.REPORTS)
    })

    it('filters assets that are not in the config', async () => {
      // create a project with one escrow & tokens DAI
      const project: ReportProject = {
        projectId: ProjectId('apex'),
        type: 'layer2',
        escrows: [
          {
            address: EthereumAddress.random(),
            sinceTimestamp: new UnixTime(0),
            tokens: [fakeToken({ id: AssetId.DAI, decimals: 18 })],
          },
        ],
      }
      // create reports for this projects for assets DAI ETH
      const reports: ReportRecord[] = [
        mockReport(project, AssetId.DAI),
        mockReport(project, AssetId.ETH),
      ]
      // mock DB to return the records
      const repository = mockObject<ReportRepository>({
        getByTimestampAndPreciseAsset: async () => reports,
      })

      const reportStatusRepository = mockObject<ReportStatusRepository>({
        getByConfigHash: async () => [new UnixTime(0)],
      })

      // initialize cbv updater
      const cbvUpdater = new CBVUpdater(
        mockObject<PriceUpdater>(),
        mockObject<BalanceUpdater>(),
        repository,
        reportStatusRepository,
        getEmptyClock(),
        [project],
        Logger.SILENT,
        new UnixTime(0),
      )

      await cbvUpdater.start()
      // call .getReports when ready
      const result = await cbvUpdater.getReportsWhenReady(new UnixTime(0))

      // expect to get only ETH & DAI reports
      expect(result).toEqual([reports[0]])
    })
  })
})

function mockReport(project: ReportProject, asset: AssetId): ReportRecord {
  return {
    timestamp: new UnixTime(0),
    asset,
    chainId: ChainId.ETHEREUM,
    reportType: 'CBV',
    amount: 100n,
    ethValue: 100n,
    usdValue: 100n,
    projectId: project.projectId,
  }
}

function getEmptyClock() {
  return mockObject<Clock>({
    onEveryHour: () => () => {},
  })
}
