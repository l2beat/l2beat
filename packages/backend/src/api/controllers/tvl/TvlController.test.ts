import { tokenList } from '@l2beat/config'
import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  EthereumAddress,
  Hash256,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../../peripherals/database/AggregatedReportStatusRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../peripherals/database/ReportRepository'
import { TvlController } from './TvlController'

const START = UnixTime.fromDate(new Date('2022-05-31'))
const DAI = tokenList.find((x) => x.symbol === 'DAI')!
const USDC = tokenList.find((x) => x.symbol === 'USDC')!

const OPTIMISM: ReportProject = {
  projectId: ProjectId('optimism'),
  type: 'layer2',
  escrows: [
    {
      address: EthereumAddress.random(),
      sinceTimestamp: new UnixTime(0),
      tokens: [DAI],
    },
  ],
}

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

describe(TvlController.name, () => {
  describe(TvlController.prototype.getProjectAssetChart.name, () => {
    const aggregatedReportStatusRepository =
      mockObject<AggregatedReportStatusRepository>({
        findLatestTimestamp: async () => START,
        findCountsForHash: async () => ({
          isSynced: true,
          latestTimestamp: START,
          matching: 100, // doesn't matter
          different: 0,
        }),
      })

    it('returns undefined if project does not exist', async () => {
      const controller = new TvlController(
        mockObject<ReportRepository>(),
        mockObject<AggregatedReportRepository>(),
        aggregatedReportStatusRepository,
        [],
        [],
        Hash256.random(),
        {
          errorOnUnsyncedTvl: false,
        },
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(chart).toEqual({
        result: 'error',
        error: 'INVALID_PROJECT_OR_ASSET',
      })
    })

    it('returns undefined if asset does not exist', async () => {
      const controller = new TvlController(
        mockObject<ReportRepository>(),
        mockObject<AggregatedReportRepository>(),
        aggregatedReportStatusRepository,
        [OPTIMISM],
        [],
        Hash256.random(),
        {
          errorOnUnsyncedTvl: false,
        },
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(chart).toEqual({
        result: 'error',
        error: 'INVALID_PROJECT_OR_ASSET',
      })
    })
  })

  describe(TvlController.prototype.getTvlApiResponse.name, () => {
    it('return full chart data', async () => {
      const usdcReport: Omit<ReportRecord, 'timestamp'> = {
        usdValue: 1234_56n,
        ethValue: 1_111111n,
        amount: 111_1111n * 10n ** (6n - 4n),
        asset: AssetId.USDC,
        chainId: ChainId.ETHEREUM,
        projectId: ARBITRUM.projectId,
        reportType: 'CBV',
      }

      const daiReport: Omit<ReportRecord, 'timestamp'> = {
        usdValue: 1234_56n,
        ethValue: 1_111111n,
        amount: 111_1111n * 10n ** (6n - 4n),
        asset: AssetId.DAI,
        chainId: ChainId.ETHEREUM,
        projectId: ARBITRUM.projectId,
        reportType: 'CBV',
      }

      const reportRepository = mockObject<ReportRepository>({
        getByTimestamp: async () => [
          { ...usdcReport, timestamp: START },
          { ...daiReport, timestamp: START },
        ],
      })
      const aggregateRepository = mockObject<AggregatedReportRepository>({
        getDaily: async () => [],
        getHourly: async () => [],
        getSixHourly: async () => [],
      })

      const aggregatedReportStatusRepository =
        mockObject<AggregatedReportStatusRepository>({
          findLatestTimestamp: async () => START,
          findCountsForHash: async () => ({
            isSynced: true,
            latestTimestamp: START,
            matching: 100, // doesn't matter
            different: 0,
          }),
        })

      const controller = new TvlController(
        reportRepository,
        aggregateRepository,
        aggregatedReportStatusRepository,
        [ARBITRUM],
        [USDC],
        Hash256.random(),
        {
          errorOnUnsyncedTvl: false,
        },
        Logger.SILENT,
      )

      const charts = await controller.getTvlApiResponse()

      assert(charts.result === 'success')

      expect(charts.data.projects.arbitrum?.tokens).toEqual([
        {
          assetId: AssetId.USDC,
          tvl: 1234.56,
        },
        {
          assetId: AssetId.DAI,
          tvl: 1234.56,
        },
      ])

      // Empty response check
      expect(charts.data.bridges.hourly.data.length).toEqual(168)
      expect(charts.data.bridges.sixHourly.data.length).toEqual(360)
      expect(charts.data.bridges.daily.data.length).toEqual(929)

      expect(charts.data.combined.hourly.data.length).toEqual(168)
      expect(charts.data.combined.sixHourly.data.length).toEqual(360)
      expect(charts.data.combined.daily.data.length).toEqual(929)

      expect(charts.data.layers2s.hourly.data.length).toEqual(168)
      expect(charts.data.layers2s.sixHourly.data.length).toEqual(360)
      expect(charts.data.layers2s.daily.data.length).toEqual(929)
    })
  })
})
