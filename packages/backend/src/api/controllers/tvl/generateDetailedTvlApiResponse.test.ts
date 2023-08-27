import {
  AssetId,
  ChainId,
  DetailedTvlApiChart,
  DetailedTvlApiCharts,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import {
  getProjectTokensCharts,
  groupByProjectIdAndAssetType,
  groupByProjectIdAndTimestamp,
} from './detailedTvl'
import {
  extractReportTypeSet,
  generateDetailedTvlApiResponse,
  getProjectChartData,
} from './generateDetailedTvlApiResponse'

describe(generateDetailedTvlApiResponse.name, () => {
  it('returns the correct groupings', () => {
    const reports = fakeReports([
      ProjectId('arbitrum'),
      ProjectId('optimism'),
      ProjectId('avalanche'),
      ProjectId.ALL,
      ProjectId.BRIDGES,
      ProjectId.LAYER2S,
    ])
    const result = generateDetailedTvlApiResponse(
      reports.hourly,
      reports.sixHourly,
      reports.daily,
      reports.latest,
      [ProjectId('arbitrum'), ProjectId('optimism'), ProjectId('avalanche')],
    )

    const expected = {
      layers2s: charts(reports, ProjectId.LAYER2S),
      bridges: charts(reports, ProjectId.BRIDGES),
      combined: charts(reports, ProjectId.ALL),
      projects: {
        arbitrum: {
          charts: charts(reports, ProjectId('arbitrum')),
          tokens: tokens(reports, ProjectId('arbitrum')),
        },
        optimism: {
          charts: charts(reports, ProjectId('optimism')),
          tokens: tokens(reports, ProjectId('optimism')),
        },
        avalanche: {
          charts: charts(reports, ProjectId('avalanche')),
          tokens: tokens(reports, ProjectId('avalanche')),
        },
      },
    }

    expect(result).toEqual(expected)
  })

  function charts(
    reports: ReturnType<typeof fakeReports>,
    projectId: ProjectId,
  ): DetailedTvlApiCharts {
    const types: DetailedTvlApiChart['types'] = [
      'timestamp',
      'valueUsd',
      'cbvUsd',
      'ebvUsd',
      'nmvUsd',
      'valueEth',
      'cbvEth',
      'ebvEth',
      'nmvEth',
    ]

    return {
      hourly: {
        types,
        data: getProjectChartData(reports.hourly, projectId),
      },
      sixHourly: {
        types,
        data: getProjectChartData(reports.sixHourly, projectId),
      },
      daily: {
        types,
        data: getProjectChartData(reports.daily, projectId),
      },
    }
  }

  function tokens(
    reports: ReturnType<typeof fakeReports>,
    projectId: ProjectId,
  ) {
    return getProjectTokensCharts(reports.latest, projectId)
  }

  function fakeReports(projectIds: ProjectId[]) {
    const now = UnixTime.now().toStartOf('day')

    return {
      hourly: groupByProjectIdAndTimestamp(
        fakeTimePeriodReports(now, 1, 1, projectIds),
      ),
      sixHourly: groupByProjectIdAndTimestamp(
        fakeTimePeriodReports(now, 6, 1, projectIds),
      ),
      daily: groupByProjectIdAndTimestamp(
        fakeTimePeriodReports(now, 24, 1, projectIds),
      ),
      latest: groupByProjectIdAndAssetType(fakeLatestReports(now, projectIds)),
    }
  }

  function fakeTimePeriodReports(
    now: UnixTime,
    offsetHours: number,
    count: number,
    projectIds: ProjectId[],
  ) {
    const result: AggregatedReportRecord[] = []

    for (let i = 0; i < count; i++) {
      const timestamp = now.add(-i * offsetHours, 'hours')
      for (const projectId of projectIds) {
        const usdEbv = BigInt(Math.floor(Math.random() * 20_000 + 5_000))
        const usdCbv = BigInt(Math.floor(Math.random() * 20_000 + 5_000))
        const usdNmv = BigInt(Math.floor(Math.random() * 20_000 + 5_000))

        const usdTvl = usdEbv + usdCbv + usdNmv

        const ethEbv = usdEbv * 1000n
        const ethCbv = usdCbv * 1000n
        const ethNmv = usdNmv * 1000n

        const ethTvl = ethEbv + ethCbv + ethNmv

        result.push({
          timestamp,
          projectId,
          usdValue: usdEbv,
          ethValue: ethEbv,
          reportType: 'EBV',
        })

        result.push({
          timestamp,
          projectId,
          usdValue: usdCbv,
          ethValue: ethCbv,
          reportType: 'CBV',
        })

        result.push({
          timestamp,
          projectId,
          usdValue: usdNmv,
          ethValue: ethNmv,
          reportType: 'NMV',
        })

        result.push({
          timestamp,
          projectId,
          usdValue: usdTvl,
          ethValue: ethTvl,
          reportType: 'TVL',
        })
      }
    }
    return result
  }

  function fakeLatestReports(now: UnixTime, projectIds: ProjectId[]) {
    const assets = [AssetId.ETH, AssetId.DAI]
    const result: ReportRecord[] = []
    for (const projectId of projectIds) {
      for (const assetId of assets) {
        const balanceUsd = BigInt(Math.floor(Math.random() * 20_000 + 5_000))
        result.push({
          asset: assetId,
          chainId: ChainId.ARBITRUM, // ignored - not grouped
          reportType: 'CBV',
          amount: 0n, // ignored
          ethValue: 0n, // ignored
          usdValue: balanceUsd,
          projectId,
          timestamp: now,
        })
      }
    }
    return result
  }
})

describe(extractReportTypeSet.name, () => {
  it('fills in missing values', () => {
    const timestamp = UnixTime.now()
    const usdValue = 1_000n
    const ethValue = 1_000_000n

    const filledUsdValue = 0n
    const filledEthValue = 0n

    // NMV missing
    const mockReports: AggregatedReportRecord[] = [
      {
        timestamp,
        projectId: ProjectId.ARBITRUM,
        usdValue,
        ethValue,
        reportType: 'TVL',
      },
      {
        timestamp,
        projectId: ProjectId.ARBITRUM,
        usdValue,
        ethValue,
        reportType: 'CBV',
      },
      {
        timestamp,
        projectId: ProjectId.ARBITRUM,
        usdValue,
        ethValue,
        reportType: 'EBV',
      },
    ]

    const result = extractReportTypeSet(mockReports)

    expect(result).toEqual({
      ebvReport: {
        usdValue,
        ethValue,
      },
      cbvReport: {
        usdValue,
        ethValue,
      },
      tvlReport: {
        usdValue,
        ethValue,
      },
      nmvReport: {
        usdValue: filledUsdValue,
        ethValue: filledEthValue,
      },
    })
  })
})
