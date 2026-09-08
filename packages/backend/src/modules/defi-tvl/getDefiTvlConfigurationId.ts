import type { ProjectDefiTvlChain } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

interface DefiTvlConfigurationIdentity {
  projectId: ProjectId
  protocolSlug: string
  chains: ProjectDefiTvlChain[]
}

export function getDefiTvlConfigurationId(
  config: DefiTvlConfigurationIdentity,
): string {
  const identity = {
    source: 'defillama',
    metric: 'tvl',
    projectId: config.projectId,
    protocolSlug: config.protocolSlug,
    chains: config.chains
      .map(({ chain, providerChain }) => [chain, providerChain] as const)
      .sort(
        ([chainA, providerChainA], [chainB, providerChainB]) =>
          chainA.localeCompare(chainB) ||
          providerChainA.localeCompare(providerChainB),
      ),
  }

  return createHash('sha1')
    .update(JSON.stringify(identity))
    .digest('hex')
    .slice(0, 12)
}
