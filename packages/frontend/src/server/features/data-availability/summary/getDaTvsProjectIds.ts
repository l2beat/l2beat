import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'

export interface DaTvsProjectIds {
  /** Projects that post their data to Ethereum */
  fullData: string[]
  /** Projects that settle on Ethereum but keep their data on another DA layer */
  settlementOnly: string[]
}

type Layer = Pick<Project, 'id'> & {
  daLayer: Pick<
    Project<'daLayer'>['daLayer'],
    'systemCategory' | 'usedWithoutBridgeIn'
  >
}
type Bridge = {
  daBridge: Pick<Project<'daBridge'>['daBridge'], 'daLayer' | 'usedIn'>
}

/**
 * Splits the projects by where their data goes. A project that uses Ethereum
 * next to another DA layer counts as full data, so nobody is counted twice.
 * Custom DA systems (DACs and the like) are left out.
 */
export function getDaTvsProjectIds(
  layers: Layer[],
  bridges: Bridge[],
): DaTvsProjectIds {
  const usedIn = (selected: Layer[]) => {
    const ids = new Set(selected.map((l) => l.id))
    return [
      ...new Set(
        [
          ...selected.flatMap((l) => l.daLayer.usedWithoutBridgeIn),
          ...bridges
            .filter((b) => ids.has(b.daBridge.daLayer))
            .flatMap((b) => b.daBridge.usedIn),
        ].map((p) => p.id),
      ),
    ]
  }

  const publicLayers = layers.filter(
    (l) => l.daLayer.systemCategory === 'public',
  )
  const fullData = usedIn(
    publicLayers.filter((l) => l.id === ProjectId.ETHEREUM),
  )
  const onEthereum = new Set(fullData)

  return {
    fullData,
    settlementOnly: usedIn(
      publicLayers.filter((l) => l.id !== ProjectId.ETHEREUM),
    ).filter((id) => !onEthereum.has(id)),
  }
}
