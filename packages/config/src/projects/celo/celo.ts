import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('celo')

export const celo: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1718876598), // '2024-06-20T09:43:18Z'
  additionalBadges: [BADGES.Other.MigratedFromL1, BADGES.DA.EigenDA],
  daProvider: EIGENDA_DA_PROVIDER,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Celo',
    slug: 'celo',
    description:
      'Celo is an Ethereum Optimium based on the OP stack, scaling real-world solutions & leading a thriving new digital economy for all.',
    category: 'Optimium',
    stack: 'OP Stack',
    links: {
      websites: ['https://celo.org/'],
      documentation: ['https://docs.celo.org/'],
      explorers: ['https://explorer.celo.org/mainnet/', 'https://celoscan.io'],
      repositories: ['https://github.com/celo-org'],
      socialMedia: [
        'https://x.com/Celo',
        'https://discord.com/invite/celo',
        'https://blog.celo.org/',
      ],
    },
  },
  associatedTokens: ['CELO'],
  chainConfig: {
    gasTokens: ['CELO'],
    name: 'celo',
    chainId: 42220,
    explorerUrl: 'https://celoscan.io',
    coingeckoPlatform: 'celo',
    sinceTimestamp: UnixTime(1742960663),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 13112599,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://celo.chainvibes.nl',
        callsPerMinute: 4000,
      },
      {
        type: 'etherscan',
        url: 'https://api.celoscan.io/api',
        contractCreationUnsupported: true,
      },
    ],
  },
  nonTemplateContractRisks: CONTRACTS.UPGRADE_NO_DELAY_RISK,
  isNodeAvailable: 'UnderReview',
  discovery,
  genesisTimestamp: UnixTime(1742960663), // ts of first batch posted, block 0 from the rpc: 1587571200
  milestones: [
    {
      title: 'Celo becomes an Ethereum L2',
      url: 'https://blog.celo.org/celo-l2-is-now-live-a-note-from-our-founders-c585bd57b5fa',
      date: '2025-03-26T00:00:00.00Z',
      description:
        'Celo migrates from an L1 to an L2 architecture on Ethereum and EigenDA.',
      type: 'general',
    },
  ],
  activityConfig: {
    type: 'block',
    startBlock: 31060842,
    adjustCount: { type: 'SubtractOne' },
  },
})
