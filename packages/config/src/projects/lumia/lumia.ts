import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('lumia')
const bridge = discovery.getContract('AgglayerBridge')

export const lumia: ScalingProject = agglayer({
  addedAt: UnixTime(1718181773), // 2024-06-12T08:42:53Z
  capability: 'universal',
  additionalPurposes: ['Restaking', 'RWA'],
  display: {
    name: 'Lumia Prism',
    slug: 'lumia',
    description:
      'Lumia is a sovereign Agglayer chain focusing on real world assets, restaking and account abstraction.',
    links: {
      websites: ['https://lumia.org/'],
      bridges: ['https://bridge.lumia.org/'],
      explorers: ['https://explorer.lumia.org/', 'https://lens.lumia.org/'],
      documentation: ['https://docs.lumia.org/'],
      repositories: [
        'https://github.com/orionprotocol/cdk-validium-permissionless-node',
      ],
      socialMedia: [
        'https://x.com/BuildOnLumia',
        'https://t.me/lumia_community',
        'https://discord.gg/Lumia',
      ],
    },
  },
  discovery,
  chainConfig: {
    name: 'lumia',
    chainId: 994873017,
    gasTokens: ['LUMIA'],
    explorerUrl: 'https://explorer.lumia.org',
    sinceTimestamp: UnixTime(1719499031),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc.lumia.org',
        callsPerMinute: 300,
      },
    ],
  },
  associatedTokens: ['LUMIA'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
        ),
        tokensToAssignFromL1: ['LUMIA'],
      },
    }),
  ],
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0x4a9633f61bf7eacf4cfffefccc1e8a561fdaacfbed6470573463e28304b3906d#eventlog',
      date: '2025-10-02',
      description:
        'Lumia stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'Lumia Mainnet Launch',
      url: 'https://x.com/BuildOnLumia/status/1895133948096676276',
      date: '2025-02-27',
      description: 'Lumia is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
})
