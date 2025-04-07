import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  ESCROW,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('lens')
const bridge = discovery.getContract('L1NativeTokenVault')

export const lens: ScalingProject = zkStackL2({
  capability: 'universal',
  additionalPurposes: ['Social'],
  additionalBadges: [BADGES.DA.CustomDA],
  addedAt: UnixTime(1716536821), // 2024-05-24T07:47:01Z
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Lens',
    slug: 'lens',
    description:
      "Lens Network is the main social networking hub for the entire user base of Lens Protocol, built using ZKsync's ZK Stack technology.",
    stack: 'ZK Stack',
    links: {
      websites: ['https://lens.xyz'],
      apps: ['https://lens.xyz/mint'],
      documentation: ['https://lens.xyz/docs'],
      explorers: ['https://momoka.lens.xyz', 'https://explorer.lens.xyz/'],
      repositories: ['https://github.com/lens-protocol'],
      socialMedia: [
        'https://hey.xyz/u/lens',
        'https://x.com/lensprotocol',
        'https://discord.com/invite/lensprotocol',
      ],
    },
  },
  discovery,
  diamondContract: discovery.getContract('LensZkEvm'),
  chainConfig: {
    name: 'lens',
    chainId: 232,
    explorerUrl: '',
    sinceTimestamp: UnixTime(1740140786),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.lens.xyz',
        callsPerMinute: 1500,
      },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['LGHO'],
      description:
        'Shared bridge for depositing tokens to Lens and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x8116A750e2091B2bA0D94223e7b20a6A65A279f4',
        ),
        l2EtherAddress: EthereumAddress(
          '0xE5ecd226b3032910CEaa43ba92EE8232f8237553',
        ),
        tokensToAssignFromL1: ['LGHO'],
      },
    }),
    discovery.getEscrowDetails({
      address: discovery.getContract('L1USDCBridge').address,
      tokens: ['USDC'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'External contract escrowing USDC deposited to Lens via canonical messaging.',
    }),
  ],
  daProvider: {
    layer: DA_LAYERS.AVAIL,
    riskView: RISK_VIEW.DATA_AVAIL(false),
    technology: {
      ...TECHNOLOGY_DATA_AVAILABILITY.AVAIL_OFF_CHAIN(false),
      references: [
        {
          title: 'ExecutorFacet - _commitOneBatch() function',
          url: 'https://etherscan.io/address/0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800#code#F1#L46',
        },
      ],
    },
    bridge: DA_BRIDGES.NONE,
  },
  availDa: {
    sinceBlock: 1180000, // roughly 04/03 right before mainnet launch (chain was active before)
    appId: '17',
  },
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://lens.xyz/news/build-socialfi-apps-faster-with-lens-now-on-mainnet', // TODO
      date: '2025-04-04T00:00:00Z',
      description: 'Lens mainnet launches for all users.',
      type: 'general',
    },
  ],
})
