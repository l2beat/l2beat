import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { getDaThroughputLastTimestamp } from '~/server/features/data-availability/throughput/getDaThroughputLastTimestamp'
import { getDaThroughputTable } from '~/server/features/data-availability/throughput/getDaThroughputTable'
import { getThroughputSyncWarning } from '~/server/features/data-availability/throughput/isThroughputSynced'
import { THROUGHPUT_ENABLED_DA_LAYERS } from '~/server/features/data-availability/throughput/utils/consts'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'

export async function getDaThroughputSection(
  helpers: SsrHelpers,
  project: Project<'daLayer' | 'statuses' | 'display', 'milestones'>,
) {
  const configuredThroughput = project.daLayer.throughput
  if (
    !configuredThroughput ||
    configuredThroughput.length === 0 ||
    !THROUGHPUT_ENABLED_DA_LAYERS.includes(project.id)
  )
    return undefined

  const [throughputChart, throughputData, projectsWithColors, lastTimestamp] =
    await Promise.all([
      helpers.da.projectChart.fetch({
        range: '1y',
        projectId: project.id,
      }),
      getDaThroughputTable([project.id]),
      ps.getProjects({ select: ['colors'] }),
      getDaThroughputLastTimestamp(project.id),
    ])

  if (!throughputChart || throughputChart.chart.length === 0) return undefined

  const projectData = throughputData.data[project.id]

  if (!projectData || !lastTimestamp) return undefined

  const notSyncedStatus = projectData.syncedUntil
    ? getThroughputSyncWarning(UnixTime(lastTimestamp), {
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
