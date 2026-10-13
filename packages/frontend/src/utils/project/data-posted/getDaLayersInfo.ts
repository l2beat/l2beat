import type {
  Project,
  ProjectDaTrackingConfig,
  ProjectScalingDa,
} from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { manifest } from '~/utils/Manifest'

export function getDaLayersInfo(
  configs: ProjectDaTrackingConfig[],
  daLayers: Project<'daLayer'>[],
  scalingDa: ProjectScalingDa[],
): {
  currentDaLayers: DaLayerInfo[]
  pastDaLayers: DaLayerInfo[]
} {
  // One ended config (e.g. a rotated batcher) must not make the layer past
  // while another config on it is still open.
  const isCurrentByDaLayer = new Map<ProjectId, boolean>()
  for (const config of configs) {
    const isCurrent = config.untilBlock === undefined
    isCurrentByDaLayer.set(
      config.daLayer,
      (isCurrentByDaLayer.get(config.daLayer) ?? false) || isCurrent,
    )
  }

  const [current, past] = partition(
    Array.from(isCurrentByDaLayer),
    ([, isCurrent]) => isCurrent,
  )

  return {
    currentDaLayers: [
      ...current.map(([id]) => getDaLayer(id, daLayers)),
      ...getUntrackedDaLayers(scalingDa),
    ],
    pastDaLayers: past.map(([id]) => getDaLayer(id, daLayers)),
  }
}

interface DaLayerInfo {
  name: string
  logo: string
}

function getDaLayer(
  daLayerId: ProjectId,
  daLayers: Project<'daLayer'>[],
): DaLayerInfo {
  const daLayer = daLayers.find((d) => d.id === daLayerId)
  assert(daLayer, 'Da layer not found')

  return {
    name: daLayer.name,
    logo: manifest.getUrl(`/icons/${daLayer.slug}.png`),
  }
}

/**
 * L2BEAT does not track the data posted to these layers, so only the DA label
 * says a project posts to them.
 */
const UNTRACKED_DA_LAYER_ICONS: Record<string, string> = {
  Avail: 'avail',
  Celestia: 'celestia',
  EigenDA: 'eigenda',
}

function getUntrackedDaLayers(scalingDa: ProjectScalingDa[]): DaLayerInfo[] {
  return scalingDa.flatMap(({ layer }) => {
    const icon = UNTRACKED_DA_LAYER_ICONS[layer.value]
    if (!icon) return []
    return [{ name: layer.value, logo: manifest.getUrl(`/icons/${icon}.png`) }]
  })
}
