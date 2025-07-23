import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDaThroughputTable } from './getDaThroughputTable'

export type ProjectDaThroughputStats = {
  stats: Stats
  scalingOnlyStats: Stats
}

interface Stats {
  pastDayAvgCapacityUtilization: number | undefined
  pastDayAvgThroughputPerSecond: number | undefined
  largestPoster:
    | {
        name: string
        percentage: number
        totalPosted: number
        href: string
      }
    | undefined
  totalPosted: number | undefined
}

export const ProjectDaThroughputStatsParams = v.object({
  daLayerId: v.string(),
})
export type ProjectDaThroughputStatsParams = v.infer<
  typeof ProjectDaThroughputStatsParams
>

export async function getProjectDaThroughputStats(
  params: ProjectDaThroughputStatsParams,
): Promise<ProjectDaThroughputStats | undefined> {
  if (env.MOCK) {
    return getMockProjectDaThroughputStats(params)
  }

  const throughputTable = await getDaThroughputTable([params.daLayerId])
  const projectData = throughputTable.data[params.daLayerId]
  const scalingOnlyData = throughputTable.scalingOnlyData[params.daLayerId]

  if (!projectData || !scalingOnlyData) {
    return undefined
  }

  return {
    stats: {
      pastDayAvgCapacityUtilization:
        projectData.pastDayData?.avgCapacityUtilization,
      pastDayAvgThroughputPerSecond:
        projectData.pastDayData?.avgThroughputPerSecond,
      largestPoster: projectData.pastDayData?.largestPoster,
      totalPosted: projectData.pastDayData?.totalPosted,
    },
    scalingOnlyStats: {
      pastDayAvgCapacityUtilization:
        scalingOnlyData.pastDayData?.avgCapacityUtilization,
      pastDayAvgThroughputPerSecond:
        scalingOnlyData.pastDayData?.avgThroughputPerSecond,
      largestPoster: scalingOnlyData.pastDayData?.largestPoster,
      totalPosted: scalingOnlyData.pastDayData?.totalPosted,
    },
  }
}

function getMockProjectDaThroughputStats({
  daLayerId,
}: ProjectDaThroughputStatsParams): ProjectDaThroughputStats {
  if (!['ethereum', 'celestia', 'avail', 'eigenda'].includes(daLayerId)) {
    return {
      stats: {
        pastDayAvgCapacityUtilization: 0,
        pastDayAvgThroughputPerSecond: 0,
        largestPoster: undefined,
        totalPosted: 0,
      },
      scalingOnlyStats: {
        pastDayAvgCapacityUtilization: 0,
        pastDayAvgThroughputPerSecond: 0,
        largestPoster: undefined,
        totalPosted: 0,
      },
    }
  }

  return {
    stats: {
      pastDayAvgCapacityUtilization: Math.random() * 100,
      pastDayAvgThroughputPerSecond: Math.random() * 900_000,
      largestPoster: undefined,
      totalPosted: Math.random() * 900_000_000 + 90_000_000,
    },
    scalingOnlyStats: {
      pastDayAvgCapacityUtilization: Math.random() * 100,
      pastDayAvgThroughputPerSecond: Math.random() * 900_000,
      largestPoster: undefined,
      totalPosted: Math.random() * 900_000_000 + 90_000_000,
    },
  }
}
