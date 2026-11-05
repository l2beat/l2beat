import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const chainId = 9075

export const gateway: BaseProject = {
  id: ProjectId('gateway'),
  slug: 'gateway',
  name: 'Gateway',
  shortName: 'Gateway',
  aliases: ['ZKsync Gateway', 'Elastic Chain'],
  addedAt: UnixTime(1753868762),
  // removed from the BridgeHub settlement-layer whitelist, last batch executed 2026-02-20
  archivedAt: UnixTime(1793700599), // 2026-11-03T10:09:59Z
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'Aggregation Layer 2 for the Elastic Chain Ecosystem.',
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'gateway',
    chainId,
    untilTimestamp: UnixTime(1793700599),
    explorerUrl: 'https://gateway.explorer.zksync.io',
    multicallContracts: [],
    apis: [
      {
        type: 'routescan',
        url: 'https://block-explorer-api.era-gateway-mainnet.zksync.dev/api',
      },
    ],
  },
}
