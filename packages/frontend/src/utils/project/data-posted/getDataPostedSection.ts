import type { Project } from '@l2beat/config'
import type { DataPostedSectionProps } from '~/components/projects/sections/data-posted/DataPostedSection'
import type { DaSolution } from '~/server/features/scaling/project/getScalingDaSolutions'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import type { SsrHelpers } from '~/trpc/server'

export async function getDataPostedSection(
  helpers: SsrHelpers,
  project: Project<never | 'scalingInfo', 'archivedAt' | 'daTrackingConfig'>,
  daSolutions: DaSolution[] | undefined,
): Promise<
  | Pick<
      DataPostedSectionProps,
      'defaultRange' | 'daLayer' | 'daTrackingConfig'
    >
  | undefined
> {
  const usedDaSolution = daSolutions?.find(
    (daSolution) =>
      project.daTrackingConfig &&
      daSolution.layerId === project.daTrackingConfig[0]?.daLayer,
  )
  if (!project.daTrackingConfig || !usedDaSolution) return undefined

  const range = project.archivedAt ? 'max' : '1y'
  const data = await helpers.da.scalingProjectChart.fetch({
    range,
    projectId: project.id,
  })

  if (!data || data.chart.length === 0) return undefined

  return {
    daLayer: {
      name: usedDaSolution.layerName,
      logo: getProjectIcon(usedDaSolution.layerSlug),
      href: `/data-availability/projects/${usedDaSolution.layerSlug}/${usedDaSolution.bridgeSlug ?? 'no-bridge'}`,
    },
    defaultRange: range,
    daTrackingConfig: project.daTrackingConfig,
  }
}
