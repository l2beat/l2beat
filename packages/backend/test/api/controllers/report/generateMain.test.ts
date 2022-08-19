import {
  AssetId,
  ChartPoint,
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

const now = UnixTime.now().toStartOf('day')
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

function fakeReportsAndCharts(hours: number): {
  reports: AggregateReportRecord[]
  mainPoints: ChartPoint[]
  projectPoints: ChartPoint[]
} {
  const earliest = now.add(-2 * hours, 'hours')
  const before = now.add(-1 * hours, 'hours')
  const after = now.add(hours, 'hours')

  const reports = [
    {
      projectId: optimismId,
      timestamp: before,
      tvlEth: 1_000n,
      tvlUsd: 1_000n,
    },
    {
      projectId: arbitrumId,
      timestamp: before,
      tvlEth: 1_000n,
      tvlUsd: 1_000n,
    },
    {
      projectId: ProjectId.ALL,
      timestamp: before,
      tvlEth: 2_000n,
      tvlUsd: 2_000n,
    },
    {
      projectId: optimismId,
      timestamp: after,
      tvlEth: 2_000n,
      tvlUsd: 2_000n,
    },
    {
      projectId: arbitrumId,
      timestamp: after,
      tvlEth: 2_000n,
      tvlUsd: 2_000n,
    },
    {
      projectId: ProjectId.ALL,
      timestamp: after,
      tvlEth: 3_000n,
      tvlUsd: 3_000n,
    },
  ]

  const mainPoints: ChartPoint[] = [
    [earliest, 20, 0.002],
    [before, 20, 0.002],
    [now, 30, 0.003],
  ]

  const projectPoints: ChartPoint[] = [
    [earliest, 10, 0.001],
    [before, 10, 0.001],
    [now, 20, 0.002],
  ]

  return {
    reports,
    mainPoints,
    projectPoints,
  }
}

const hourly = fakeReportsAndCharts(1)
const sixHourly = fakeReportsAndCharts(6)
const daily = fakeReportsAndCharts(24)

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

describe(generateMain.name, () => {
  it('returns main', () => {
    expect(
      generateMain(
        hourly.reports,
        sixHourly.reports,
        daily.reports,
        tokenBreakdown,
        projects,
      ),
    ).toEqual({
      charts: {
        hourly: {
          types: ['timestamp', 'usd', 'eth'],
          data: hourly.mainPoints,
        },
        sixHourly: {
          types: ['timestamp', 'usd', 'eth'],
          data: sixHourly.mainPoints,
        },
        daily: {
          types: ['timestamp', 'usd', 'eth'],
          data: daily.mainPoints,
        },
      },
      projects: {
        arbitrum: {
          charts: {
            hourly: {
              types: ['timestamp', 'usd', 'eth'],
              data: hourly.projectPoints,
            },
            sixHourly: {
              types: ['timestamp', 'usd', 'eth'],
              data: sixHourly.projectPoints,
            },
            daily: {
              types: ['timestamp', 'usd', 'eth'],
              data: daily.projectPoints,
            },
          },
          tokens: [{ assetId: AssetId.DAI, tvl: 10 }],
        },
        optimism: {
          charts: {
            hourly: {
              types: ['timestamp', 'usd', 'eth'],
              data: hourly.projectPoints,
            },
            sixHourly: {
              types: ['timestamp', 'usd', 'eth'],
              data: sixHourly.projectPoints,
            },
            daily: {
              types: ['timestamp', 'usd', 'eth'],
              data: daily.projectPoints,
            },
          },
          tokens: [{ assetId: AssetId.DAI, tvl: 10 }],
        },
      },
    })
  })
})
