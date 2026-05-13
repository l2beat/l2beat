import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { ps } from '~/server/projects'

export interface OverviewProjectCounts {
  scaling: number
  interop: number
  privacy: number
  dataAvailability: number
  zkCatalog: number
  ecosystems: number
}

// TODO: replace with a real count once Privacy projects are tracked in the projects service.
const MOCKED_PRIVACY_PROJECT_COUNT = 7

export async function getOverviewProjectCounts(): Promise<OverviewProjectCounts> {
  const [scaling, daLayers, zkProjects, ecosystems] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
    ps.getProjects({
      where: ['daLayer'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      where: ['zkCatalogInfo'],
    }),
    ps.getProjects({
      where: ['ecosystemConfig'],
    }),
  ])

  const interopChains = getInteropChains().filter((chain) => !chain.isUpcoming)

  return {
    scaling: scaling.length,
    interop: interopChains.length,
    privacy: MOCKED_PRIVACY_PROJECT_COUNT,
    dataAvailability: daLayers.length,
    zkCatalog: zkProjects.length,
    ecosystems: ecosystems.length,
  }
}
