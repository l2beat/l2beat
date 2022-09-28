import {
  AssetId,
  MainChart,
  MainChartPoint,
  MainCharts,
  MainToken,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { asNumber } from '../../../../src/api/controllers/report/asNumber'
import { generateMain } from '../../../../src/api/controllers/report/generateMain'
import { AggregateReportRecord } from '../../../../src/peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../../../src/peripherals/database/ReportRepository'

describe(generateMain.name, () => {
  it('returns the correct groupings', () => {
    const reports = fakeReports([
      ProjectId('arbitrum'),
      ProjectId('optimism'),
      ProjectId('avalanche'),
      ProjectId.ALL,
      ProjectId.BRIDGES,
      ProjectId.LAYER2S,
    ])
    const result = generateMain(
      reports.hourly.all,
      reports.sixHourly.all,
      reports.daily.all,
      reports.latest.all,
      [ProjectId('arbitrum'), ProjectId('optimism'), ProjectId('avalanche')],
    )
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
  ): MainCharts {
    const types: MainChart['types'] = ['timestamp', 'usd', 'eth']
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
    const result: Record<string, MainChartPoint[]> & {
      all: AggregateReportRecord[]
    } = {
      all: [],
    }
    for (const projectId of projectIds) {
      result[projectId.toString()] = []
    }
    for (let i = 0; i < count; i++) {
      const timestamp = now.add(-i * offsetHours, 'hours')
      for (const projectId of projectIds) {
        const tvlUsd = BigInt(Math.floor(Math.random() * 20_000 + 5_000))
        const tvlEth = tvlUsd * 1000n
        result.all.push({ timestamp, projectId, tvlUsd, tvlEth })
        result[projectId.toString()].push([
          timestamp,
          asNumber(tvlUsd, 2),
          asNumber(tvlEth, 6),
        ])
      }
    }
    return result
  }

  function fakeLatestReports(now: UnixTime, projectIds: ProjectId[]) {
    const assets = [AssetId.ETH, AssetId.DAI]
    const result: Record<string, MainToken[]> & { all: ReportRecord[] } = {
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
          balance: 0n, // ignored
          balanceEth: 0n, // ignored
          balanceUsd,
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
