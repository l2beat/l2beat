import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const avalanche: BaseProject = {
  id: ProjectId('avalanche'),
  slug: 'avalanche',
  name: 'Avalanche',
  shortName: undefined,
  addedAt: UnixTime(1662628329),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: '',
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'avalanche',
    chainId: 43114,
    explorerUrl: 'https://snowtrace.io',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 11907934,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://avalanche.drpc.org',
      },
    ],
  },
}
