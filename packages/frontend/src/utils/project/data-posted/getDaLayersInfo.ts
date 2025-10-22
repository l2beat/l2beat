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
  const [pastConfigs, currentConfigs] = partition(configs, (c) =>
    c.type === 'eigen-da' ? !!c.untilTimestamp : !!c.untilBlock,
  )

  const currentDaLayersMap = new Map<ProjectId, DaLayerInfo>()
  const pastDaLayersMap = new Map<ProjectId, DaLayerInfo>()

  for (const config of currentConfigs) {
    const current = currentDaLayersMap.get(config.daLayer)
    if (!current) {
      currentDaLayersMap.set(config.daLayer, getDaLayer(config, daLayers))
    }
  }

  for (const config of pastConfigs) {
    const past = pastDaLayersMap.get(config.daLayer)
    // if project has historical config but it is still used we dont want to show it in past da layers
    const isCurrent = currentDaLayersMap.has(config.daLayer)
    if (!past && !isCurrent) {
      pastDaLayersMap.set(config.daLayer, getDaLayer(config, daLayers))
    }
  }

  return {
    currentDaLayers: Array.from(currentDaLayersMap.values()),
    pastDaLayers: Array.from(pastDaLayersMap.values()),
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
    href: `/data-availability/projects/${daLayer.slug}/no-bridge`,
  }
}
