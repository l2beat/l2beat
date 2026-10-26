import type {
  Project,
  ProjectDaTrackingConfig,
  ProjectScalingDa,
} from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
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

export interface DaLayerInfo {
  name: string
  logo: string | undefined
  /** Only Ethereum has a page of its own among DA layers. */
  href: string | undefined
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
    href: daLayer.id === ProjectId.ETHEREUM ? ETHEREUM_PROJECT_PATH : undefined,
  }
}

/** The tracking configs cover Ethereum; DAC and None are not layers. */
const SKIPPED_DA_LABELS = new Set(['Ethereum', 'DAC', 'None'])

/** Decoration only; a layer without an icon is still named. */
const UNTRACKED_DA_LAYER_ICONS: Record<string, string> = {
  Avail: 'avail',
  Celestia: 'celestia',
  EigenDA: 'eigenda',
}

/**
 * L2BEAT does not track the data posted to these layers, so only the DA label
 * says a project posts to them.
 */
function getUntrackedDaLayers(scalingDa: ProjectScalingDa[]): DaLayerInfo[] {
  return scalingDa.flatMap(({ layer }) => {
    if (SKIPPED_DA_LABELS.has(layer.value)) return []
    const icon = UNTRACKED_DA_LAYER_ICONS[layer.value]
    return [
      {
        name: layer.value,
        logo: icon ? manifest.getUrl(`/icons/${icon}.png`) : undefined,
        href: undefined,
      },
    ]
  })
}
