import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import type { CommonProjectEntry } from '../../utils/get-common-project-entry'
import { type ThroughputData, getDaThroughput } from '../utils/get-da-throuput'

export async function getDaThroughputEntries(): Promise<DaThroughputEntry[]> {
  const projects = await ps.getProjects({
    select: ['daLayer', 'statuses'],
  })
  const projectsWithDaTracking = projects.filter((p) => p.daLayer.daTracking)

  if (projectsWithDaTracking.length === 0) {
    return []
  }
  const latestData = await getDaThroughput(projectsWithDaTracking)

  const entries = projectsWithDaTracking.map((project) =>
    getDaThroughputEntry(project, latestData[project.id]),
  )
  return entries
}

export interface DaThroughputEntry extends CommonProjectEntry {
  isPublic: boolean
  pastDayAvgThroughput: number | undefined
  maxThroughput: number | undefined
  pastDayAvgCapacityUtilization: number | undefined
  largestPoster: {
    name: string
    percentage: number
    sum: number
  }
  totalPosted: string | undefined
  finality: number | undefined
}

function getDaThroughputEntry(
  project: Project<'daLayer' | 'statuses'>,
  throughputData: ThroughputData[string] | undefined,
): DaThroughputEntry {
  return {
    id: ProjectId(project.id),
    slug: project.slug,
    name: project.name,
    nameSecondLine: project.daLayer.type,
    href: `/data-availability/projects/${project.slug}`,
    statuses: {
      underReview: project.statuses.isUnderReview ? 'config' : undefined,
    },
    isPublic: project.daLayer.systemCategory === 'public',
    pastDayAvgThroughput: throughputData?.pastDayAvgThroughput,
    maxThroughput: throughputData?.maxThroughput,
    pastDayAvgCapacityUtilization:
      throughputData?.pastDayAvgCapacityUtilization,
    largestPoster: {
      name: '',
      percentage: 0,
      sum: 0,
    },
    totalPosted: throughputData?.totalPosted
      ? formatBytes(Number(throughputData.totalPosted))
      : undefined,
    finality: project.daLayer.finality,
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }

  const k = 1000
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
