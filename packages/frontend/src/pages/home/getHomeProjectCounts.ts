import type { Project } from '@l2beat/config'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { ps } from '~/server/projects'

export interface HomeProjectCounts {
  l2: number
  interop: number
  interopProtocols: number
  privacy: number
  dataAvailability: number
  blobs: number
  zkCatalog: number
  ecosystems: number
}

export async function getHomeProjectCounts(): Promise<HomeProjectCounts> {
  const [
    l2Projects,
    daLayers,
    customDa,
    zkProjects,
    ecosystems,
    privacy,
    interopProtocols,
    daTrackedProjects,
  ] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      where: ['daLayer'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      where: ['customDa'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      where: ['zkCatalogInfo'],
    }),
    ps.getProjects({
      where: ['ecosystemConfig'],
    }),
    ps.getProjects({
      where: ['privacyInfo'],
    }),
    ps.getProjects({
      where: ['interopConfig'],
    }),
    ps.getProjects({
      select: ['daTrackingConfig'],
      whereNot: ['archivedAt'],
    }),
  ])

  const interopChains = getInteropChains().filter((chain) => !chain.isUpcoming)

  return {
    l2: l2Projects.length,
    interop: interopChains.length,
    interopProtocols: interopProtocols.length,
    privacy: privacy.length,
    dataAvailability: daLayers.length + customDa.length,
    blobs: daTrackedProjects.filter(postsToEthereum).length,
    zkCatalog: zkProjects.length,
    ecosystems: ecosystems.length,
  }
}

function postsToEthereum(project: Project<'daTrackingConfig'>) {
  return project.daTrackingConfig.some(
    (config) => config.type === 'ethereum' && config.untilBlock === undefined,
  )
}
