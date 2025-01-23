import { daLayers } from '@l2beat/config'
import type { ScalingProject } from './get-scaling-project-entry'

export type DaSolution = ReturnType<typeof getDaSolution>

export function getDaSolution(project: ScalingProject) {
  const layerBridgePairs = daLayers.flatMap((layer) =>
    layer.bridges.flatMap((bridge) => ({ layer, bridge })),
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

  const daBridgeContracts = allDaBridgeContracts.addresses[hostChainSelector]

  return {
    layerName: daSolution.layer.display.name,
    bridgeName: daSolution.bridge.display.name,
    hostChain: hostChainSelector,
    permissions: daBridgePermissions,
    contracts: daBridgeContracts,
  }
}
