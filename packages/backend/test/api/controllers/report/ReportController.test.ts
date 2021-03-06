import {
  AssetId,
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
import { CachedDataRepository } from '../../../../src/peripherals/database/CachedDataRepository'
import { PriceRepository } from '../../../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../../../src/peripherals/database/ReportRepository'

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
    it('happy case', async () => {
      const reportRepository = mock<ReportRepository>({
        getDaily: mockFn().returns([
          mockReport(ARBITRUM, AssetId.DAI, -1),
          mockReport(ARBITRUM, AssetId.DAI, 0),

          mockReport(ARBITRUM, AssetId.WETH, -1),
          mockReport(ARBITRUM, AssetId.WETH, 0),

          mockReport(OPTIMISM, AssetId.DAI, -1),
          mockReport(OPTIMISM, AssetId.DAI, 0),
        ]),
      })

      const reportController = new ReportController(
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

  describe(ReportController.prototype.generateMain.name, () => {
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
    it('happy case', async () => {
      const reportRepository = mock<ReportRepository>({
        getDaily: mockFn().returns([
          mockReport(ARBITRUM, AssetId.DAI, -1),
          mockReport(ARBITRUM, AssetId.DAI, 0),

          mockReport(ARBITRUM, AssetId.WETH, -1),
          mockReport(ARBITRUM, AssetId.WETH, 0),

          mockReport(ARBITRUM, AssetId.DAI, -1),
          mockReport(ARBITRUM, AssetId.DAI, 0),

          mockReport(OPTIMISM, AssetId.DAI, -1),
          mockReport(OPTIMISM, AssetId.DAI, 0),
        ]),
      })

      const reportController = new ReportController(
        reportRepository,
        cachedRepository,
        priceRepository,
        PROJECTS,
        [],
        Logger.SILENT,
      )

      const reports = await reportController.getReports()
      const result = await reportController.generateMain(reports)

      const TIME_0 = UnixTime.fromDate(new Date('2022-05-29'))
      const TIME_1 = UnixTime.fromDate(new Date('2022-05-30'))

      expect(result).toEqual({
        charts: {
          daily: {
            types: ['timestamp', 'usd', 'eth'],
            data: [
              [TIME_0, 214752364.44, 143170.020444],
              [TIME_1, 214752364.44, 143170.020444],
            ],
          },
        },
        projects: {
          Arbitrum: {
            charts: {
              daily: {
                types: ['timestamp', 'usd', 'eth'],
                data: [
                  [TIME_0, 3000.33, 3.333333],
                  [TIME_1, 3000.33, 3.333333],
                ],
              },
            },
            tokens: [
              {
                assetId: AssetId.DAI,
                tvl: 2000.22,
              },
              {
                assetId: AssetId.WETH,
                tvl: 1000.11,
              },
            ],
          },
          Optimism: {
            charts: {
              daily: {
                types: ['timestamp', 'usd', 'eth'],
                data: [
                  [TIME_0, 214749364.11, 143166.687111],
                  [TIME_1, 214749364.11, 143166.687111],
                ],
              },
            },
            tokens: [
              {
                assetId: AssetId.DAI,
                tvl: 1000.11,
              },
              {
                assetId: AssetId('op-optimism'),
                tvl: 214748364,
              },
            ],
          },
        },
      })
    })

    it('empty reports', async () => {
      const reportRepository = mock<ReportRepository>({
        getDaily: mockFn().returns([]),
      })
      const reportController = new ReportController(
        reportRepository,
        cachedRepository,
        priceRepository,
        PROJECTS,
        [],
        Logger.SILENT,
      )
      const reports = await reportController.getReports()
      const result = await reportController.generateMain(reports)

      expect(result).toEqual({
        charts: {
          daily: {
            types: ['timestamp', 'usd', 'eth'],
            data: [],
          },
        },
        projects: {
          Arbitrum: {
            charts: {
              daily: {
                types: ['timestamp', 'usd', 'eth'],
                data: [],
              },
            },
            tokens: [],
          },
          Optimism: {
            charts: {
              daily: {
                types: ['timestamp', 'usd', 'eth'],
                data: [],
              },
            },
            tokens: [],
          },
        },
      })
    })
  })

  describe(ReportController.prototype.getProjectAssetChart.name, () => {
    it('returns undefined if project does not exist', async () => {
      const controller = new ReportController(
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
        mock<ReportRepository>({
          getDailyByProjectAndAsset: async () => [
            mockReport(OPTIMISM, AssetId.DAI, 0),
            mockReport(OPTIMISM, AssetId.DAI, 1),
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
      const chart = await controller.getProjectAssetChart(OPTIMISM, AssetId.DAI)
      expect(chart).toEqual({
        types: ['timestamp', 'dai', 'usd'],
        data: [
          [new UnixTime(1653955200), 111.1111, 1000.11],
          [new UnixTime(1654041600), 111.1111, 1000.11],
        ],
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

function mockReport(projectId: ProjectId, asset: AssetId, offset: number) {
  return {
    timestamp: START.add(offset, 'days'),
    projectId,
    asset,
    blockNumber: 0n,
    balanceUsd: USD,
    balanceEth: ETH,
    balance: BALANCE,
  }
}

function mockPrice(token: AssetId, priceUsd: number, offset: number) {
  return { timestamp: START.add(offset, 'days'), assetId: token, priceUsd }
}
