import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DA_BRIDGES, DA_LAYERS, RISK_VIEW } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { type Upgradeability, zkStackL2 } from './templates/zkStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('treasure')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const treasure: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsKey: 'treasureValidators',
  additionalBadges: [Badge.DA.CustomDA],
  addedAt: new UnixTime(1719931843), // 2024-07-02T14:50:43Z
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Treasure',
    slug: 'treasure',
    tvlWarning: {
      content:
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
  rpcUrl: 'https://rpc.treasure.lol',
  chainConfig: {
    name: 'treasure',
    chainId: 61166,
    explorerUrl: 'https://treasurescan.io',
    minTimestampForTvl: new UnixTime(1732617294),
  },
  diamondContract: discovery.getContract('TreasureZkEvm'),
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
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
      ...zkStackUpgrades,
    }),
  ],
  daProvider: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    riskView: {
      ...RISK_VIEW.DATA_EXTERNAL,
      sources: [
        {
          contract: 'ExecutorFacet',
          references: [
            'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L53',
          ],
        },
      ],
    },
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
          url: 'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L53',
        },
      ],
    },
  },
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://x.com/Treasure_DAO/status/1865101292752040255',
      date: '2024-12-11T00:00:00Z',
      description: 'Treasure mainnet launches for all users.',
      type: 'general',
    },
  ],
})
