import type { Project } from '@l2beat/config'
import { api } from '~/trpc/server'

export async function getDaThroughputSection(
  project: Project<'daLayer' | 'statuses' | 'display'>,
) {
  await api.da.projectChart.prefetch({
    range: 'max',
    projectId: project.id,
  })

  const throughput = await api.da.projectChart({
    range: 'max',
    projectId: project.id,
  })
  if (throughput.length === 0) {
    return undefined
  }

  return {
    projectId: project.id,
    throughput: project.daLayer.throughput ?? [],
  }
}
