import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'
import { ScalingProject } from '../../internalTypes'

const chainId = 100

export const gnosis: ScalingProject = {
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
    name: 'Gnosis Chain',
    slug: 'gnosis'
    purposes: ['Universal'],
    description:
      "Gnosis Chain is a community-owned EVM-based network operated by a diverse set of validators around the world. It is one of Ethereum's first sidechains and is building the Ethereum Economic Zone (EEZ).",
    links: {
      websites: ['https://gnosis.io/chain'],
      explorers: ['https://gnosisscan.io/', 'https://gnosis.blockscout.com/'],
      bridges: ['https://bridge.gnosischain.com'],
      repositories: ['https://github.com/gnosischain/go-ethereum'],
      documentation: ['https://docs.gnosischain.com/'],
      socialMedia: ['https://x.com/gnosischain', 'https://discord.com/invite/gnosis', 'https://t.me/gnosischain', 'https://forum.gnosis.io/', 'https://gnosis.io/blog']
    },
  },
  proofSystem: undefined,
  stage: {
  stage: 'NotApplicable'
  },
  config: {
  associatedTokens: ['GNO'],
  escrows: [],
  activityConfig: {
  type: 'block',
  startBlock: 1
  }
  }
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
    apis: [{ type: 'etherscan', chainId }],
  },
}
