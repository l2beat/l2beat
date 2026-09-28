import type { UnixTime } from '@l2beat/shared-pure'
import { createInteropProjectResolver } from '../utils/createInteropProjectResolver'
import { getActiveInteropChainIds } from '../utils/getInteropChains'
import type { RelationsGraphProjects } from '../utils/getRelationsGraphProjects'
import { getInteropTokenOnchainDeployments } from './getInteropTokenOnchainDeployments'
import { getInteropTokenPairStats } from './getInteropTokenPairStats'
import {
  getInteropTokenRelationsGraph,
  type InteropTokenRelationsGraph,
} from './getInteropTokenRelationsGraph'

export async function getInteropTokenRelationsGraphById(
  tokenId: string,
  {
    snapshotTimestamp,
    projects: { projectsWithChains, interopProjects },
  }: {
    snapshotTimestamp: UnixTime | undefined
    projects: RelationsGraphProjects
  },
): Promise<InteropTokenRelationsGraph | undefined> {
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
    createInteropProjectResolver(interopProjects),
  )
}
