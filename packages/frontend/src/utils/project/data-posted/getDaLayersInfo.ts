import type { Project, ProjectDaTrackingConfig } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'

export function getDaLayersInfo(
  configs: ProjectDaTrackingConfig[],
  daLayers: Project<'isDaLayer'>[],
): {
  currentDaLayers: DaLayerInfo[]
  pastDaLayers: DaLayerInfo[]
} {
  const daLayersMap = new Map<ProjectId, DaLayerInfo & { isActive: boolean }>()

  for (const config of configs) {
    const isActive =
      config.type === 'eigen-da' ? !config.untilTimestamp : !config.untilBlock

    const existingEntry = daLayersMap.get(config.daLayer)
    if (!existingEntry) {
      daLayersMap.set(config.daLayer, {
        ...getDaLayer(config, daLayers),
        isActive: !isActive,
      })
    } else {
      existingEntry.isActive = existingEntry.isActive || !isActive
    }
  }

  const [pastDaLayers, currentDaLayers] = partition(
    Array.from(daLayersMap.values()),
    (d) => d.isActive,
  )

  return {
    currentDaLayers,
    pastDaLayers,
  }
}

interface DaLayerInfo {
  name: string
  logo: string
  href: string
}

function getDaLayer(
  config: ProjectDaTrackingConfig,
  daLayers: Project<'isDaLayer'>[],
): DaLayerInfo {
  const daLayer = daLayers.find((d) => d.id === config.daLayer)
  assert(daLayer, 'Da layer not found')

  return {
    name: daLayer.name,
    logo: getProjectIcon(daLayer.slug),
    href: `/data-availability/projects/${daLayer.slug}/${daLayer.slug === 'ethereum' ? 'ethereum' : 'no-bridge'}`,
  }
}
