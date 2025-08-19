import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const chainId = 9075

export const gateway: BaseProject = {
  id: ProjectId('gateway'),
  slug: 'gateway',
  name: 'Gateway',
  shortName: 'Gateway',
  addedAt: UnixTime(1753868762),
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
