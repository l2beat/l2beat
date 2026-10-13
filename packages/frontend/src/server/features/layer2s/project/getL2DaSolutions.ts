import type {
  Project,
  ProjectContract,
  ProjectPermissions,
} from '@l2beat/config'
import { notUndefined, type ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

type Common = {
  layerName: string
  layerSlug: string
  layerId: ProjectId
  /** Only DA layers that are scaling projects have a page. */
  layerHref: string | undefined
  bridgeName: string
  hostChainName: string
}

export type DaSolution = Common & {
  permissions: ProjectPermissions | undefined
  contracts: ProjectContract[] | undefined
}

export async function getL2DaSolutions(
  project: Project<'scalingInfo', 'scalingDa'>,
): Promise<DaSolution[]> {
  const [daLayers, daBridges] = await Promise.all([
    ps.getProjects({
      ids: project.scalingDa
        ?.map((da) => da?.layer.projectId)
        .filter(notUndefined),
      optional: ['scalingInfo'],
    }),
    ps.getProjects({
      ids: project.scalingDa
        ?.map((da) => da?.bridge.projectId)
        .filter(notUndefined),
      optional: ['permissions', 'contracts'],
    }),
  ])

  const hostChainSelector = project.scalingInfo.hostChain.id

  return (
    project.scalingDa
      ?.map((da) => {
        const daLayer = daLayers.find(
          (daLayer) => daLayer.id === da?.layer.projectId,
        )
        const daBridge = daBridges.find(
          (daBridge) => daBridge.id === da?.bridge.projectId,
        )

        if (!daLayer || !hostChainSelector) {
          return
        }

        const daBridgePermissions = daBridge?.permissions?.[hostChainSelector]
        const daBridgeContracts =
          daBridge?.contracts?.addresses[hostChainSelector]

        return {
          layerName: daLayer.name,
          layerSlug: daLayer.slug,
          layerId: daLayer.id,
          layerHref: daLayer.scalingInfo
            ? `/layer2s/projects/${daLayer.slug}`
            : undefined,
          bridgeName: daBridge?.name ?? 'No bridge',
          hostChainName: project.scalingInfo.hostChain.name,
          permissions: daBridgePermissions,
          contracts: daBridgeContracts,
        }
      })
      .filter(notUndefined) ?? []
  )
}
