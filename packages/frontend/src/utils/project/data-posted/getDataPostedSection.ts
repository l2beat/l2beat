import type { Project } from '@l2beat/config'
import type { DataPostedSectionProps } from '~/components/projects/sections/data-posted/DataPostedSection'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { getDaLayersInfo } from './getDaLayersInfo'

export async function getDataPostedSection(
  helpers: SsrHelpers,
  project: Project<never | 'scalingInfo', 'archivedAt' | 'daTrackingConfig'>,
): Promise<
  | Pick<
      DataPostedSectionProps,
      'defaultRange' | 'currentDaLayers' | 'pastDaLayers' | 'daTrackingConfig'
    >
  | undefined
> {
  if (!project.daTrackingConfig) return undefined

  const range = project.archivedAt ? 'max' : '1y'
  const [data, daLayers] = await Promise.all([
    helpers.da.scalingProjectChart.fetch({
      range,
      projectId: project.id,
    }),
    ps.getProjects({
      select: ['isDaLayer'],
    }),
  ])
  if (!data || data.chart.length === 0) return undefined

  const { currentDaLayers, pastDaLayers } = getDaLayersInfo(
    project.daTrackingConfig,
    daLayers,
  )

  return {
    defaultRange: range,
    currentDaLayers,
    pastDaLayers,
    daTrackingConfig: project.daTrackingConfig,
  }
}
