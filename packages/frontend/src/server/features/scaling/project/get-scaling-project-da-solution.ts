import type { ProjectContract, ProjectPermissions } from '@l2beat/config'
import { daLayers } from '@l2beat/config'
import type { ScalingProject } from './get-scaling-project-entry'

type Common = {
  layerName: string
  bridgeName: string
  hostChain: string
}

export type DaSolution = Common & {
  permissions: ProjectPermissions | undefined
  contracts: ProjectContract[] | undefined
}

export type DaSolutionWith<T> = Common & T

export function getDaSolution(project: ScalingProject): DaSolution | undefined {
  const layerBridgePairs = daLayers.flatMap((layer) =>
    layer.daLayer.bridges.flatMap((bridge) => ({ layer, bridge })),
  )

  const daSolution = layerBridgePairs.find((pair) =>
    pair.bridge.usedIn.some((usedIn) => usedIn.id === project.id),
  )

  const hostChainSelector =
    project.type === 'layer2' ? 'ethereum' : project.hostChain

  if (
    !daSolution ||
    daSolution.bridge.type === 'NoBridge' ||
    !hostChainSelector
  ) {
    return
  }

  const {
    permissions: allDaBridgePermissions,
    contracts: allDaBridgeContracts,
  } = daSolution.bridge

  const daBridgePermissions =
    allDaBridgePermissions !== 'UnderReview'
      ? allDaBridgePermissions?.[hostChainSelector]
      : undefined

  const daBridgeContracts = allDaBridgeContracts?.addresses[hostChainSelector]

  return {
    layerName: daSolution.layer.display.name,
    bridgeName: daSolution.bridge.display.name,
    hostChain: hostChainSelector,
    permissions: daBridgePermissions,
    contracts: daBridgeContracts,
  }
}
