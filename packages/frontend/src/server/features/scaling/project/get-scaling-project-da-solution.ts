import { type ProjectContract, type ProjectPermissions } from '@l2beat/config'
import { ps } from '~/server/projects'
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
  const layerId = project.dataAvailability?.layer.projectId
  const bridgeId = project.dataAvailability?.bridge.projectId

  const [daLayer, daBridge] = await Promise.all([
    layerId && ps.getProject({ id: layerId }),
    bridgeId &&
      ps.getProject({ id: bridgeId, optional: ['permissions', 'contracts'] }),
  ])

  const hostChainSelector =
    project.type === 'layer2' ? 'ethereum' : project.hostChain

  if (!daLayer || !daBridge || !hostChainSelector) {
    return
  }

  const daBridgePermissions = daBridge.permissions?.[hostChainSelector]
  const daBridgeContracts = daBridge.contracts?.addresses[hostChainSelector]

  return {
    layerName: daLayer.name,
    bridgeName: daBridge.name,
    hostChain: hostChainSelector,
    permissions: daBridgePermissions,
    contracts: daBridgeContracts,
  }
}
