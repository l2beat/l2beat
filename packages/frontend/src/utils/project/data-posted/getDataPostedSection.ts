import type { Project } from '@l2beat/config'
import type { DataPostedSectionProps } from '~/components/projects/sections/DataPostedSection'
import type { DaSolution } from '~/server/features/scaling/project/getScalingDaSolution'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import type { SsrHelpers } from '~/trpc/server'

export async function getDataPostedSection(
  helpers: SsrHelpers,
  project: Project<never | 'scalingInfo', 'archivedAt' | 'daTrackingConfig'>,
  daSolution: DaSolution | undefined,
): Promise<
  Pick<DataPostedSectionProps, 'defaultRange' | 'daLayer'> | undefined
> {
  if (!project.daTrackingConfig || !daSolution) return undefined

  const range = project.archivedAt ? 'max' : '1y'
  const data = await helpers.da.scalingProjectChart.fetch({
    range,
    projectId: project.id,
  })

  if (!data || data.chart.length === 0) return undefined

  return {
    daLayer: {
      name: daSolution.layerName,
      logo: getProjectIcon(daSolution.layerSlug),
      href: `/data-availability/projects/${daSolution.layerSlug}/${daSolution.bridgeSlug ?? 'no-bridge'}`,
    },
    defaultRange: range,
  }
}
