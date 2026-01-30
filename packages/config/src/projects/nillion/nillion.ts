import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('nillion')
const genesisTimestamp = UnixTime(1765911289)

export const nillion: ScalingProject = opStackL2({
  addedAt: UnixTime.now(),
  additionalBadges: [BADGES.RaaS.Conduit, BADGES.Other.MigratedFromL1],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Nillion',
    slug: 'nillion',
    description:
      'Nillion is an OP Stack Optimium on Ethereum. It serves as the token bridge for the Nillion Network, a computation network focused on privacy-preserving data processing.',
    links: {
      websites: ['https://nillion.com/'],
      bridges: ['https://bridge.nillion.network/'],
      documentation: ['https://docs.nillion.com/'],
      explorers: ['https://explorer.nillion.network/'],
      repositories: ['https://github.com/NillionNetwork'],
      socialMedia: [
        'https://x.com/nillion',
        'https://discord.gg/nillionnetwork',
        'https://t.me/nillionnetwork',
      ],
    },
  },
  associatedTokens: ['NIL'],
  chainConfig: {
    name: 'nillion',
    chainId: 98875,
    explorerUrl: 'https://explorer.nillion.network',
    sinceTimestamp: genesisTimestamp,
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.nillion.network',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://explorer.nillion.network/api',
      },
      {
        type: 'blockscoutV2',
        url: 'https://explorer.nillion.network/api/v2/',
      },
    ],
  },
  genesisTimestamp,
  isNodeAvailable: false,
  milestones: [
    {
      title: 'Nillion Migrates to Ethereum',
      url: 'https://nillion.com/news/nillion-now-on-ethereum/',
      date: '2026-01-27T00:00:00Z',
      description:
        'Nillion completes migration from Cosmos to Ethereum L2, enabling NIL token bridging and staking.',
      type: 'general',
    },
  ],
})
