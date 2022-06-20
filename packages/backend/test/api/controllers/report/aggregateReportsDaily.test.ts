import { AssetId, CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import {
  aggregateReportsDaily,
  saveBalancesToEntry,
} from '../../../../src/api/controllers/report/aggregateReportsDaily'
import { ProjectInfo } from '../../../../src/model/ProjectInfo'
import { ReportRecord } from '../../../../src/peripherals/database/ReportRepository'
import { mockEntry } from './addOptimismToken.test'

describe(aggregateReportsDaily.name, () => {
  const TODAY = UnixTime.now().toStartOf('day')
  const ARBITRUM = EthereumAddress.random()
  const ARBITRUM_2 = EthereumAddress.random()
  const OPTIMISM = EthereumAddress.random()
  const USD = 1000n
  const ETH = 1n
  const BALANCE = 1000n

  function mockReport(bridge: EthereumAddress, asset: AssetId, offset: number) {
    return {
      timestamp: TODAY.add(offset, 'days'),
      bridge,
      asset,
      blockNumber: 0n,
      balanceUsd: USD,
      balanceEth: ETH,
      balance: BALANCE,
    }
  }

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

  it('one project one bridge one token', () => {
    const reports = [
      mockReport(ARBITRUM, AssetId.DAI, -1),
      mockReport(ARBITRUM, AssetId.DAI, 0),
    ]

    const result = aggregateReportsDaily(reports, PROJECTS)

    expect(result).toEqual([
      {
        timestamp: TODAY.add(-1, 'days'),
        value: { usd: USD, eth: ETH },
        projects: new Map([
          [
            'Arbitrum',
            {
              value: { usd: USD, eth: ETH },
              tokens: new Map([
                [
                  'DAI',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 0,
                  },
                ],
              ]),
            },
          ],
        ]),
      },
      {
        timestamp: TODAY,
        value: { usd: USD, eth: ETH },
        projects: new Map([
          [
            'Arbitrum',
            {
              value: { usd: USD, eth: ETH },
              tokens: new Map([
                [
                  'DAI',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 0,
                  },
                ],
              ]),
            },
          ],
        ]),
      },
    ])
  })

  it('multiple projects with multiple bridges', () => {
    const reports = [
      mockReport(ARBITRUM, AssetId.DAI, -1),
      mockReport(ARBITRUM, AssetId.DAI, 0),

      mockReport(ARBITRUM, AssetId.WETH, -1),
      mockReport(ARBITRUM, AssetId.WETH, 0),

      mockReport(ARBITRUM_2, AssetId.DAI, -1),
      mockReport(ARBITRUM_2, AssetId.DAI, 0),

      mockReport(OPTIMISM, AssetId.DAI, -1),
      mockReport(OPTIMISM, AssetId.DAI, 0),
    ]

    const result = aggregateReportsDaily(reports, PROJECTS)

    expect(result).toEqual([
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
                  'DAI',
                  {
                    usd: 2n * USD,
                    eth: 2n * ETH,
                    balance: 2n * BALANCE,
                    decimals: 0,
                  },
                ],
                [
                  'WETH',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 0,
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
                  'DAI',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 0,
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
                  'DAI',
                  {
                    usd: 2n * USD,
                    eth: 2n * ETH,
                    balance: 2n * BALANCE,
                    decimals: 0,
                  },
                ],
                [
                  'WETH',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 0,
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
                  'DAI',
                  {
                    usd: USD,
                    eth: ETH,
                    balance: BALANCE,
                    decimals: 0,
                  },
                ],
              ]),
            },
          ],
        ]),
      },
    ])
  })

  it('empty reports', async () => {
    const reports: ReportRecord[] = []

    const result = aggregateReportsDaily(reports, PROJECTS)

    expect(result).toEqual([])
  })
})

describe(saveBalancesToEntry.name, () => {
  it('happy path', () => {
    const projectName = 'Optimism'
    const symbol = 'OP'
    const decimals = 18
    const usdTVL = 1500n
    const ethTVL = 1n
    const balance = 10n
    const entry = mockEntry({}, projectName)

    saveBalancesToEntry(
      entry,
      projectName,
      usdTVL,
      ethTVL,
      balance,
      symbol,
      decimals,
    )

    const tokens = new Map()
    tokens.set(symbol, {
      usd: usdTVL,
      eth: ethTVL,
      balance,
      decimals,
    })
    const projects = new Map()
    projects.set(projectName, {
      value: {
        usd: usdTVL,
        eth: ethTVL,
      },
      tokens,
    })

    expect(entry).toEqual({
      timestamp: entry.timestamp,
      value: {
        usd: usdTVL,
        eth: ethTVL,
      },
      projects,
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
    sinceBlock: 0,
    category: 'other',
  }
}
