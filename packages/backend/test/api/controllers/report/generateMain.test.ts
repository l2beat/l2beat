import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import { generateMain } from '../../../../src/api/controllers/report/generateMain'
import { ProjectInfo } from '../../../../src/model'
import { AggregateReportRecord } from '../../../../src/peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../../../src/peripherals/database/ReportRepository'

const now = UnixTime.now()
const yesterday = now.add(-1, 'days')
const tomorrow = now.add(1, 'days')

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

const arbitrumId = ProjectId('arbitrum')
const optimismId = ProjectId('optimism')
const daiToken = mockToken(AssetId.DAI, 'DAI')
const wethToken = mockToken(AssetId.WETH, 'WETH')
const projects: ProjectInfo[] = [
  {
    projectId: arbitrumId,
    name: 'Arbitrum',
    bridges: [
      {
        address: EthereumAddress.random(),
        sinceTimestamp: new UnixTime(0),
        tokens: [daiToken, wethToken],
      },
      {
        address: EthereumAddress.random(),
        sinceTimestamp: new UnixTime(0),
        tokens: [daiToken],
      },
    ],
  },
  {
    projectId: optimismId,
    name: 'Optimism',
    bridges: [
      {
        address: EthereumAddress.random(),
        sinceTimestamp: new UnixTime(0),
        tokens: [mockToken(AssetId.DAI, 'DAI')],
      },
    ],
  },
]

describe(generateMain.name, () => {
  it('returns main', () => {
    const aggregateReports: AggregateReportRecord[] = [
      {
        projectId: optimismId,
        timestamp: yesterday,
        tvlEth: 1_000n,
        tvlUsd: 1_000n,
      },
      {
        projectId: arbitrumId,
        timestamp: yesterday,
        tvlEth: 1_000n,
        tvlUsd: 1_000n,
      },
      {
        projectId: ProjectId.ALL,
        timestamp: yesterday,
        tvlEth: 2_000n,
        tvlUsd: 2_000n,
      },
      {
        projectId: optimismId,
        timestamp: tomorrow,
        tvlEth: 2_000n,
        tvlUsd: 2_000n,
      },
      {
        projectId: arbitrumId,
        timestamp: tomorrow,
        tvlEth: 2_000n,
        tvlUsd: 2_000n,
      },
      {
        projectId: ProjectId.ALL,
        timestamp: tomorrow,
        tvlEth: 3_000n,
        tvlUsd: 3_000n,
      },
    ]

    const tokenBreakdown: ReportRecord[] = [
      {
        asset: AssetId.DAI,
        projectId: arbitrumId,
        balance: 1_000n,
        balanceEth: 1_000n,
        balanceUsd: 1_000n,
        timestamp: tomorrow,
      },
      {
        asset: AssetId.DAI,
        projectId: optimismId,
        balance: 1_000n,
        balanceEth: 1_000n,
        balanceUsd: 1_000n,
        timestamp: tomorrow,
      },
    ]

    expect(generateMain(aggregateReports, tokenBreakdown, projects)).toEqual({
      charts: {
        daily: {
          types: ['timestamp', 'usd', 'eth'],
          data: [
            [yesterday, 20, 0.002],
            [now, 20, 0.002],
            [tomorrow, 30, 0.003],
          ],
        },
      },
      projects: {
        Arbitrum: {
          charts: {
            daily: {
              types: ['timestamp', 'usd', 'eth'],
              data: [
                [yesterday, 10, 0.001],
                [now, 10, 0.001],
                [tomorrow, 20, 0.002],
              ],
            },
          },
          tokens: [{ assetId: AssetId.DAI, tvl: 10 }],
        },
        Optimism: {
          charts: {
            daily: {
              types: ['timestamp', 'usd', 'eth'],
              data: [
                [yesterday, 10, 0.001],
                [now, 10, 0.001],
                [tomorrow, 20, 0.002],
              ],
            },
          },
          tokens: [{ assetId: AssetId.DAI, tvl: 10 }],
        },
      },
    })
  })
})
