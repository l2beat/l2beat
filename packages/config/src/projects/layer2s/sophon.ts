import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ESCROW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { type Upgradeability, zkStackL2 } from './templates/zkStack'

const discovery = new ProjectDiscovery('sophon')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const sophon: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  additionalBadges: [Badge.DA.Avail],
  addedAt: new UnixTime(1716536140), // 2024-05-24T07:35:40Z
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
  rpcUrl: 'https://rpc.sophon.xyz/',
  chainConfig: {
    name: 'sophon',
    chainId: 50104,
    explorerUrl: 'https://explorer.sophon.xyz',
    minTimestampForTvl: new UnixTime(1729531437),
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
          url: 'https://etherscan.io/address/0xBB13642F795014E0EAC2b0d52ECD5162ECb66712#code#F1#L53',
        },
      ],
    },
    bridge: DA_BRIDGES.NONE,
  },
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
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
      ...zkStackUpgrades,
    }),
    discovery.getEscrowDetails({
      address: discovery.getContract('L1USDCBridge').address,
      tokens: ['USDC'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'External contract escrowing USDC deposited to Sophon via canonical messaging.',
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
