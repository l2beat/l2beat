import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'

export interface DaTvsProjectIds {
  /** Projects that post their data to Ethereum */
  fullData: string[]
  /** Projects that settle on Ethereum but keep their data on another DA layer */
  settlementOnly: string[]
}

type Layer = Pick<Project, 'id'> & {
  daLayer: Pick<Project<'daLayer'>['daLayer'], 'usedWithoutBridgeIn'>
}
type Bridge = {
  daBridge: Pick<Project<'daBridge'>['daBridge'], 'daLayer' | 'usedIn'>
}

/**
 * Splits the projects by where their data goes. A project that uses Ethereum
 * next to another DA layer counts as full data, so nobody is counted twice.
 * A project with its own DA system (a DAC and the like) keeps its data off
 * Ethereum just the same, so it counts as settlement only.
 */
export function getDaTvsProjectIds(
  layers: Layer[],
  bridges: Bridge[],
  customDaProjects: Pick<Project, 'id'>[],
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

  const fullData = usedIn(layers.filter((l) => l.id === ProjectId.ETHEREUM))
  const onEthereum = new Set(fullData)
  const offEthereum = new Set([
    ...usedIn(layers.filter((l) => l.id !== ProjectId.ETHEREUM)),
    ...customDaProjects.map((p) => p.id),
  ])

  return {
    fullData,
    settlementOnly: [...offEthereum].filter((id) => !onEthereum.has(id)),
  }
}
