import type { Project, ProjectDaTrackingConfig } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { manifest } from '~/utils/Manifest'

export function getDaLayersInfo(
  configs: ProjectDaTrackingConfig[],
  daLayers: Project<'daLayer'>[],
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

export interface DaLayerInfo {
  name: string
  logo: string
  href: string | undefined
}

function getDaLayer(
  config: ProjectDaTrackingConfig,
  daLayers: Project<'daLayer'>[],
): DaLayerInfo {
  const daLayer = daLayers.find((d) => d.id === config.daLayer)
  assert(daLayer, 'Da layer not found')

  return {
    name: daLayer.name,
    logo: manifest.getUrl(`/icons/${daLayer.slug}.png`),
    href: getDaLayerHref(daLayer),
  }
}

// DA layer pages were removed; only Ethereum's lives on, as /blobs.
function getDaLayerHref(daLayer: Project<'daLayer'>) {
  return daLayer.id === ProjectId.ETHEREUM ? '/blobs' : undefined
}
