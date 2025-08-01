import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { generateTimestamps } from '../utils/generateTimestamps'
import { getActiveEcosystemProjects } from './getActiveEcosystemProjects'

export type EcosystemProjectsCountData = {
  chart: {
    timestamp: number
    projectCount: number
  }[]
  marketShare: number
}

export function getEcosystemProjectsChartData(
  entries: Project<'ecosystemInfo', 'archivedAt' | 'isUpcoming'>[],
  allScalingProjectsCount: number,
): EcosystemProjectsCountData {
  const minTimestamp = Math.min(
    ...entries.map((e) =>
      UnixTime.toStartOf(e.ecosystemInfo.sinceTimestamp ?? e.addedAt, 'day'),
    ),
  )

  const timestamps = generateTimestamps(
    [minTimestamp, UnixTime.toStartOf(UnixTime.now(), 'day')],
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
  }
}
