import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('zkcandy')
const bridge = discovery.getContract('L1NativeTokenVault')

export const zkcandy: ScalingProject = zkStackL2({
  capability: 'universal',
  addedAt: UnixTime(1706088230), // 2024-01-24T09:23:50Z
  additionalPurposes: ['Gaming'],
  additionalBadges: [BADGES.DA.CustomDA],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'zkCandy',
    slug: 'zkcandy',
    description:
      "zkCandy is a Gaming Validium built on ZKsync's ZK stack for the next generation of GameFi - Supercharged by iCandy, the largest game developer in ANZ and SEA.",
    stack: 'ZK Stack',
    links: {
      websites: ['https://zkcandy.io', 'https://icandy.io/'],
      socialMedia: [
        'https://twitter.com/zkCandyHQ',
        'https://discord.gg/zkcandy',
        'https://t.me/zkcandy',
      ],
    },
  },
  discovery,
  diamondContract: discovery.getContract('LensZkEvm'),
  chainConfig: {
    name: 'zkcandy',
    chainId: 320,
    explorerUrl: 'https://explorer.zkcandy.io/',
    sinceTimestamp: UnixTime(1741880977),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.zkcandy.io',
        callsPerMinute: 1500,
      },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['ETH'],
      description:
        'Shared bridge for depositing tokens to zkCandy and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x8116A750e2091B2bA0D94223e7b20a6A65A279f4',
        ),
        l2EtherAddress: EthereumAddress(
          '0xE5ecd226b3032910CEaa43ba92EE8232f8237553',
        ),
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
      url: 'https://zkcandy.medium.com/connecting-to-the-zkcandy-mainnet-62be6de3153d',
      date: '2025-04-07T00:00:00Z',
      description: 'zkCandy mainnet launches for all users.',
      type: 'general',
    },
  ],
})
