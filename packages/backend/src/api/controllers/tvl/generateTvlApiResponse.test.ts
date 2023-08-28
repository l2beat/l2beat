import {
  AssetId,
  ChainId,
  ProjectId,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  TvlApiToken,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'
import { generateTvlApiResponse } from './generateTvlApiResponse'

describe(generateTvlApiResponse.name, () => {
  it('returns the correct groupings', () => {
    const reports = fakeReports([
      ProjectId('arbitrum'),
      ProjectId('optimism'),
      ProjectId('avalanche'),
      ProjectId.ALL,
      ProjectId.BRIDGES,
      ProjectId.LAYER2S,
    ])
    const result = generateTvlApiResponse(
      reports.hourly.all,
      reports.sixHourly.all,
      reports.daily.all,
      reports.latest.all,
      [ProjectId('arbitrum'), ProjectId('optimism'), ProjectId('avalanche')],
    )

    console.dir({ result }, { depth: null })

    expect(result).toEqual({
      layers2s: charts(reports, ProjectId.LAYER2S),
      bridges: charts(reports, ProjectId.BRIDGES),
      combined: charts(reports, ProjectId.ALL),
      projects: {
        arbitrum: {
          charts: charts(reports, ProjectId('arbitrum')),
          tokens: reports.latest.arbitrum,
        },
        optimism: {
          charts: charts(reports, ProjectId('optimism')),
          tokens: reports.latest.optimism,
        },
        avalanche: {
          charts: charts(reports, ProjectId('avalanche')),
          tokens: reports.latest.avalanche,
        },
      },
    })
  })

  function charts(
    reports: ReturnType<typeof fakeReports>,
    projectId: ProjectId,
  ): TvlApiCharts {
    const types: TvlApiChart['types'] = ['timestamp', 'usd', 'eth']
    return {
      hourly: {
        types,
        data: reports.hourly[projectId.toString()],
      },
      sixHourly: {
        types,
        data: reports.sixHourly[projectId.toString()],
      },
      daily: {
        types: types,
        data: reports.daily[projectId.toString()],
      },
    }
  }

  function fakeReports(projectIds: ProjectId[]) {
    const now = UnixTime.now().toStartOf('day')

    return {
      hourly: fakeTimePeriodReports(now, 1, 1, projectIds),
      sixHourly: fakeTimePeriodReports(now, 6, 1, projectIds),
      daily: fakeTimePeriodReports(now, 24, 1, projectIds),
      latest: fakeLatestReports(now, projectIds),
    }
  }

  function fakeTimePeriodReports(
    now: UnixTime,
    offsetHours: number,
    count: number,
    projectIds: ProjectId[],
  ) {
    const result: Record<string, TvlApiChartPoint[]> & {
      all: AggregatedReportRecord[]
    } = {
      all: [],
    }
    for (const projectId of projectIds) {
      result[projectId.toString()] = []
    }
    for (let i = 0; i < count; i++) {
      const timestamp = now.add(-i * offsetHours, 'hours')
      for (const projectId of projectIds) {
        const usdValue = BigInt(Math.floor(Math.random() * 20_000 + 5_000))
        const ethValue = usdValue * 1000n
        const reportType = 'TVL'
        result.all.push({
          timestamp,
          projectId,
          usdValue,
          ethValue,
          reportType,
        })
        result[projectId.toString()].push([
          timestamp,
          asNumber(usdValue, 2),
          asNumber(ethValue, 6),
        ])
      }
    }
    return result
  }

  function fakeLatestReports(now: UnixTime, projectIds: ProjectId[]) {
    const assets = [AssetId.ETH, AssetId.DAI]
    const result: Record<string, TvlApiToken[]> & {
      all: ReportRecord[]
    } = {
      all: [],
    }
    for (const projectId of projectIds) {
      result[projectId.toString()] = []
    }
    for (const projectId of projectIds) {
      for (const assetId of assets) {
        const balanceUsd = BigInt(Math.floor(Math.random() * 20_000 + 5_000))
        result.all.push({
          asset: assetId,
          chainId: ChainId.ETHEREUM,
          reportType: 'CBV',
          amount: 0n, // ignored
          ethValue: 0n, // ignored
          usdValue: balanceUsd,
          projectId,
          timestamp: now,
        })
        result[projectId.toString()].push({
          assetId,
          tvl: asNumber(balanceUsd, 2),
        })
      }
    }
    return result
  }
})
