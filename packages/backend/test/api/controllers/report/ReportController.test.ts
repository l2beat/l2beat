import { Logger, mock } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import {
  AssetId,
  Chart,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { ReportController } from '../../../../src/api/controllers/report/ReportController'
import { AggregateReportRepository } from '../../../../src/peripherals/database/AggregateReportRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../../src/peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../../src/peripherals/database/ReportStatusRepository'

const START = UnixTime.fromDate(new Date('2022-05-31'))
const OPTIMISM = ProjectId('optimism')
const OPTIMISM_ADDRESS = EthereumAddress.random()
const USD = 1000_11n
const ETH = 1_111111n
const BALANCE = 111_1111n

describe(ReportController.name, () => {
  describe(ReportController.prototype.getProjectAssetChart.name, () => {
    it('returns undefined if project does not exist', async () => {
      const controller = new ReportController(
        mock<ReportStatusRepository>(),
        mock<AggregateReportRepository>(),
        mock<ReportRepository>(),
        [],
        [],
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(OPTIMISM, AssetId.DAI)
      expect(chart).toEqual(undefined)
    })

    it('returns undefined if asset does not exist', async () => {
      const controller = new ReportController(
        mock<ReportStatusRepository>(),
        mock<AggregateReportRepository>(),
        mock<ReportRepository>(),
        [
          {
            projectId: OPTIMISM,
            type: 'layer2',
            escrows: [
              {
                address: OPTIMISM_ADDRESS,
                sinceTimestamp: new UnixTime(0),
                tokens: [mockToken(AssetId.DAI, 'DAI')],
              },
            ],
          },
        ],
        [],
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(OPTIMISM, AssetId.DAI)
      expect(chart).toEqual(undefined)
    })

    it('returns reports', async () => {
      const controller = new ReportController(
        mock<ReportStatusRepository>({
          async findLatestTimestamp() {
            return START.add(-1, 'days')
          },
        }),
        mock<AggregateReportRepository>(),
        mock<ReportRepository>({
          getHourlyByProjectAndAsset: async () => [
            mockReport({ projectId: OPTIMISM, asset: AssetId.DAI }),
            mockReport({
              projectId: OPTIMISM,
              asset: AssetId.DAI,
              timestamp: START.add(1, 'hours'),
            }),
          ],
          getSixHourlyByProjectAndAsset: async () => [
            mockReport({ projectId: OPTIMISM, asset: AssetId.DAI }),
            mockReport({
              projectId: OPTIMISM,
              asset: AssetId.DAI,
              timestamp: START.add(6, 'hours'),
            }),
          ],
          getDailyByProjectAndAsset: async () => [
            mockReport({ projectId: OPTIMISM, asset: AssetId.DAI }),
            mockReport({
              projectId: OPTIMISM,
              asset: AssetId.DAI,
              timestamp: START.add(1, 'days'),
            }),
          ],
        }),
        [
          {
            projectId: OPTIMISM,
            type: 'layer2',
            escrows: [
              {
                address: OPTIMISM_ADDRESS,
                sinceTimestamp: new UnixTime(0),
                tokens: [mockToken(AssetId.DAI, 'DAI')],
              },
            ],
          },
        ],
        [mockToken(AssetId.DAI, 'DAI')],
        Logger.SILENT,
      )
      const types: Chart['types'] = ['timestamp', 'dai', 'usd']
      const balanceDai = 111.1111
      const balanceUsd = 1000.11
      const charts = await controller.getProjectAssetChart(
        OPTIMISM,
        AssetId.DAI,
      )
      expect(charts).toEqual({
        hourly: {
          types,
          data: [
            [START.add(-1, 'hours'), balanceDai, balanceUsd],
            [START, balanceDai, balanceUsd],
          ],
        },
        sixHourly: {
          types,
          data: [
            [START.add(-6, 'hours'), balanceDai, balanceUsd],
            [START, balanceDai, balanceUsd],
          ],
        },
        daily: {
          types,
          data: [
            [START.add(-1, 'days'), balanceDai, balanceUsd],
            [START, balanceDai, balanceUsd],
          ],
        },
      })
    })
  })
})

function mockToken(assetId: AssetId, symbol: string): TokenInfo {
  return {
    id: assetId,
    name: '',
    coingeckoId: CoingeckoId('-'),
    address: EthereumAddress.random(),
    symbol,
    decimals: 4,
    sinceTimestamp: new UnixTime(0),
    category: 'other',
  }
}

function mockReport(report: Partial<ReportRecord>): ReportRecord {
  return {
    balanceUsd: USD,
    balanceEth: ETH,
    balance: BALANCE,
    timestamp: START,
    asset: AssetId.DAI,
    projectId: ProjectId('fake'),
    ...report,
  }
}
