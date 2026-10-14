import { env } from '~/env'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { getTokenGraphs } from '~/server/features/tokens/getTokenGraphs'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'

export interface HomeProjectCounts {
  l2: number
  interop: number
  interopProtocols: number
  privacy: number
  ossification: number
  /** Undefined when the tokens page is off or its data failed to load */
  tokens: number | undefined
  zkCatalog: number
  ecosystems: number
}

export async function getHomeProjectCounts(): Promise<HomeProjectCounts> {
  const [
    l2Projects,
    zkProjects,
    ecosystems,
    privacy,
    interopProtocols,
    ossification,
    tokens,
  ] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
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
    getOssificationProjectCount(),
    env.CLIENT_SIDE_TOKENS_PAGE ? getTokensCount() : undefined,
  ])

  const interopChains = getInteropChains().filter((chain) => !chain.isUpcoming)

  return {
    l2: l2Projects.length,
    interop: interopChains.length,
    interopProtocols: interopProtocols.length,
    privacy: privacy.length,
    ossification,
    tokens,
    zkCatalog: zkProjects.length,
    ecosystems: ecosystems.length,
  }
}

// Counts what the ossification page lists, see `getOssificationEntries`.
async function getOssificationProjectCount(): Promise<number> {
  const projects = await ps.getProjects({
    where: ['ossificationHistory'],
    optional: ['scalingInfo', 'privacyInfo', 'defiInfo'],
    whereNot: ['archivedAt'],
  })
  return projects.filter(
    (project) => project.scalingInfo || project.privacyInfo || project.defiInfo,
  ).length
}

// The tokens live in a separate database, which should not take the home page down.
async function getTokensCount(): Promise<number | undefined> {
  try {
    return (await getTokenGraphs()).tiles.length
  } catch (error) {
    getLogger().warn('Home tokens count failed', { error })
    return undefined
  }
}
