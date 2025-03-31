import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'
import { zkStackL2 } from '../../templates/zkStack'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { DA_BRIDGES, DA_LAYERS, REASON_FOR_BEING_OTHER, RISK_VIEW } from '../../common'
import { BADGES } from '../../common/badges'

const discovery = new ProjectDiscovery('lens')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const lens: ScalingProject = zkStackL2({
  capability: 'universal',
  additionalPurposes: ['Social'],
  additionalBadges: [BADGES.DA.CustomDA],
  addedAt: UnixTime(1716536821), // 2024-05-24T07:47:01Z
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Lens',
    slug: 'lens',
    description: "Lens Network is the main social networking hub for the entire user base of Lens Protocol, built using ZKsync's ZK Stack technology.",
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
  discovery_ZKstackGovL2,
  diamondContract: discovery.getContract('LensZkEvm'),
  chainConfig: {
    name: 'lens',
    chainId: 232,
    explorerUrl: '',
    sinceTimestamp: UnixTime(),
    apis: [
      {
        type: 'rpc',
        url: '',
        callsPerMinute: 1500,
      },
    ],
  },
  nonTemplateEscrows: [
      discovery.getEscrowDetails({
        address: bridge.address,
        tokens: ['GHO'],
        description:
          'Shared bridge for depositing tokens to Lens and other ZK stack chains.',
        sharedEscrow: {
          type: 'ElasticChain',
          l2BridgeAddress: EthereumAddress(
            '0xfC1d5dCD080121DaAF366625581ad490414EF294',
          ),
          l2EtherAddress: EthereumAddress(
            '0x650BE505C391d396A1e0b1f2337EaE77F064fF7f', // unverified
          ),
          // tokensToAssignFromL1: ['MAGIC'], 
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
            url: 'https://etherscan.io/address/0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800#code#F1#L46',
          },
        ],
      },
    },
    milestones: [
      {
        title: 'Mainnet launch',
        url: 'https://x.com/LC', // TODO
        date: '2025-04-01T00:00:00Z',
        description: 'Lens mainnet launches for all users.',
        type: 'general',
      },
    ],
})
