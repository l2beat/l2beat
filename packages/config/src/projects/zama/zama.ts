import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const zama: BaseProject = {
  id: ProjectId('zama'),
  slug: 'zama',
  name: 'Zama Gateway',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-06-24')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Zama Gateway is an EVM-compatible chain used by the Zama FHE protocol.',
    links: {
      websites: ['https://www.zama.org'],
      documentation: ['https://docs.zama.org/protocol'],
    },
    badges: [],
  },
  chainConfig: {
    name: 'zama',
    chainId: 261131,
    explorerUrl: 'https://explorer.mainnet.zama.org',
    apis: [
      { type: 'rpc', url: 'https://rpc.mainnet.zama.org', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://explorer.mainnet.zama.org/api' },
      {
        type: 'blockscoutV2',
        url: 'https://explorer.mainnet.zama.org/api/v2',
      },
    ],
  },
}
