import { type ProjectContract, type ProjectPermissions } from '@l2beat/config'
import { ps } from '~/server/projects'
import { getDaBridges } from '../../data-availability/utils/get-da-bridges'
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

export async function getDaSolution(
  project: ScalingProject,
): Promise<DaSolution | undefined> {
  const projects = await ps.getProjects({
    select: ['daLayer', 'daBridges'],
  })

  const layerBridgePairs = projects.flatMap((layer) =>
    getDaBridges(layer).flatMap((bridge) => ({ layer, bridge })),
  )

  const daSolution = layerBridgePairs.find((pair) =>
    pair.bridge.usedIn.some((usedIn) => usedIn.id === project.id),
  )

  const hostChainSelector =
    project.type === 'layer2' ? 'ethereum' : project.hostChain

  if (
    !daSolution ||
    !!daSolution.bridge.risks.isNoBridge ||
    !hostChainSelector
  ) {
    return
  }

  const {
    permissions: allDaBridgePermissions,
    contracts: allDaBridgeContracts,
  } = daSolution.bridge

  const daBridgePermissions = allDaBridgePermissions?.[hostChainSelector]

  const daBridgeContracts = allDaBridgeContracts?.addresses[hostChainSelector]

  return {
    layerName: daSolution.layer.name,
    bridgeName: daSolution.bridge.display.name,
    hostChain: hostChainSelector,
    permissions: daBridgePermissions,
    contracts: daBridgeContracts,
  }
}
