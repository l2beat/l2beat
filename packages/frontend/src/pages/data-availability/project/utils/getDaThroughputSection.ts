import type { Project } from '@l2beat/config'
import { getChartProject } from '~/components/core/chart/utils/getChartProject'
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

  const [charts, projectsWithColors] = await Promise.all([
    helpers.da.projectCharts.fetch({
      range: { type: '1y' },
      projectId: project.id,
      includeScalingOnly: true,
    }),
    ps.getProjects({ select: ['colors'] }),
  ])

  if (!charts || charts.totalChart.data.length === 0) return undefined

  const syncWarning = getThroughputSyncWarning(charts.syncedUntil, {
    shorter: true,
  })

  return {
    project: getChartProject(project),
    throughput: project.daLayer.throughput ?? [],
    syncStatus: {
      warning: syncWarning,
      isSynced: !syncWarning,
    },
    customColors: Object.fromEntries(
      projectsWithColors.map((p) => [p.name, p.colors.primary.light]),
    ),
    milestones: project.milestones ?? [],
  }
}
