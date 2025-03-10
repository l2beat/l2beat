import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DA_BRIDGES, DA_LAYERS, RISK_VIEW } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../internalTypes'
import { BADGES } from '../badges'
import { type Upgradeability, zkStackL2 } from './templates/zkStack'

const discovery = new ProjectDiscovery('treasure')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const treasure: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  additionalBadges: [BADGES.DA.CustomDA],
  addedAt: UnixTime(1719931843), // 2024-07-02T14:50:43Z
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Treasure',
    slug: 'treasure',
    tvlWarning: {
      value:
        'The total TVS includes illiquid MAGIC tokens that were pre-bridged via the canonical bridge to support external bridging. L2BEAT is working on a fix.',
      sentiment: 'warning',
    },
    description:
      'Treasure is a gaming-specific L2 built on ZKsync, the Elastic Network. Treasure offers an end-to-end tech stack for developers and consumer apps to build the next generation of gaming.',
    links: {
      websites: ['https://treasure.lol/'],
      apps: ['https://app.treasure.lol'],
      documentation: ['https://docs.treasure.lol'],
      explorers: ['https://treasurescan.io'],
      repositories: ['https://github.com/TreasureProject'],
      socialMedia: [
        'https://x.com/Treasure_DAO',
        'https://discord.gg/treasuredao',
        'https://youtube.com/@PlayOnTreasure',
        'https://t.me/playontreasure',
      ],
    },
  },
  associatedTokens: ['MAGIC'],
  chainConfig: {
    name: 'treasure',
    chainId: 61166,
    explorerUrl: 'https://treasurescan.io',
    sinceTimestamp: UnixTime(1732617294),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.treasure.lol',
        callsPerMinute: 1500,
      },
    ],
  },
  diamondContract: discovery.getContract('TreasureZkEvm'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['MAGIC'],
      description:
        'Shared bridge for depositing tokens to Treasure and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0xfC1d5dCD080121DaAF366625581ad490414EF294',
        ),
        l2EtherAddress: EthereumAddress(
          '0x650BE505C391d396A1e0b1f2337EaE77F064fF7f', // unverified
        ),
        tokensToAssignFromL1: ['MAGIC'], // will apparently be bridged externally at a later point
      },
    }),
  ],
  daProvider: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    riskView: RISK_VIEW.DATA_EXTERNAL,
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the centralized Sequencer.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'ExecutorFacet - _commitOneBatch() function',
          url: 'https://etherscan.io/address/0xBB13642F795014E0EAC2b0d52ECD5162ECb66712#code#F1#L53',
        },
      ],
    },
  },
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://x.com/Treasure_DAO/status/1865101292752040255',
      date: '2024-12-11T00:00:00Z',
      description: 'Treasure mainnet launches for all users.',
      type: 'general',
    },
  ],
})
