import type { ProjectDefiTvlChain } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

interface DefiTvlConfigurationIdentity {
  projectId: ProjectId
  protocolSlug: string
  sinceTimestamp: UnixTime
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
    sinceTimestamp: config.sinceTimestamp,
    chains: [...config.chains].sort((a, b) => a.chain.localeCompare(b.chain)),
  }

  return createHash('sha1')
    .update(JSON.stringify(identity))
    .digest('hex')
    .slice(0, 12)
}
