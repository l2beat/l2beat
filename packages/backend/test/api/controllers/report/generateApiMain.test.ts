import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import { OutputEntryV2 } from '../../../../src/api/controllers/report/aggregateReportsDaily'
import { generateApiMain } from '../../../../src/api/controllers/report/generateReportOutput'
import { ProjectInfo } from '../../../../src/model'

describe(generateApiMain.name, () => {
  const TODAY = UnixTime.fromDate(new Date('2022-05-05T00:00:00Z'))
  const USD = 1000_11n
  const ETH = 1_111111n
  const BALANCE = 1111111n

  const ARBITRUM = ProjectId('arbitrum')
  const OPTIMISM = ProjectId('optimism')

  const ARBITRUM_ADDRESS = EthereumAddress.random()
  const ARBITRUM_ADDRESS_2 = EthereumAddress.random()
  const OPTIMISM_ADDRESS = EthereumAddress.random()

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

  it('converts to compatible interface', async () => {
    const entries: OutputEntryV2[] = [
      {
        timestamp: TODAY.add(-1, 'days'),
        value: { usd: 4n * USD, eth: 4n * ETH },
        projects: new Map([
          [
            'Arbitrum',
            {
              value: { usd: 3n * USD, eth: 3n * ETH },
              tokens: new Map([
                [
                  AssetId.DAI,
                  {
                    usd: 2n * USD,
                    eth: 2n * ETH,
                    balance: 2n * BALANCE,
                    decimals: 4,
                  },
                ],
                [
                  AssetId.WETH,
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 6,
                  },
                ],
              ]),
            },
          ],
          [
            'Optimism',
            {
              value: { usd: USD, eth: ETH },
              tokens: new Map([
                [
                  AssetId.DAI,
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 4,
                  },
                ],
              ]),
            },
          ],
        ]),
      },
      {
        timestamp: TODAY,
        value: { usd: 4n * USD, eth: 4n * ETH },
        projects: new Map([
          [
            'Arbitrum',
            {
              value: { usd: 3n * USD, eth: 3n * ETH },
              tokens: new Map([
                [
                  AssetId.DAI,
                  {
                    usd: 2n * USD,
                    eth: 2n * ETH,
                    balance: 2n * BALANCE,
                    decimals: 4,
                  },
                ],
                [
                  AssetId.WETH,
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 6,
                  },
                ],
              ]),
            },
          ],
          [
            'Optimism',
            {
              value: { usd: USD, eth: ETH },
              tokens: new Map([
                [
                  AssetId.DAI,
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 4,
                  },
                ],
              ]),
            },
          ],
        ]),
      },
    ]

    const result = generateApiMain(entries, PROJECTS)

    const TIME_0 = UnixTime.fromDate(new Date('2022-05-03'))
    const TIME_1 = UnixTime.fromDate(new Date('2022-05-04'))

    expect(result).toEqual({
      charts: {
        daily: {
          types: ['timestamp', 'usd', 'eth'],
          data: [
            [TIME_0, 4000.44, 4.444444],
            [TIME_1, 4000.44, 4.444444],
          ],
        },
      },
      projects: {
        ['Arbitrum']: {
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
                [TIME_0, 1000.11, 1.111111],
                [TIME_1, 1000.11, 1.111111],
              ],
            },
          },
          tokens: [
            {
              assetId: AssetId.DAI,
              tvl: 1000.11,
            },
          ],
        },
      },
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
    decimals: 0,
    sinceTimestamp: new UnixTime(0),
    category: 'other',
  }
}
