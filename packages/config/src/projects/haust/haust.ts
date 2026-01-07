import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('haust')
const bridge = discovery.getContract('AgglayerBridge')

export const haust: ScalingProject = agglayer({
  capability: 'universal',
  addedAt: UnixTime(1736600180), // 2024-11-12T10:56:20Z
  overridingPurposes: ['Exchange'],
  display: {
    name: 'Haust Network',
    slug: 'haust',
    description:
      'Haust Network is a Layer 2 blockchain built on the Polygon CDK, integrating with the Agglayer and Account Abstraction from the outset.',
    links: {
      websites: ['https://haust.network/'],
      documentation: ['https://docs.haust.network/'],
      explorers: ['https://haustscan.com/'],
      repositories: ['https://github.com/Haust-Labs'],
      bridges: ['https://haustbridge.com'],
      socialMedia: [
        'https://x.com/HaustNetwork',
        'https://t.me/haustnetwork',
        'https://discord.gg/QWGxjTXD8N',
        'https://medium.com/@haustnetwork',
      ],
    },
  },
  discovery,
  associatedTokens: ['HAUST'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sinceTimestamp: UnixTime(1756808195),
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5a77f1443d16ee5761d310e38b62f77f726bc71c',
        ),
        tokensToAssignFromL1: ['HAUST'],
        // currently uses a bad custom .json config for HAUST TVS that only counts the WHAUST on L2 because circ supply is unknown and there is a massive premint/-bridge on L1/L2 and the rpc censors the preminted balance
      },
    }),
  ],
  chainConfig: {
    name: 'haust',
    chainId: 3864,
    explorerUrl: 'https://haustscan.com',
    gasTokens: ['HAUST'],
    sinceTimestamp: UnixTime(1756808195),
    apis: [
      {
        type: 'rpc',
        url: 'https://haust-network-rpc.eu-north-2.gateway.fm',
        callsPerMinute: 300,
      },
    ],
  },
  milestones: [
    {
      title: 'Haust Public Launch',
      url: 'https://x.com/HaustNetwork/status/1982805150260666681',
      date: '2025-09-27',
      description: 'Haust is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
})
