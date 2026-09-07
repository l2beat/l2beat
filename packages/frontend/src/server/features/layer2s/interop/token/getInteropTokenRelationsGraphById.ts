import { ps } from '~/server/projects'
import { getInteropChains } from '../utils/getInteropChains'
import { getInteropTokenOnchainDeployments } from './getInteropTokenOnchainDeployments'
import { getInteropTokenRelations } from './getInteropTokenRelations'
import {
  getInteropTokenRelationsGraph,
  type InteropTokenRelationsGraph,
} from './getInteropTokenRelationsGraph'

/**
 * The full, interactive graph of one token's deployments. Undefined when the
 * token has no deployments to draw.
 */
export async function getInteropTokenRelationsGraphById(
  tokenId: string,
): Promise<InteropTokenRelationsGraph | undefined> {
  const activeChainIds = getInteropChains()
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)
  const deployments = await getInteropTokenOnchainDeployments(
    tokenId,
    activeChainIds,
  )
  if (deployments.length === 0) return undefined

  const [relations, projectsWithChains, interopProjects] = await Promise.all([
    getInteropTokenRelations(tokenId, deployments),
    ps.getProjects({ select: ['chainConfig'] }),
    // A separate query on purpose: `select` is an AND, and interop projects
    // are not necessarily chains.
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
