import { ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { NUGGETS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('symbiosis')

export const symbiosis: Bridge = {
  type: 'bridge',
  id: ProjectId('symbiosis'),
  display: {
    name: 'Symbiosis',
    slug: 'symbiosis',
    description:
        'Symbiosis is a cross-chain liquidity aggregation protocol. Best rates for any to any token swaps regardless of the blockchain network: Avalanche, BNB, Boba, Ethereum, Polygon, ZkSync and Arbitrum supported.',
    links: {
      websites: ['https://symbiosis.finance/'],
      repositories: ['https://github.com/symbiosis-finance'],
      socialMedia: [
        'https://t.me/symbiosis_finance',
        'https://blog.symbiosis.finance/',
        'https://twitter.com/symbiosis_fi',
      ],
    },
  },
  riskView: {
    validatedBy: { // TODO sourceUpgradeability
      value: 'Various AMBs',
      description:
          'For BNB Multichain is used, for other chains their native AMBs are used.',
      sentiment: 'warning',
    },
    sourceUpgradeability: { // TODO sourceUpgradeability
      value: 'Yes',
      description:
          'Bridge cannot be upgraded but 3/6 Admin Multisig can move all funds out of the bridge via admin functions with no warning.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL, // TODO
  },
  technology: {
    destination: [
      'Ethereum',
      'BNB Chain',
      'Avalanche',
      'Polygon',
      'Telos',
      'Kava',
      'Boba Ethereum',
      'Boba BNB',
      'ZkSync',
      'Arbitrum One',
      'Optimism',
      'Arbitrum Nova',
      'Polygon zkEVM',
    ],
    category: 'Hybrid',
    principleOfOperation: { // TODO whole principleOfOperation section
      name: 'Principle of operation',
      description:
        'StarGate is a Liquidity Network. It relies on liquidity providers to supply tokens to liquidity pools on each chain. \
        Users can swap tokens between chains by transferring their tokens to a pool and receive token from the pool on the destination chain.',
      references: [],
      risks: [],
    },
    validation: { // TODO whole validation section
      name: 'Oracles and relayers',
      description:
        'StarGate is built on top of LayerZero protocol. LayerZero relies on oracles to periodically submit source chain block hashes to the destination chain.\
        Once block hash is submitted, relayers can provide the merkle proof for the transfers / swaps.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'oracles or relayers fail to facilitate the transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracles and relayers collude to submit fraudulent block hash and relay fraudulent transfer .',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      {
        address: discovery.getContract('Portal').address, // Portal v2
        sinceTimestamp: new UnixTime(1668373200),
        tokens: ['USDC', 'SIS', 'WETH'],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: discovery.getContract('MetaRouter').address,
        name: 'Symbiosis MetaRouter',
        description:
          '', // TODO
      },
      {
        address: discovery.getContract('MetaRouterGateway').address,
        name: 'Symbiosis MetaRouter Gateway',
        description:
          '', // TODO
      },
      {
        address: discovery.getContract('Bridge').address,
        name: 'Symbiosis Bridge',
        description:
          '', // TODO
      },
      {
        address: discovery.getContract('Portal').address,
        name: 'Symbiosis Portal',
        description:
          '', // TODO
      },
    ],
    risks: [],
    isIncomplete: true,
  },
  permissions: [
    discovery.contractAsPermissioned(
      discovery.getContract('Symbiosis Multisig'),
      'Bridge owner, can create new pools, chainpaths, set fees.', // TODO
    ),
  ],
  knowledgeNuggets: [ // TODO update links to useful resources
    {
      title: 'Security models: isolated vs shared',
      url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
    {
      title: 'StarGate Bridge architecture',
      url: 'https://twitter.com/bkiepuszewski/status/1518568490147450880',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
}
