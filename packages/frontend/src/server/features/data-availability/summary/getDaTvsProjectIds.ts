import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'

export interface DaTvsProjectIds {
  /** L2s that post their data to Ethereum */
  fullData: string[]
  /** L2s that settle on Ethereum but keep their data on another DA layer */
  settlementOnly: string[]
}

type Layer = Pick<Project, 'id'> & {
  daLayer: Pick<Project<'daLayer'>['daLayer'], 'usedWithoutBridgeIn'>
}
type Bridge = {
  daBridge: Pick<Project<'daBridge'>['daBridge'], 'daLayer' | 'usedIn'>
}
type ScalingProject = Pick<Project, 'id'> & {
  scalingInfo: Pick<Project<'scalingInfo'>['scalingInfo'], 'layer'>
}

/**
 * Splits the L2s by where their data goes. A project that uses Ethereum
 * next to another DA layer counts as full data, so nobody is counted twice.
 * A project with its own DA system (a DAC and the like) keeps its data off
 * Ethereum just the same, so it counts as settlement only. L3s are left out:
 * they settle on an L2, not on Ethereum, so neither series describes them.
 */
export function getDaTvsProjectIds(
  layers: Layer[],
  bridges: Bridge[],
  customDaProjects: Pick<Project, 'id'>[],
  scalingProjects: ScalingProject[],
): DaTvsProjectIds {
  const l2s = new Set(
    scalingProjects
      .filter((p) => p.scalingInfo.layer === 'layer2')
      .map((p) => p.id),
  )
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
    ].filter((id) => l2s.has(id))
  }

  const fullData = usedIn(layers.filter((l) => l.id === ProjectId.ETHEREUM))
  const onEthereum = new Set(fullData)
  const offEthereum = new Set([
    ...usedIn(layers.filter((l) => l.id !== ProjectId.ETHEREUM)),
    ...customDaProjects.map((p) => p.id).filter((id) => l2s.has(id)),
  ])

  return {
    fullData,
    settlementOnly: [...offEthereum].filter((id) => !onEthereum.has(id)),
  }
}
