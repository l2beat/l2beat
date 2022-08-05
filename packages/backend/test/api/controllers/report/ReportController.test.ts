import {
  AssetId,
  Chart,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'

import { ReportController } from '../../../../src/api/controllers/report/ReportController'
import { Token } from '../../../../src/model'
import { ProjectInfo } from '../../../../src/model/ProjectInfo'
import { AggregateReportRepository } from '../../../../src/peripherals/database/AggregateReportRepository'
import { CachedDataRepository } from '../../../../src/peripherals/database/CachedDataRepository'
import { PriceRepository } from '../../../../src/peripherals/database/PriceRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../../src/peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../../src/peripherals/database/ReportStatusRepository'

const START = UnixTime.fromDate(new Date('2022-05-31'))
const ARBITRUM = ProjectId('arbitrum')
const OPTIMISM = ProjectId('optimism')
const ARBITRUM_ADDRESS = EthereumAddress.random()
const ARBITRUM_ADDRESS_2 = EthereumAddress.random()
const OPTIMISM_ADDRESS = EthereumAddress.random()
const USD = 1000_11n
const ETH = 1_111111n
const BALANCE = 111_1111n

describe(ReportController.name, () => {
  describe(ReportController.prototype.generateDaily.name, () => {
    const PROJECTS: ProjectInfo[] = [
      {
        projectId: ARBITRUM,
        name: 'Arbitrum',
        bridges: [
          {
            address: ARBITRUM_ADDRESS,
            sinceTimestamp: new UnixTime(0),
            tokens: [
              mockToken(AssetId.DAI, 'DAI'),
              mockToken(AssetId.WETH, 'WETH'),
            ],
          },
          {
            address: ARBITRUM_ADDRESS_2,
            sinceTimestamp: new UnixTime(0),
            tokens: [mockToken(AssetId.DAI, 'DAI')],
          },
        ],
      },
      {
        projectId: OPTIMISM,
        name: 'Optimism',
        bridges: [
          {
            address: OPTIMISM_ADDRESS,
            sinceTimestamp: new UnixTime(0),
            tokens: [mockToken(AssetId.DAI, 'DAI')],
          },
        ],
      },
    ]
    const TOKENS: Token[] = []
    const cachedRepository = mock<CachedDataRepository>({
      saveData: async () => 0,
    })
    const priceRepository = mock<PriceRepository>({
      getByToken: async (token) => {
        if (token === AssetId('op-optimism')) {
          return [mockPrice(token, 1, -1), mockPrice(token, 1, 0)]
        }
        if (token === AssetId.ETH) {
          return [mockPrice(token, 1500, -1), mockPrice(token, 1500, 0)]
        }
        return [mockPrice(token, 0, -1), mockPrice(token, 0, 0)]
      },
    })
    const reportStatusRepository = mock<ReportStatusRepository>()
    const aggregateReportRepository = mock<AggregateReportRepository>()

    it('happy case', async () => {
      const reportRepository = mock<ReportRepository>({
        getDaily: mockFn().returns([
          mockReport({ projectId: ARBITRUM, timestamp: START.add(-1, 'days') }),
          mockReport({ projectId: ARBITRUM }),
          mockReport({
            projectId: ARBITRUM,
            asset: AssetId.WETH,
            timestamp: START.add(-1, 'days'),
          }),
          mockReport({ projectId: ARBITRUM, asset: AssetId.WETH }),
          mockReport({ projectId: OPTIMISM, timestamp: START.add(-1, 'days') }),
          mockReport({ projectId: OPTIMISM }),
        ]),
      })

      const reportController = new ReportController(
        reportStatusRepository,
        aggregateReportRepository,
        reportRepository,
        cachedRepository,
        priceRepository,
        PROJECTS,
        TOKENS,
        Logger.SILENT,
      )

      const reports = await reportController.getReports()
      const result = await reportController.generateDaily(reports)

      expect(result).toEqual({
        aggregate: {
          types: ['date', 'usd', 'eth'],
          data: [
            ['2022-05-29', 214751364.33, 143168.909333],
            ['2022-05-30', 214751364.33, 143168.909333],
          ],
        },
        byProject: {
          ['Arbitrum']: {
            aggregate: {
              types: ['date', 'usd', 'eth'],
              data: [
                ['2022-05-29', 2000.22, 2.222222],
                ['2022-05-30', 2000.22, 2.222222],
              ],
            },
            byToken: {
              ['DAI']: {
                types: ['date', 'dai', 'usd'],
                data: [
                  ['2022-05-29', 111.1111, 1000.11],
                  ['2022-05-30', 111.1111, 1000.11],
                ],
              },
              ['WETH']: {
                types: ['date', 'weth', 'usd'],
                data: [
                  ['2022-05-29', 111.1111, 1000.11],
                  ['2022-05-30', 111.1111, 1000.11],
                ],
              },
            },
          },
          ['Optimism']: {
            aggregate: {
              types: ['date', 'usd', 'eth'],
              data: [
                ['2022-05-29', 214749364.11, 143166.687111],
                ['2022-05-30', 214749364.11, 143166.687111],
              ],
            },
            byToken: {
              ['DAI']: {
                types: ['date', 'dai', 'usd'],
                data: [
                  ['2022-05-29', 111.1111, 1000.11],
                  ['2022-05-30', 111.1111, 1000.11],
                ],
              },
              ['OP']: {
                types: ['date', 'op', 'usd'],
                data: [
                  ['2022-05-29', 214748364, 214748364],
                  ['2022-05-30', 214748364, 214748364],
                ],
              },
            },
          },
        },
      })
    })

    it('empty reports', async () => {
      const reportRepository = mock<ReportRepository>({
        getDaily: mockFn().returns([]),
      })
      const reportController = new ReportController(
        reportStatusRepository,
        aggregateReportRepository,
        reportRepository,
        cachedRepository,
        priceRepository,
        PROJECTS,
        TOKENS,
        Logger.SILENT,
      )
      const reports = await reportController.getReports()
      const result = await reportController.generateDaily(reports)

      expect(result).toEqual({
        aggregate: {
          types: ['date', 'usd', 'eth'],
          data: [],
        },
        byProject: {
          ['Arbitrum']: {
            aggregate: {
              types: ['date', 'usd', 'eth'],
              data: [],
            },
            byToken: {},
          },
          ['Optimism']: {
            aggregate: {
              types: ['date', 'usd', 'eth'],
              data: [],
            },
            byToken: {},
          },
        },
      })
    })
  })

  describe(ReportController.prototype.getProjectAssetChart.name, () => {
    it('returns undefined if project does not exist', async () => {
      const controller = new ReportController(
        mock<ReportStatusRepository>(),
        mock<AggregateReportRepository>(),
        mock<ReportRepository>(),
        mock<CachedDataRepository>(),
        mock<PriceRepository>(),
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

        mock<CachedDataRepository>(),
        mock<PriceRepository>(),
        [
          {
            projectId: OPTIMISM,
            name: 'Optimism',
            bridges: [
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
        mock<CachedDataRepository>(),
        mock<PriceRepository>(),
        [
          {
            projectId: OPTIMISM,
            name: 'Optimism',
            bridges: [
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

function mockPrice(token: AssetId, priceUsd: number, offset: number) {
  return { timestamp: START.add(offset, 'days'), assetId: token, priceUsd }
}
