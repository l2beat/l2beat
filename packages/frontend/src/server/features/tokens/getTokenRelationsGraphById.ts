import { mapInteropChainsToWithIcons } from '~/pages/interop/utils/mapInteropChainsToWithIcons'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getChainDisplayInfo } from '../scaling/interop/token/getChainDisplayInfo'
import { getInteropTokenOnchainDeployments } from '../scaling/interop/token/getInteropTokenOnchainDeployments'
import {
  getInteropTokenRelationsGraph,
  type InteropTokenRelationsGraph,
} from '../scaling/interop/token/getInteropTokenRelationsGraph'
import { getInteropChains } from '../scaling/interop/utils/getInteropChains'

/**
 * The full, interactive graph for one token — what a card on /tokens opens.
 * The cards themselves ship a reduced shape, so this is fetched on demand
 * rather than multiplied across the whole grid.
 */
export async function getTokenRelationsGraphById(
  tokenId: string,
): Promise<InteropTokenRelationsGraph> {
  const activeInteropChains = getInteropChains().filter(
    (chain) => !chain.isUpcoming,
  )
  const activeChainIds = activeInteropChains.map((chain) => chain.id)

  const [deployments, projectsWithChains, interopProjects] = await Promise.all([
    getInteropTokenOnchainDeployments(tokenId, activeChainIds),
    ps.getProjects({ select: ['chainConfig'] }),
    // A separate query on purpose: `select` is an AND, and interop projects
    // are not necessarily chains.
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  const chainInfo = getChainDisplayInfo(
    deployments.map((deployment) => deployment.chain),
    mapInteropChainsToWithIcons(manifest, activeInteropChains),
    projectsWithChains,
  )

  return getInteropTokenRelationsGraph(
    tokenId,
    deployments,
    chainInfo,
    interopProjects,
  )
}
