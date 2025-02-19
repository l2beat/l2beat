import type { Project } from '@l2beat/config'
import { formatBytes } from '~/server/features/data-availability/throughput/utils/format-bytes'
import { getDaThroughput } from '~/server/features/data-availability/utils/get-da-throuput'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'

export async function getDaThroughputSection(
  project: Project<'daLayer' | 'statuses' | 'display'>,
) {
  await api.da.projectChart.prefetch({
    range: 'max',
    projectId: project.id,
  })

  const throughputChart = await api.da.projectChart({
    range: 'max',
    projectId: project.id,
  })
  if (throughputChart.length === 0) return undefined

  const projectsWithDaTracking = await ps.getProjects({
    select: ['daTrackingConfig'],
  })

  const throughputData = await getDaThroughput(
    [project],
    projectsWithDaTracking,
  )
  const projectData = throughputData[project.id]

  if (!projectData) return undefined

  return {
    projectId: project.id,
    throughput: project.daLayer.throughput ?? [],
    pastDayAvgCapacityUtilization: `${projectData.pastDayAvgCapacityUtilization}%`,
    pastDayAvgThroughput: `${projectData.pastDayAvgThroughput} MB/s`,
    largestPoster: projectData.largestPoster
      ? `${projectData.largestPoster.name} (${projectData.largestPoster.percentage}%)`
      : undefined,
    totalPosted: formatBytes(Number(projectData.totalPosted)),
  }
}
