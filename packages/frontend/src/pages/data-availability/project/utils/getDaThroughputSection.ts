import type { Project } from '@l2beat/config'
import { getThroughputSyncWarning } from '~/server/features/data-availability/throughput/isThroughputSynced'
import { THROUGHPUT_ENABLED_DA_LAYERS } from '~/server/features/data-availability/throughput/utils/consts'
import { getL2OnlyThroughputSyncedUntil } from '~/server/features/data-availability/throughput/utils/getL2OnlyThroughputSyncedUntil'
import { ps } from '~/server/projects'
import { toChartProject } from '~/utils/project/toChartProject'
import { optionToRange } from '~/utils/range/range'

export async function getDaThroughputSection(
  project: Project<'daLayer' | 'statuses' | 'display', 'milestones'>,
) {
  const configuredThroughput = project.daLayer.throughput
  if (
    !configuredThroughput ||
    configuredThroughput.length === 0 ||
    !THROUGHPUT_ENABLED_DA_LAYERS.includes(project.id)
  )
    return undefined

  const [rangeStart] = optionToRange('1y')
  const [syncedUntil, projectsWithColors] = await Promise.all([
    getL2OnlyThroughputSyncedUntil(project),
    ps.getProjects({ select: ['colors'] }),
  ])

  const hasDataInRange =
    syncedUntil !== undefined &&
    (rangeStart === null || syncedUntil >= rangeStart)
  if (!hasDataInRange) return undefined

  const syncWarning = getThroughputSyncWarning(syncedUntil, {
    shorter: true,
  })

  return {
    project: toChartProject(project),
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
