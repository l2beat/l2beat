import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { CONTRACTS, DA_LAYERS } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('celo')
const chainId = 42220

export const celo: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  capability: 'universal',
  addedAt: UnixTime(1718876598), // '2024-06-20T09:43:18Z'
  additionalBadges: [BADGES.Other.MigratedFromL1, BADGES.Stack.OPSuccinct],
  daProvider: EIGENDA_DA_PROVIDER(true, DA_LAYERS.ETH_BLOBS),
  isPartOfSuperchain: true,
  additionalStateValidationReferences: [
    {
      url: 'https://docs.celo.org/home/protocol/challengers',
      title: 'Celo Challengers',
    },
  ],
  architectureImage: 'celo',
  display: {
    name: 'Celo',
    slug: 'celo',
    description:
      'Celo is an Ethereum Optimium based on the OP stack, scaling real-world solutions & leading a thriving new digital economy for all.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://celo.org/', 'https://forum.celo.org/'],
      bridges: ['https://superbridge.app/celo'],
      documentation: ['https://docs.celo.org/'],
      explorers: [
        'https://explorer.celo.org/mainnet/',
        'https://celoscan.io',
        'https://celo.blockscout.com/',
      ],
      repositories: ['https://github.com/celo-org'],
      socialMedia: [
        'https://x.com/Celo',
        'https://discord.com/invite/celo',
        'https://blog.celo.org/',
      ],
      other: ['https://growthepie.com/chains/celo'],
    },
  },
  hasSuperchainScUpgrades: true,
  associatedTokens: ['CELO'],
  chainConfig: {
    gasTokens: ['CELO'],
    name: 'celo',
    chainId,
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
        chainId,
        contractCreationUnsupported: true,
      },
    ],
  },
  isNodeAvailable: 'UnderReview',
  discovery,
  genesisTimestamp: UnixTime(1742960663), // ts of first batch posted, block 0 from the rpc: 1587571200
  milestones: [
    {
      title: 'Jello hardfork activates OP Succinct Lite',
      url: 'https://forum.celo.org/t/jello-hardfork-successfully-activates-on-mainnet-introducing-op-succinct-lite/12754',
      date: '2025-12-10T00:00:00.00Z',
      description:
        'Celo implements OP Succinct Lite, introducing ZK proofs for dispute resolution and DA verification.',
      type: 'general',
    },
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
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: discovery.getContract('SystemConfig').sinceBlock ?? 0,
      inbox: ChainSpecificAddress.address(
        discovery.getContractValue('SystemConfig', 'sequencerInbox'),
      ),
      sequencers: [
        ChainSpecificAddress.address(
          discovery.getContractValue('SystemConfig', 'batcherHash'),
        ),
      ],
    },
    {
      type: 'eigen-da',
      customerId: '0xecf08b0a4f196e06e9aece95d5dd724bc121f09c',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1741806000),
    },
  ],
})
