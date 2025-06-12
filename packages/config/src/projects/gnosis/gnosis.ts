import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const chainId = 100

export const gnosis: BaseProject = {
  id: ProjectId('gnosis'),
  slug: 'gnosis',
  name: 'Gnosis Chain',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2023-01-01')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      "Gnosis Chain is a community-owned EVM-based network operated by a diverse set of validators around the world. It is one of Ethereum's first sidechains.",
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'gnosis',
    chainId,
    explorerUrl: 'https://gnosisscan.io',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 21022491,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'etherscan',
        chainId,
        contractCreationUnsupported: true,
      },
    ],
  },
}
