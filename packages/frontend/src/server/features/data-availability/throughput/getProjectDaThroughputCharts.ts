import { UnixTime } from '@l2beat/shared-pure'
import type { v } from '@l2beat/validate'
import { env } from '~/env'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'
import {
  type DaThroughputChartDataPoint,
  getDaThroughputChartByProjectData,
} from './getDaThroughputChartByProject'
import { getDaThroughputTable } from './getDaThroughputTable'
import {
  getProjectDaThroughputChartData,
  ProjectDaThroughputChartParams,
  type ProjectDaThroughputChartPoint,
} from './getProjectDaThroughputChart'
import { rangeToResolution } from './utils/range'

export type getProjectDaThroughputChartsData = {
  totalChart: {
    data: ProjectDaThroughputChartPoint[]
    range: [UnixTime | null, UnixTime]
  }
  byProjectChart: {
    data: DaThroughputChartDataPoint[]
  }
  stats: {
    pastDayAvgCapacityUtilization: number | undefined | null
    pastDayAvgThroughputPerSecond: number | undefined
    largestPoster:
      | {
          name: string
          percentage: number
          totalPosted: number
          href: string | undefined
        }
      | undefined
    totalPosted: number | undefined
  }
  syncedUntil: UnixTime
}

export const ProjectDaThroughputChartDataParams = ProjectDaThroughputChartParams
export type ProjectDaThroughputChartDataParams = v.infer<
  typeof ProjectDaThroughputChartDataParams
>

export async function getProjectDaThroughputCharts(
  params: ProjectDaThroughputChartDataParams,
): Promise<getProjectDaThroughputChartsData | undefined> {
  if (env.MOCK) {
    return getMockProjectDaThroughputCharts(params)
  }

  const resolution = rangeToResolution(params.range)

  const [totalChartData, byProjectChartData, throughputTable] =
    await Promise.all([
      getProjectDaThroughputChartData(params),
      getDaThroughputChartByProjectData(params),
      getDaThroughputTable([params.projectId]),
    ])
  const projectData = params.includeScalingOnly
    ? throughputTable.scalingOnlyData[params.projectId]
    : throughputTable.data[params.projectId]

  if (!totalChartData || !byProjectChartData || !projectData) {
    return undefined
  }

  const from = Math.min(totalChartData.from, byProjectChartData.from)
  const to = Math.max(totalChartData.to, byProjectChartData.to)

  const timestamps = generateTimestamps([from, to], resolution)

  const totalChart: ProjectDaThroughputChartPoint[] = timestamps.map(
    (timestamp) => {
      const posted =
        timestamp <= totalChartData.maxTimestamp
          ? (totalChartData.grouped[timestamp] ?? 0)
          : null
      return [timestamp, posted]
    },
  )

  const byProjectChart: DaThroughputChartDataPoint[] = timestamps.map(
    (timestamp) => {
      const values = byProjectChartData.grouped[timestamp] ?? null
      return [timestamp, values]
    },
  )

  return {
    totalChart: {
      data: totalChart,
      range: [from, to],
    },
    byProjectChart: {
      data: byProjectChart,
    },
    syncedUntil: Math.min(
      totalChartData.syncedUntil,
      byProjectChartData.syncedUntil,
    ),
    stats: {
      pastDayAvgCapacityUtilization:
        projectData.pastDayData?.avgCapacityUtilization,
      pastDayAvgThroughputPerSecond:
        projectData.pastDayData?.avgThroughputPerSecond,
      largestPoster: projectData.pastDayData?.largestPoster,
      totalPosted: projectData.pastDayData?.totalPosted,
    },
  }
}

function getMockProjectDaThroughputCharts({
  range,
  projectId,
}: ProjectDaThroughputChartDataParams): getProjectDaThroughputChartsData {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  if (!['ethereum', 'celestia', 'avail', 'eigenda'].includes(projectId)) {
    return {
      totalChart: {
        data: [],
        range: [from, to],
      },
      byProjectChart: {
        data: [],
      },
      stats: {
        pastDayAvgCapacityUtilization: 0,
        pastDayAvgThroughputPerSecond: 0,
        largestPoster: undefined,
        totalPosted: 0,
      },
      syncedUntil: UnixTime.now(),
    }
  }

  const timestamps = generateTimestamps([from, to], 'daily')
  return {
    totalChart: {
      data: timestamps.map((timestamp) => {
        const throughputValue = Math.random() * 900_000_000 + 90_000_000

        return [timestamp, Math.round(throughputValue)]
      }),
      range: [from, to],
    },
    byProjectChart: {
      data: [],
    },
    stats: {
      pastDayAvgCapacityUtilization: Math.random() * 100,
      pastDayAvgThroughputPerSecond: Math.random() * 900_000,
      largestPoster: undefined,
      totalPosted: Math.random() * 900_000_000 + 90_000_000,
    },
    syncedUntil: UnixTime.now(),
  }
}
