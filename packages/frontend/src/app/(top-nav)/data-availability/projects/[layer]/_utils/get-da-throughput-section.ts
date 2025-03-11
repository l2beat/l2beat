import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { featureFlags } from '~/consts/feature-flags'
import { getDaThroughputTable } from '~/server/features/data-availability/throughput/get-da-throughput-table'
import { getThroughputSyncWarning } from '~/server/features/data-availability/throughput/is-throughput-synced'
import { api } from '~/trpc/server'

export async function getDaThroughputSection(
  project: Project<'daLayer' | 'statuses' | 'display', 'milestones'>,
) {
  if (!featureFlags.daThroughput) return undefined

  const throughputChart = await api.da.projectChart({
    range: 'max',
    projectId: project.id,
  })
  if (throughputChart.chart.length === 0) return undefined

  const throughputData = await getDaThroughputTable([project.id])
  const projectData = throughputData.data[project.id]

  if (!projectData) return undefined

  const notSyncedStatus = getThroughputSyncWarning(
    UnixTime(projectData.syncedUntil),
    { shorter: true },
  )

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
    syncStatus: {
      warning: notSyncedStatus,
      isSynced: !notSyncedStatus,
    },
    milestones: project.milestones ?? [],
  }
}
