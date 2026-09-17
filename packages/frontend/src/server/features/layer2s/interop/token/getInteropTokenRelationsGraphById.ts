import { env } from '~/env'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { getAggregatedInteropSnapshotTimestamp } from '../utils/getAggregatedInteropTimestamp'
import { getActiveInteropChainIds } from '../utils/getInteropChains'
import { getRelationsGraphProjects } from '../utils/getRelationsGraphProjects'
import { getInteropTokenOnchainDeployments } from './getInteropTokenOnchainDeployments'
import { getInteropTokenPairStats } from './getInteropTokenPairStats'
import {
  getInteropTokenRelationsGraph,
  type InteropTokenRelationsGraph,
} from './getInteropTokenRelationsGraph'

const relationsGraphCache = new FrontendInMemoryCache(
  'getInteropTokenRelationsGraphById',
)

/** For callers without their own cache, like the tRPC procedure. */
export function getCachedInteropTokenRelationsGraphById(
  tokenId: string,
): Promise<InteropTokenRelationsGraph | undefined> {
  return relationsGraphCache.get(
    {
      key: ['interop-token-relations-graph', tokenId],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getInteropTokenRelationsGraphById(tokenId),
  )
}

export async function getInteropTokenRelationsGraphById(
  tokenId: string,
): Promise<InteropTokenRelationsGraph | undefined> {
  const [snapshotTimestamp, [projectsWithChains, interopProjects]] =
    await Promise.all([
      env.MOCK ? undefined : getAggregatedInteropSnapshotTimestamp(),
      getRelationsGraphProjects(),
    ])
  const [{ deployments, routes }, pairStats] = await Promise.all([
    getInteropTokenOnchainDeployments(tokenId, getActiveInteropChainIds()),
    getInteropTokenPairStats(tokenId, snapshotTimestamp, interopProjects),
  ])
  if (deployments.length === 0) return undefined

  return getInteropTokenRelationsGraph(
    tokenId,
    deployments,
    { routes, pairStats },
    projectsWithChains,
    interopProjects,
  )
}
