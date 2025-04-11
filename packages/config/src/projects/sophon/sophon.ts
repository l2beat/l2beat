import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('sophon')

const bridge = discovery.getContract('L1NativeTokenVault')

export const sophon: ScalingProject = zkStackL2({
  discovery,
  additionalBadges: [BADGES.DA.Avail],
  addedAt: UnixTime(1716536140), // 2024-05-24T07:35:40Z
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Sophon',
    slug: 'sophon',
    description:
      'Sophon is a consumer-centric ecosystem on a ZK Stack Validium L2, designed to bring onchain benefits to everyday lifestyle and entertainment applications.',
    links: {
      websites: ['https://sophon.xyz/'],
      apps: ['https://portal.sophon.xyz/', 'https://farm.sophon.xyz/'],
      documentation: ['https://docs.sophon.xyz/sophon'],
      explorers: ['https://explorer.sophon.xyz/'],
      repositories: ['https://github.com/sophon-org'],
      socialMedia: [
        'https://x.com/sophon',
        'https://blog.sophon.xyz/',
        'https://t.me/SophonHub',
        'https://discord.gg/sophonhub',
      ],
    },
  },
  associatedTokens: ['SOPH'],
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'sophon',
    chainId: 50104,
    gasTokens: ['SOPH'],
    explorerUrl: 'https://explorer.sophon.xyz',
    sinceTimestamp: UnixTime(1729531437),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.sophon.xyz/',
        callsPerMinute: 1500,
      },
    ],
  },
  diamondContract: discovery.getContract('SophonZkEvm'),
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: [
        'ETH',
        'USDT',
        'BEAM',
        'stAethir',
        'PEPE',
        'wstETH',
        'weETH',
        'sDAI',
        'DAI',
        'WBTC',
        'stAZUR',
        'stAVAIL',
        'OPN',
        'USDC',
      ], // 'SOPH' not on CG yet
      description:
        'Shared bridge for depositing tokens to Treasure and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x954ba8223a6BFEC1Cc3867139243A02BA0Bc66e4',
        ),
        l2EtherAddress: EthereumAddress(
          '0x72af9F169B619D85A47Dfa8fefbCD39dE55c567D',
        ),
        tokensToAssignFromL1: [], // 'SOPH' not on CG yet
      },
    }),
  ],
  availDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    appId: '17',
  },
  milestones: [
    {
      title: 'Mainnet public launch',
      url: 'https://x.com/sophon/status/1861771965284896996',
      date: '2024-12-18T00:00:00Z',
      description: 'Sophon Mainnet is now open for all users.',
      type: 'general',
    },
    {
      title: 'Mainnet private launch',
      url: 'https://blog.sophon.xyz/the-road-to-mainnet/',
      date: '2024-09-22T00:00:00Z',
      description: 'Sophon launches their mainnet privately.',
      type: 'general',
    },
  ],
})
