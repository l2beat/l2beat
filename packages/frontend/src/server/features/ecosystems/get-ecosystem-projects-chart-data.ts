import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { generateTimestamps } from '../utils/generate-timestamps'

export type EcosystemProjectsCountData = {
  chart: {
    timestamp: number
    projectCount: number
  }[]
  marketShare: number
}

export function getEcosystemProjectsChartData(
  entries: Project<'ecosystemInfo', 'archivedAt'>[],
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
    const projects = entries.filter((e) => {
      const since = e.ecosystemInfo.sinceTimestamp ?? e.addedAt
      const until = e.ecosystemInfo.untilTimestamp ?? e.archivedAt
      return since <= timestamp && (!until || until > timestamp)
    })
    return {
      timestamp,
      projectCount: projects.length,
    }
  })

  return {
    chart,
    marketShare: entries.length / allScalingProjectsCount,
  }
}
