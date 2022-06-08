import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'

import { ReportController } from '../../../../src/api/controllers/report/ReportController'
import { ProjectInfo } from '../../../../src/model/ProjectInfo'
import { CachedDataRepository } from '../../../../src/peripherals/database/CachedDataRepository'
import { ReportRepository } from '../../../../src/peripherals/database/ReportRepository'

describe(ReportController.name, () => {
  const START = UnixTime.fromDate(new Date('2022-05-05'))
  const ARBITRUM = EthereumAddress.random()
  const ARBITRUM_2 = EthereumAddress.random()
  const OPTIMISM = EthereumAddress.random()
  const USD = 1000_11n
  const ETH = 1_111111n
  const BALANCE = 111_1111n

  function mockReport(bridge: EthereumAddress, asset: AssetId, offset: number) {
    return {
      timestamp: START.add(offset, 'days'),
      bridge,
      asset,
      blockNumber: 0n,
      usdTVL: USD,
      ethTVL: ETH,
      balance: BALANCE,
    }
  }

  describe(ReportController.prototype.generateDaily.name, () => {
    const PROJECTS: ProjectInfo[] = [
      {
        name: 'Arbitrum',
        bridges: [
          {
            address: ARBITRUM.toString(),
            sinceBlock: 0,
            tokens: [
              mockToken(AssetId.DAI, 'DAI'),
              mockToken(AssetId.WETH, 'WETH'),
            ],
          },
          {
            address: ARBITRUM_2.toString(),
            sinceBlock: 0,
            tokens: [mockToken(AssetId.DAI, 'DAI')],
          },
        ],
      },
      {
        name: 'Optimism',
        bridges: [
          {
            address: OPTIMISM.toString(),
            sinceBlock: 0,
            tokens: [mockToken(AssetId.DAI, 'DAI')],
          },
        ],
      },
    ]
    it('happy case', async () => {
      const reportRepository = mock<ReportRepository>({
        getDaily: mockFn().returns([
          mockReport(ARBITRUM, AssetId.DAI, -1),
          mockReport(ARBITRUM, AssetId.DAI, 0),

          mockReport(ARBITRUM, AssetId.WETH, -1),
          mockReport(ARBITRUM, AssetId.WETH, 0),

          mockReport(ARBITRUM_2, AssetId.DAI, -1),
          mockReport(ARBITRUM_2, AssetId.DAI, 0),

          mockReport(OPTIMISM, AssetId.DAI, -1),
          mockReport(OPTIMISM, AssetId.DAI, 0),
        ]),
      })

      const cachedRepository = mock<CachedDataRepository>({
        saveData: async () => {},
      })
      const reportController = new ReportController(
        reportRepository,
        cachedRepository,
        PROJECTS,
        Logger.SILENT
      )

      const result = await reportController.generateDaily()

      expect(result).toEqual({
        aggregate: {
          types: ['date', 'usd', 'eth'],
          data: [
            ['2022-05-04', 4000.44, 4.444444],
            ['2022-05-05', 4000.44, 4.444444],
          ],
        },
        byProject: {
          ['Arbitrum']: {
            aggregate: {
              types: ['date', 'usd', 'eth'],
              data: [
                ['2022-05-04', 3000.33, 3.333333],
                ['2022-05-05', 3000.33, 3.333333],
              ],
            },
            byToken: {
              ['DAI']: {
                types: ['date', 'dai', 'usd'],
                data: [
                  ['2022-05-04', 222.2222, 2000.22],
                  ['2022-05-05', 222.2222, 2000.22],
                ],
              },
              ['WETH']: {
                types: ['date', 'weth', 'usd'],
                data: [
                  ['2022-05-04', 111.1111, 1000.11],
                  ['2022-05-05', 111.1111, 1000.11],
                ],
              },
            },
          },
          ['Optimism']: {
            aggregate: {
              types: ['date', 'usd', 'eth'],
              data: [
                ['2022-05-04', 1000.11, 1.111111],
                ['2022-05-05', 1000.11, 1.111111],
              ],
            },
            byToken: {
              ['DAI']: {
                types: ['date', 'dai', 'usd'],
                data: [
                  ['2022-05-04', 111.1111, 1000.11],
                  ['2022-05-05', 111.1111, 1000.11],
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
      const cachedRepository = mock<CachedDataRepository>({
        saveData: async () => {},
      })
      const reportController = new ReportController(
        reportRepository,
        cachedRepository,
        PROJECTS,
        Logger.SILENT
      )
      const result = await reportController.generateDaily()

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
})

function mockToken(assetId: AssetId, symbol: string): TokenInfo {
  return {
    id: assetId,
    name: '',
    coingeckoId: CoingeckoId('-'),
    address: EthereumAddress.random(),
    symbol,
    decimals: 4,
    sinceBlock: 0,
    category: 'other',
  }
}
