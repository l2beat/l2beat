import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { getActiveInteropChainIds } from '../utils/getInteropChains'
import { getRelationsGraphProjects } from '../utils/getRelationsGraphProjects'
import { getInteropTokenOnchainDeployments } from './getInteropTokenOnchainDeployments'
import { getInteropTokenRelations } from './getInteropTokenRelations'
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
  const deployments = await getInteropTokenOnchainDeployments(
    tokenId,
    getActiveInteropChainIds(),
  )
  if (deployments.length === 0) return undefined

  const [relations, [projectsWithChains, interopProjects]] = await Promise.all([
    getInteropTokenRelations(tokenId, deployments),
    getRelationsGraphProjects(),
  ])

  return getInteropTokenRelationsGraph(
    tokenId,
    deployments,
    relations,
    projectsWithChains,
    interopProjects,
  )
}
