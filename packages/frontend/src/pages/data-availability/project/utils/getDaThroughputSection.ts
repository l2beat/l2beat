import type { Project } from '@l2beat/config'
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

  const [throughputChart, projectsWithColors] = await Promise.all([
    helpers.da.projectChart.fetch({
      range: { type: '1y' },
      projectId: project.id,
      includeScalingOnly: true,
    }),
    ps.getProjects({ select: ['colors'] }),
  ])

  if (!throughputChart || throughputChart.chart.length === 0) return undefined

  const notSyncedStatus = getThroughputSyncWarning(
    throughputChart.syncedUntil,
    {
      shorter: true,
    },
  )

  return {
    projectId: project.id,
    throughput: project.daLayer.throughput ?? [],
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
