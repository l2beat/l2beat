import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'

export interface HomeProjectCounts {
  scaling: number
  /** Number of chains tracked for interop. */
  interop: number
  /** Number of interop protocols (projects with an interopConfig). */
  interopProtocols: number
  privacy: number
  dataAvailability: number
  zkCatalog: number
  ecosystems: number
}

export async function getHomeProjectCounts(): Promise<HomeProjectCounts> {
  const [
    scaling,
    daLayers,
    customDa,
    zkProjects,
    ecosystems,
    privacy,
    interopProtocols,
  ] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      where: ['daLayer'],
      whereNot: ['archivedAt'],
    }),
    // Custom DA systems (DACs) shown on the "custom" tab of the DA page.
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
  ])

  const interopChains = getInteropChains().filter((chain) => !chain.isUpcoming)

  return {
    scaling: scaling.length,
    interop: interopChains.length,
    interopProtocols: interopProtocols.length,
    privacy: privacy.length,
    dataAvailability: daLayers.length + customDa.length,
    zkCatalog: zkProjects.length,
    ecosystems: ecosystems.length,
  }
}
