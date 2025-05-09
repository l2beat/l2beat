import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { getDaThroughputTable } from '~/server/features/data-availability/throughput/get-da-throughput-table'
import { getThroughputSyncWarning } from '~/server/features/data-availability/throughput/is-throughput-synced'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'

export async function getDaThroughputSection(
  project: Project<'daLayer' | 'statuses' | 'display', 'milestones'>,
) {
  const [throughputChart, throughputData, projectsWithColors] =
    await Promise.all([
      api.da.projectChart({
        range: 'max',
        projectId: project.id,
      }),
      getDaThroughputTable([project.id]),
      ps.getProjects({ select: ['colors'] }),
    ])
  if (throughputChart.chart.length === 0) return undefined

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
    largestPoster: projectData.largestPoster,
    totalPosted: projectData.totalPosted,
    syncStatus: {
      warning: notSyncedStatus,
      isSynced: !notSyncedStatus,
    },
    customColors: Object.fromEntries(
      projectsWithColors.map((p) => [p.name, p.colors.primary]),
    ),
    milestones: project.milestones ?? [],
  }
}
