import { ps } from '~/server/projects'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { getActiveInteropChainIds } from '../utils/getInteropChains'
import { getInteropTokenOnchainDeployments } from './getInteropTokenOnchainDeployments'
import { getInteropTokenRelations } from './getInteropTokenRelations'
import {
  getInteropTokenRelationsGraph,
  type InteropTokenRelationsGraph,
} from './getInteropTokenRelationsGraph'

const relationsGraphCache = new FrontendInMemoryCache(
  'getInteropTokenRelationsGraphById',
)

export function getInteropTokenRelationsGraphById(
  tokenId: string,
): Promise<InteropTokenRelationsGraph | undefined> {
  return relationsGraphCache.get(
    {
      key: ['interop-token-relations-graph', tokenId],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getInteropTokenRelationsGraphData(tokenId),
  )
}

async function getInteropTokenRelationsGraphData(
  tokenId: string,
): Promise<InteropTokenRelationsGraph | undefined> {
  const deployments = await getInteropTokenOnchainDeployments(
    tokenId,
    getActiveInteropChainIds(),
  )
  if (deployments.length === 0) return undefined

  const [relations, projectsWithChains, interopProjects] = await Promise.all([
    getInteropTokenRelations(tokenId, deployments),
    ps.getProjects({ select: ['chainConfig'] }),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  return getInteropTokenRelationsGraph(
    tokenId,
    deployments,
    relations,
    projectsWithChains,
    interopProjects,
  )
}
