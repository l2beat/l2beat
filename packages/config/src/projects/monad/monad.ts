import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const monad: BaseProject = {
  id: ProjectId('monad'),
  slug: 'monad',
  name: 'Monad',
  shortName: 'Monad',
  addedAt: UnixTime(1775055245),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'Parallelly executed EVM-compatible Layer 1.',
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'monad',
    chainId: 143,
    explorerUrl: 'https://monadscan.com',
    apis: [{ type: 'rpc', url: 'https://rpc4.monad.xyz' }],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 9248132,
        version: '3',
      },
    ],
  },
}
