import { tokenList } from '@l2beat/config'
import { Logger } from '@l2beat/shared'
import {
  AssetId,
  EthereumAddress,
  ProjectId,
  TvlApiChart,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRepository } from '../../../peripherals/database/AggregatedReportRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
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
    it('returns undefined if project does not exist', async () => {
      const controller = new TvlController(
        mockObject<ReportStatusRepository>(),
        mockObject<AggregatedReportRepository>(),
        mockObject<ReportRepository>(),
        [],
        [],
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(chart).toEqual(undefined)
    })

    it('returns undefined if asset does not exist', async () => {
      const controller = new TvlController(
        mockObject<ReportStatusRepository>(),
        mockObject<AggregatedReportRepository>(),
        mockObject<ReportRepository>(),
        [OPTIMISM],
        [],
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(chart).toEqual(undefined)
    })

    it('returns reports', async () => {
      const baseReport: Omit<ReportRecord, 'timestamp'> = {
        usdValue: 1234_56n,
        ethValue: 1_111111n,
        amount: 111_1111n * 10n ** (18n - 4n),
        asset: AssetId.DAI,
        projectId: OPTIMISM.projectId,
        type: ValueType.CBV,
      }

      const controller = new TvlController(
        mockObject<ReportStatusRepository>({
          async findLatestTimestamp() {
            return START
          },
        }),
        mockObject<AggregatedReportRepository>(),
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
        [OPTIMISM],
        [DAI],
        Logger.SILENT,
      )
      const types: TvlApiChart['types'] = ['timestamp', 'dai', 'usd']
      const charts = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(charts).toEqual({
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
      })
    })
  })
})
