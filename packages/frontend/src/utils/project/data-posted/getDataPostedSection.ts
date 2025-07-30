import type { Project } from '@l2beat/config'
import type { DataPostedSectionProps } from '~/components/projects/sections/DataPostedSection'
import type { SsrHelpers } from '~/trpc/server'

export async function getDataPostedSection(
  helpers: SsrHelpers,
  project: Project<never | 'scalingInfo', 'archivedAt' | 'daTrackingConfig'>,
): Promise<Pick<DataPostedSectionProps, 'defaultRange'> | undefined> {
  if (!project.daTrackingConfig) return undefined

  const range = project.archivedAt ? 'max' : '1y'
  const data = await helpers.da.scalingProjectChart.fetch({
    range,
    projectId: project.id,
  })

  if (!data || data.chart.length === 0) return undefined

  return {
    defaultRange: range,
  }
}
