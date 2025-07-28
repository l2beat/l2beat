import { UnixTime } from '@l2beat/shared-pure'
import type { v } from '@l2beat/validate'
import { env } from '~/env'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getDaThroughputTable } from './getDaThroughputTable'
import {
  getProjectDaThroughputChart,
  ProjectDaThroughputChartParams,
} from './getProjectDaThroughtputChart'

export type ProjectDaThroughputChartData = {
  chart: ProjectDaThroughputChartPoint[]
  stats: {
    pastDayAvgCapacityUtilization: number | undefined
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
  range: [UnixTime | null, UnixTime]
  syncedUntil: UnixTime
}
export type ProjectDaThroughputChartPoint = [
  timestamp: number,
  value: number | null,
]

export const ProjectDaThroughputChartDataParams = ProjectDaThroughputChartParams
export type ProjectDaThroughputChartDataParams = v.infer<
  typeof ProjectDaThroughputChartDataParams
>

export async function getProjectDaThroughputChartData(
  params: ProjectDaThroughputChartDataParams,
): Promise<ProjectDaThroughputChartData | undefined> {
  if (env.MOCK) {
    return getMockProjectDaThroughputChartData(params)
  }

  const [chartData, throughputTable] = await Promise.all([
    getProjectDaThroughputChart(params),
    getDaThroughputTable([params.projectId]),
  ])
  const projectData = params.includeScalingOnly
    ? throughputTable.scalingOnlyData[params.projectId]
    : throughputTable.data[params.projectId]

  if (!chartData || chartData.chart.length === 0 || !projectData) {
    return undefined
  }

  return {
    ...chartData,
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

function getMockProjectDaThroughputChartData({
  range,
  projectId,
}: ProjectDaThroughputChartDataParams): ProjectDaThroughputChartData {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  if (!['ethereum', 'celestia', 'avail', 'eigenda'].includes(projectId)) {
    return {
      chart: [],
      stats: {
        pastDayAvgCapacityUtilization: 0,
        pastDayAvgThroughputPerSecond: 0,
        largestPoster: undefined,
        totalPosted: 0,
      },
      range: [from, to],
      syncedUntil: UnixTime.now(),
    }
  }

  const timestamps = generateTimestamps([from, to], 'daily')
  return {
    chart: timestamps.map((timestamp) => {
      const throughputValue = Math.random() * 900_000_000 + 90_000_000

      return [timestamp, Math.round(throughputValue)]
    }),
    stats: {
      pastDayAvgCapacityUtilization: Math.random() * 100,
      pastDayAvgThroughputPerSecond: Math.random() * 900_000,
      largestPoster: undefined,
      totalPosted: Math.random() * 900_000_000 + 90_000_000,
    },
    range: [from, to],
    syncedUntil: UnixTime.now(),
  }
}
