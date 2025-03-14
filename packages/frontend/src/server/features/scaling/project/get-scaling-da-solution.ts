import type { Project } from '@l2beat/config'
import { type ProjectContract, type ProjectPermissions } from '@l2beat/config'
import { ps } from '~/server/projects'

type Common = {
  layerName: string
  layerSlug: string
  bridgeName: string
  bridgeSlug: string
  hostChainName: string
}

export type DaSolution = Common & {
  permissions: ProjectPermissions | undefined
  contracts: ProjectContract[] | undefined
}

export type DaSolutionWith<T> = Common & T

export async function getScalingDaSolution(
  project: Project<'scalingInfo', 'scalingDa'>,
): Promise<DaSolution | undefined> {
  const layerId = project.scalingDa?.layer.projectId
  const bridgeId = project.scalingDa?.bridge.projectId

  const [daLayer, daBridge] = await Promise.all([
    layerId && ps.getProject({ id: layerId }),
    bridgeId &&
      ps.getProject({ id: bridgeId, optional: ['permissions', 'contracts'] }),
  ])

  const hostChainSelector = project.scalingInfo.hostChain.id

  if (!daLayer || !daBridge || !hostChainSelector) {
    return
  }

  const daBridgePermissions = daBridge.permissions?.[hostChainSelector]
  const daBridgeContracts = daBridge.contracts?.addresses[hostChainSelector]

  return {
    layerName: daLayer.name,
    layerSlug: daLayer.slug,
    bridgeName: daBridge.name,
    bridgeSlug: daBridge.slug,
    hostChainName: project.scalingInfo.hostChain.name,
    permissions: daBridgePermissions,
    contracts: daBridgeContracts,
  }
}
