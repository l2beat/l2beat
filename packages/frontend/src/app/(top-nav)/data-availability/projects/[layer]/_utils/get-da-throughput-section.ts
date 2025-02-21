import type { Project } from '@l2beat/config'
import { featureFlags } from '~/consts/feature-flags'
import { getDaThroughputTable } from '~/server/features/data-availability/throughput/get-da-throughput-table'
import { api } from '~/trpc/server'

export async function getDaThroughputSection(
  project: Project<'daLayer' | 'statuses' | 'display'>,
) {
  if (!featureFlags.daThroughput) return undefined

  const throughputChart = await api.da.projectChart({
    range: 'max',
    projectId: project.id,
  })
  if (throughputChart.length === 0) return undefined

  const throughputData = await getDaThroughputTable([project.id])
  const projectData = throughputData.data[project.id]

  if (!projectData) return undefined

  return {
    projectId: project.id,
    throughput: project.daLayer.throughput ?? [],
    pastDayAvgCapacityUtilization: projectData.pastDayAvgCapacityUtilization,
    pastDayAvgThroughputPerSecond: projectData.pastDayAvgThroughputPerSecond,
    largestPoster: projectData.largestPoster
      ? {
          name: projectData.largestPoster.name,
          percentage: projectData.largestPoster.percentage,
        }
      : undefined,
    totalPosted: projectData.totalPosted,
  }
}
