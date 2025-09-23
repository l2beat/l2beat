import type {
  Project,
  ProjectContract,
  ProjectPermissions,
} from '@l2beat/config'
import { ps } from '~/server/projects'
import { temporarilyExtractFirstElement } from '../../utils'

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

export async function getScalingDaSolution(
  project: Project<'scalingInfo', 'scalingDa'>,
): Promise<DaSolution | undefined> {
  const layerId = temporarilyExtractFirstElement(project.scalingDa)?.layer
    .projectId
  const bridgeId = temporarilyExtractFirstElement(project.scalingDa)?.bridge
    .projectId

  const [daLayer, daBridge] = await Promise.all([
    layerId && ps.getProject({ id: layerId }),
    bridgeId &&
      ps.getProject({ id: bridgeId, optional: ['permissions', 'contracts'] }),
  ])

  const hostChainSelector = project.scalingInfo.hostChain.id
  if (!daLayer || !hostChainSelector) {
    return
  }

  const daBridgePermissions = daBridge?.permissions?.[hostChainSelector]
  const daBridgeContracts = daBridge?.contracts?.addresses[hostChainSelector]

  return {
    layerName: daLayer.name,
    layerSlug: daLayer.slug,
    bridgeName: daBridge?.name ?? 'No bridge',
    bridgeSlug: daBridge?.slug ?? 'no-bridge',
    hostChainName: project.scalingInfo.hostChain.name,
    permissions: daBridgePermissions,
    contracts: daBridgeContracts,
  }
}
