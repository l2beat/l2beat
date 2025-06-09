import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { getDaThroughputTable } from '~/server/features/data-availability/throughput/getDaThroughputTable'
import { getThroughputSyncWarning } from '~/server/features/data-availability/throughput/isThroughputSynced'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'

export async function getDaThroughputSection(
  project: Project<'daLayer' | 'statuses' | 'display', 'milestones'>,
) {
  const [throughputChart, throughputData, projectsWithColors] =
    await Promise.all([
      api.da.projectChart({
        range: '1y',
        projectId: project.id,
      }),
      getDaThroughputTable([project.id]),
      ps.getProjects({ select: ['colors'] }),
    ])
  if (!throughputChart || throughputChart.chart.length === 0) return undefined

  const projectData = throughputData.data[project.id]

  if (!projectData) return undefined

  const notSyncedStatus = projectData.syncedUntil
    ? getThroughputSyncWarning(UnixTime(projectData.syncedUntil), {
        shorter: true,
      })
    : undefined

  return {
    projectId: project.id,
    throughput: project.daLayer.throughput ?? [],
    pastDayAvgCapacityUtilization:
      projectData.pastDayData?.avgCapacityUtilization,
    pastDayAvgThroughputPerSecond:
      projectData.pastDayData?.avgThroughputPerSecond,
    largestPoster: projectData.pastDayData?.largestPoster,
    totalPosted: projectData.pastDayData?.totalPosted,
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
