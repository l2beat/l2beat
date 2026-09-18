import type { UnixTime } from '@l2beat/shared-pure'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { getAggregatedInteropSnapshotTimestamp } from '../utils/getAggregatedInteropTimestamp'
import { getActiveInteropChainIds } from '../utils/getInteropChains'
import {
  getRelationsGraphProjects,
  type RelationsGraphProjects,
} from '../utils/getRelationsGraphProjects'
import { getInteropTokenOnchainDeployments } from './getInteropTokenOnchainDeployments'
import { getInteropTokenPairStats } from './getInteropTokenPairStats'
import {
  getInteropTokenRelationsGraph,
  type InteropTokenRelationsGraph,
} from './getInteropTokenRelationsGraph'

const relationsGraphCache = new FrontendInMemoryCache(
  'getInteropTokenRelationsGraphById',
)

export interface InteropTokenRelationsGraphContext {
  snapshotTimestamp?: UnixTime
  projects?: RelationsGraphProjects
}

export function getInteropTokenRelationsGraphById(
  tokenId: string,
  context: InteropTokenRelationsGraphContext = {},
): Promise<InteropTokenRelationsGraph | undefined> {
  return relationsGraphCache.get(
    {
      key: ['interop-token-relations-graph', tokenId],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadInteropTokenRelationsGraph(tokenId, context),
  )
}

async function loadInteropTokenRelationsGraph(
  tokenId: string,
  context: InteropTokenRelationsGraphContext,
): Promise<InteropTokenRelationsGraph | undefined> {
  const [snapshotTimestamp, { projectsWithChains, interopProjects }] =
    await Promise.all([
      context.snapshotTimestamp ?? getAggregatedInteropSnapshotTimestamp(),
      context.projects ?? getRelationsGraphProjects(),
    ])
  const [{ deployments, routes }, pairStats] = await Promise.all([
    getInteropTokenOnchainDeployments(tokenId, getActiveInteropChainIds()),
    snapshotTimestamp
      ? getInteropTokenPairStats(tokenId, snapshotTimestamp, interopProjects)
      : undefined,
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
