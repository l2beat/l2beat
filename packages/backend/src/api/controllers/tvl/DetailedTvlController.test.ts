import { tokenList } from '@l2beat/config'
import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  EthereumAddress,
  Hash256,
  ProjectId,
  ReportType,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { ReportProject } from '../../../core/reports/ReportProject'
import {
  AggregatedReportRecord,
  AggregatedReportRepository,
} from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import {
  BalanceRecord,
  BalanceRepository,
} from '../../../peripherals/database/BalanceRepository'
import {
  PriceRecord,
  PriceRepository,
} from '../../../peripherals/database/PriceRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../peripherals/database/ReportRepository'
import { getProjectAssetChartData } from './charts'
import { DetailedTvlController } from './DetailedTvlController'

describe(DetailedTvlController.name, () => {
  const START = UnixTime.fromDate(new Date('2022-05-31'))
  const MINIMUM_TIMESTAMP = START.add(-1, 'hours')

  const USDC = tokenList.find((x) => x.symbol === 'USDC' && x.type === 'CBV')!

  const ARBITRUM: ReportProject = {
    projectId: ProjectId('arbitrum'),
    type: 'layer2',
    escrows: [
      {
        address: EthereumAddress.random(),
        sinceTimestamp: new UnixTime(0),
        tokens: [USDC],
      },
    ],
  }

  describe(
    DetailedTvlController.prototype.getDetailedTvlApiResponse.name,
    () => {
      it('selects minimum viable timestamp for the aggregation', async () => {
        const latestConfigHash = Hash256.random()

        const baseReport: ReportRecord = {
          timestamp: MINIMUM_TIMESTAMP,
          usdValue: 1234_56n,
          ethValue: 1_111111n,
          amount: 111_1111n * 10n ** (6n - 4n),
          asset: AssetId.USDC,
          chainId: ChainId.ETHEREUM,
          projectId: ARBITRUM.projectId,
          reportType: 'CBV',
        }

        const baseAggregatedReport: AggregatedReportRecord[] = [
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            reportType: 'CBV',
            projectId: ARBITRUM.projectId,
          },
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            reportType: 'CBV',
            projectId: ProjectId.ALL,
          },
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            reportType: 'CBV',
            projectId: ProjectId.BRIDGES,
          },
          {
            timestamp: MINIMUM_TIMESTAMP,
            usdValue: 1234_56n,
            ethValue: 1_111111n,
            reportType: 'CBV',
            projectId: ProjectId.LAYER2S,
          },
        ]

        const aggregatedReportStatusRepository =
          mockObject<AggregatedReportStatusRepository>({
            findLatestTimestamp: async () => MINIMUM_TIMESTAMP,
            findCountsForHash: async () => ({
              isSynced: true,
              latestTimestamp: MINIMUM_TIMESTAMP,
              matching: 100, // doesn't matter
              different: 0,
            }),
          })

        const reportRepository = mockObject<ReportRepository>({
          getByTimestamp: async () => [baseReport],
        })

        const aggregatedReportRepository =
          mockObject<AggregatedReportRepository>({
            getDailyWithAnyType: async () => baseAggregatedReport,
            getHourlyWithAnyType: async () => baseAggregatedReport,
            getSixHourlyWithAnyType: async () => baseAggregatedReport,
          })
        const controller = new DetailedTvlController(
          aggregatedReportRepository,
          reportRepository,
          aggregatedReportStatusRepository,
          mockObject<BalanceRepository>({}),
          mockObject<PriceRepository>({}),
          [ARBITRUM],
          [USDC],
          Logger.SILENT,
          latestConfigHash,
          {
            errorOnUnsyncedDetailedTvl: false,
          },
        )

        await controller.getDetailedTvlApiResponse()

        expect(reportRepository.getByTimestamp).toHaveBeenCalledWith(
          MINIMUM_TIMESTAMP,
        )

        expect(
          aggregatedReportRepository.getDailyWithAnyType,
        ).toHaveBeenCalledTimes(1)

        expect(
          aggregatedReportRepository.getHourlyWithAnyType,
        ).toHaveBeenCalledWith(MINIMUM_TIMESTAMP.add(-7, 'days'))

        expect(
          aggregatedReportRepository.getSixHourlyWithAnyType,
        ).toHaveBeenCalledWith(MINIMUM_TIMESTAMP.add(-90, 'days'))
      })
    },
  )

  /**
   * TODO: Add test for granular/exact matches of produces chart points
   */
  describe(
    DetailedTvlController.prototype.getDetailedAssetTvlApiResponse.name,
    () => {
      it('produces detailed asset`s balances in time for charts', async () => {
        const latestConfigHash = Hash256.random()

        const projectId = ProjectId('arbitrum')
        const chainId = ChainId.ARBITRUM
        const asset = AssetId.USDC
        const type = 'EBV'

        const fakeReports = fakeReportSeries(projectId, chainId, asset, type)

        const reportRepository = mockObject<ReportRepository>({
          getHourlyForDetailed: async () => fakeReports.hourlyReports,
          getSixHourlyForDetailed: async () => fakeReports.sixHourlyReports,
          getDailyForDetailed: async () => fakeReports.dailyReports,
        })

        const aggregatedReportStatusRepository =
          mockObject<AggregatedReportStatusRepository>({
            findCountsForHash: async () => ({
              isSynced: true,
              latestTimestamp: fakeReports.to,
              matching: 100, // doesn't matter
              different: 0,
            }),
            findLatestTimestamp: async () => fakeReports.to,
          })

        const controller = new DetailedTvlController(
          mockObject<AggregatedReportRepository>(),
          reportRepository,
          aggregatedReportStatusRepository,
          mockObject<BalanceRepository>({}),
          mockObject<PriceRepository>({}),
          [ARBITRUM],
          [USDC],
          Logger.SILENT,
          latestConfigHash,
          {
            errorOnUnsyncedDetailedTvl: false,
          },
        )

        const result = await controller.getDetailedAssetTvlApiResponse(
          projectId,
          chainId,
          asset,
          type,
        )

        assert(result.result === 'success')

        expect(result.data.daily).toEqual({
          types: ['timestamp', USDC.symbol.toLowerCase(), 'usd'],
          data: getProjectAssetChartData(
            fakeReports.dailyReports,
            USDC.decimals,
            24,
          ),
        })

        expect(result.data.sixHourly).toEqual({
          types: ['timestamp', USDC.symbol.toLowerCase(), 'usd'],
          data: getProjectAssetChartData(
            fakeReports.sixHourlyReports,
            USDC.decimals,
            6,
          ),
        })

        expect(result.data.hourly).toEqual({
          types: ['timestamp', USDC.symbol.toLowerCase(), 'usd'],
          data: getProjectAssetChartData(
            fakeReports.hourlyReports,
            USDC.decimals,
            1,
          ),
        })

        expect(reportRepository.getHourlyForDetailed).toHaveBeenCalledWith(
          projectId,
          chainId,
          asset,
          type,
          fakeReports.to.add(-7, 'days'),
        )

        expect(reportRepository.getSixHourlyForDetailed).toHaveBeenCalledWith(
          projectId,
          chainId,
          asset,
          type,
          fakeReports.to.add(-90, 'days'),
        )

        expect(reportRepository.getDailyForDetailed).toHaveBeenCalledWith(
          projectId,
          chainId,
          asset,
          type,
        )
      })
    },
  )

  describe(
    DetailedTvlController.prototype.getProjectTokenBreakdownApiResponse.name,
    () => {
      it('produces assets breakdown per project', async () => {
        const USDC = tokenList.find(
          (x) => x.symbol === 'USDC' && x.type === 'CBV',
        )!

        const OP = tokenList.find((x) => x.symbol === 'OP' && x.type === 'NMV')!

        const DAI = tokenList.find(
          (x) => x.symbol === 'DAI' && x.type === 'CBV',
        )!

        const ETH = tokenList.find(
          (x) => x.symbol === 'ETH' && x.type === 'CBV',
        )!

        const latestConfigHash = Hash256.random()
        const timestamp = UnixTime.now()

        const firstEscrow = EthereumAddress.random()
        const secondEscrow = EthereumAddress.random()

        const eth: Token = { ...ETH, type: 'CBV', chainId: ChainId.ETHEREUM }
        const usdc: Token = {
          ...USDC,
          type: 'CBV',
          chainId: ChainId.ETHEREUM,
        }
        const dai: Token = { ...DAI, type: 'EBV', chainId: ChainId.ARBITRUM }
        const op: Token = { ...OP, type: 'NMV', chainId: ChainId.ARBITRUM }

        const projects: ReportProject[] = [
          {
            projectId: ProjectId('arbitrum'),
            type: 'layer2',
            escrows: [
              {
                address: firstEscrow,
                sinceTimestamp: new UnixTime(0),
                tokens: [eth, usdc],
              },

              {
                address: secondEscrow,
                sinceTimestamp: new UnixTime(0),
                tokens: [usdc],
              },
            ],
          },
          {
            projectId: ProjectId('optimism'),
            type: 'layer2',
            escrows: [],
          },
        ]

        const reports: ReportRecord[] = [
          {
            timestamp,
            projectId: ProjectId('arbitrum'),
            asset: dai.id,
            chainId: dai.chainId,
            reportType: dai.type,
            amount: 10_000_000_000_000n,
            usdValue: 10_000_000_000_000n,
            ethValue: 10_000n,
          },
          {
            timestamp,
            projectId: ProjectId('arbitrum'),
            asset: usdc.id,
            chainId: usdc.chainId,
            reportType: usdc.type,
            amount: 20_000_000_000_000n,
            usdValue: 20_000_000_000_000n,
            ethValue: 20_000n,
          },
          {
            timestamp,
            projectId: ProjectId('arbitrum'),
            asset: op.id,
            chainId: op.chainId,
            reportType: op.type,
            amount: 30_000_000_000_000n,
            usdValue: 45_000_000_000_000n,
            ethValue: 45_000n,
          },
        ]

        const balances: BalanceRecord[] = projects.flatMap(({ escrows }) =>
          escrows.flatMap(({ tokens, address }) =>
            tokens.flatMap((token) => ({
              timestamp,
              holderAddress: address,
              assetId: token.id,
              balance: 10_000_000_000_000n,
              chainId: token.chainId,
            })),
          ),
        )

        const prices: PriceRecord[] = [
          {
            assetId: ETH.id,
            timestamp,
            priceUsd: 1000,
          },
          {
            assetId: DAI.id,
            timestamp,
            priceUsd: 1,
          },
          {
            assetId: OP.id,
            timestamp,
            priceUsd: 1.5,
          },
          {
            assetId: USDC.id,
            timestamp,
            priceUsd: 1,
          },
        ]

        const aggregatedReportStatusRepository =
          mockObject<AggregatedReportStatusRepository>({
            findCountsForHash: async () => ({
              isSynced: true,
              latestTimestamp: timestamp,
              matching: 100, // doesn't matter
              different: 0,
            }),
            findLatestTimestamp: async () => timestamp,
          })

        const reportRepository = mockObject<ReportRepository>({
          getByTimestamp: async () => reports,
        })

        const balanceRepository = mockObject<BalanceRepository>({
          getByTimestamp: async () => balances,
        })

        const priceRepository = mockObject<PriceRepository>({
          getByTimestamp: async () => prices,
        })

        const controller = new DetailedTvlController(
          mockObject<AggregatedReportRepository>(),
          reportRepository,
          aggregatedReportStatusRepository,
          balanceRepository,
          priceRepository,
          projects,
          [dai, op, usdc],
          Logger.SILENT,
          latestConfigHash,
          {
            errorOnUnsyncedDetailedTvl: false,
          },
        )

        const result = await controller.getProjectTokenBreakdownApiResponse()

        assert(result.result === 'success')

        expect(result.data.dataTimestamp).toEqual(timestamp)
        expect(result.data.breakdowns).toEqual({
          arbitrum: {
            external: [
              {
                assetId: dai.id,
                chainId: dai.chainId,
                amount: '0.00001',
                usdValue: '100000000000',
                usdPrice: '10000000000000000',
                tokenAddress: EthereumAddress(
                  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                ),
              },
            ],
            native: [
              {
                assetId: op.id,
                chainId: op.chainId,
                amount: '0.00003',
                usdValue: '450000000000',
                usdPrice: '15000000000000000',
                tokenAddress: EthereumAddress(
                  '0x4200000000000000000000000000000000000042',
                ),
              },
            ],
            canonical: {
              [firstEscrow.toString()]: [
                {
                  assetId: eth.id,
                  chainId: eth.chainId,
                  amount: '0.00001',
                  usdValue: '0.01',
                  usdPrice: '1000',
                },
                {
                  assetId: usdc.id,
                  chainId: usdc.chainId,
                  amount: '10000000',
                  usdValue: '10000000',
                  usdPrice: '1',
                },
              ],
              [secondEscrow.toString()]: [
                {
                  assetId: usdc.id,
                  chainId: usdc.chainId,
                  amount: '10000000',
                  usdValue: '10000000',
                  usdPrice: '1',
                },
              ],
            },
          },
          optimism: {
            external: [],
            native: [],
            canonical: {},
          },
        })
      })
    },
  )
})

function fakeAssetReport(
  projectId: ProjectId,
  chainId: ChainId,
  asset: AssetId,
  reportType: ReportType,
  timestamp: UnixTime,
) {
  return {
    timestamp: timestamp,
    usdValue: 10_000_000n,
    ethValue: 10_000n,
    amount: 50_000_000n * 10n ** (6n - 4n),
    asset,
    chainId,
    projectId,
    reportType,
  }
}

function fakeReportSeries(
  projectId: ProjectId,
  chainId: ChainId,
  asset: AssetId,
  type: ReportType,
) {
  const to = UnixTime.now()
  const from = to.add(-90, 'days')

  const timeDiff = to.toNumber() - from.toNumber()

  const hoursInDiff = Math.floor(timeDiff / 1000 / 60 / 60)
  const sixHoursInDiff = Math.floor(hoursInDiff / 6)
  const daysInDiff = Math.floor(hoursInDiff / 24)

  const hourlyTimestamps = Array.from({ length: hoursInDiff }, (_, i) =>
    from.add(i, 'hours'),
  )

  const sixHourlyTimestamps = Array.from({ length: sixHoursInDiff }, (_, i) =>
    from.add(i * 6, 'hours'),
  )

  const dailyTimestamps = Array.from({ length: daysInDiff }, (_, i) =>
    from.add(i, 'days'),
  )

  const hourlyReports = hourlyTimestamps.map((timestamp) =>
    fakeAssetReport(projectId, chainId, asset, type, timestamp),
  )

  const sixHourlyReports = sixHourlyTimestamps.map((timestamp) =>
    fakeAssetReport(projectId, chainId, asset, type, timestamp),
  )

  const dailyReports = dailyTimestamps.map((timestamp) =>
    fakeAssetReport(projectId, chainId, asset, type, timestamp),
  )

  return {
    from,
    to,
    hourlyReports,
    sixHourlyReports,
    dailyReports,
  }
}
