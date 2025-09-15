import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { ActivityLatestUopsData } from '../scaling/activity/getActivityLatestTps'
import type { ProjectSevenDayTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import { generateTimestamps } from '../utils/generateTimestamps'
import { getActiveEcosystemProjects } from './getActiveEcosystemProjects'

export type EcosystemProjectsCountData = {
  chart: {
    timestamp: number
    projectCount: number
  }[]
  stats: {
    tvsGreaterThanHundredMillion: number
    avgUopsGreaterThanOne: number
  }
  marketShare: number
}

export function getEcosystemProjectsChartData(
  entries: Project<'ecosystemInfo', 'archivedAt' | 'isUpcoming'>[],
  allScalingProjectsCount: number,
  projectsTvs: Record<string, ProjectSevenDayTvsBreakdown>,
  projectsActivity: ActivityLatestUopsData,
  startedAt: UnixTime | undefined,
): EcosystemProjectsCountData {
  const minTimestamp = Math.min(
    ...entries.map((e) =>
      UnixTime.toStartOf(e.ecosystemInfo.sinceTimestamp ?? e.addedAt, 'day'),
    ),
  )

  const timestamps = generateTimestamps(
    [
      Math.max(minTimestamp, startedAt ?? Number.NEGATIVE_INFINITY),
      UnixTime.toStartOf(UnixTime.now(), 'day'),
    ],
    'daily',
  )
  const chart = timestamps.map((timestamp) => {
    const projects = getActiveEcosystemProjects(entries, timestamp)
    return {
      timestamp,
      projectCount: projects.length,
    }
  })

  const mostRecentProjectCount = chart.at(-1)?.projectCount

  return {
    chart,
    marketShare: mostRecentProjectCount
      ? mostRecentProjectCount / allScalingProjectsCount
      : 0,
    stats: {
      tvsGreaterThanHundredMillion: entries.filter((p) => {
        const tvs = projectsTvs[p.id]?.breakdown.total

        return tvs && tvs > 100_000_000
      }).length,
      avgUopsGreaterThanOne: entries.filter((p) => {
        const uops = projectsActivity[p.id]?.pastDayUops
        return uops && uops > 1
      }).length,
    },
  }
}
