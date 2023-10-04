import { Logger } from '@l2beat/backend-tools'
import { tokenList } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  Hash256,
  ProjectId,
  TvlApiChart,
  TvlApiCharts,
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

    it('returns reports', async () => {
      const baseReport: Omit<ReportRecord, 'timestamp'> = {
        usdValue: 1234_56n,
        ethValue: 1_111111n,
        amount: 111_1111n * 10n ** (18n - 4n),
        asset: AssetId.DAI,
        chainId: ChainId.ETHEREUM,
        projectId: OPTIMISM.projectId,
        reportType: 'CBV',
      }

      const controller = new TvlController(
        mockObject<ReportRepository>({
          getHourlyByProjectAndAsset: async () => [
            { ...baseReport, timestamp: START.add(-1, 'hours') },
            { ...baseReport, timestamp: START },
          ],
          getSixHourlyByProjectAndAsset: async () => [
            { ...baseReport, timestamp: START.add(-6, 'hours') },
            { ...baseReport, timestamp: START },
          ],
          getDailyByProjectAndAsset: async () => [
            { ...baseReport, timestamp: START.add(-1, 'days') },
            { ...baseReport, timestamp: START },
          ],
        }),
        mockObject<AggregatedReportRepository>(),
        aggregatedReportStatusRepository,
        [OPTIMISM],
        [DAI],
        Hash256.random(),
        {
          errorOnUnsyncedTvl: false,
        },
        Logger.SILENT,
      )
      const types: TvlApiChart['types'] = ['timestamp', 'dai', 'usd']
      const charts = (await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )) as unknown as { data: TvlApiCharts; result: 'success' }
      expect(charts).toEqual({
        result: 'success',
        data: {
          hourly: {
            types,
            data: [
              [START.add(-1, 'hours'), 111.1111, 1234.56],
              [START, 111.1111, 1234.56],
            ],
          },
          sixHourly: {
            types,
            data: [
              [START.add(-6, 'hours'), 111.1111, 1234.56],
              [START, 111.1111, 1234.56],
            ],
          },
          daily: {
            types,
            data: [
              [START.add(-1, 'days'), 111.1111, 1234.56],
              [START, 111.1111, 1234.56],
            ],
          },
        },
      })
    })
  })
})
