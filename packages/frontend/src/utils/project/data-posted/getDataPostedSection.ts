import type { Project, ProjectDaTrackingConfig } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import uniqBy from 'lodash/uniqBy'
import type { DataPostedSectionProps } from '~/components/projects/sections/data-posted/DataPostedSection'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'

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
  const daLayers = await ps.getProjects({
    select: ['isDaLayer'],
  })

  if (!project.daTrackingConfig) return undefined

  const range = project.archivedAt ? 'max' : '1y'
  const data = await helpers.da.scalingProjectChart.fetch({
    range,
    projectId: project.id,
  })

  if (!data || data.chart.length === 0) return undefined

  const [pastConfigs, currentConfigs] = partition(
    project.daTrackingConfig,
    (c) => (c.type === 'eigen-da' ? !!c.untilTimestamp : !!c.untilBlock),
  )

  // Remove duplicate da layers
  const currentDaLayers = uniqBy(currentConfigs, (c) => c.daLayer)
    .map((c) => getDaLayer(c, daLayers))
    .filter(notUndefined)
  const pastDaLayers = uniqBy(pastConfigs, (c) => c.daLayer)
    .map((c) => getDaLayer(c, daLayers))
    .filter(notUndefined)

  return {
    defaultRange: range,
    currentDaLayers,
    pastDaLayers,
    daTrackingConfig: project.daTrackingConfig,
  }
}

function getDaLayer(
  config: ProjectDaTrackingConfig,
  daLayers: Project<'isDaLayer'>[],
) {
  const daLayer = daLayers.find((d) => d.id === config.daLayer)
  if (!daLayer) return undefined

  return {
    name: daLayer.name,
    logo: getProjectIcon(daLayer.slug),
    href: `/data-availability/projects/${daLayer.slug}/no-bridge}`,
  }
}
