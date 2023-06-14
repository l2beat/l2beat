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
        'Symbiosis is a cross-chain AMM DEX that pools together liquidity from different networks. Best rates for any to any token swaps regardless of the blockchain network: Avalanche, BNB, Boba, Ethereum, Polygon, ZkSync and Arbitrum supported.',
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
    validatedBy: { 
      value: 'Validation network',
      description:
          'Consensus of the MPC group (the Symbiosis relayers network) is required to create a cross-chain message with the MPC signature.',
      sentiment: 'warning',
    },
    sourceUpgradeability: { 
      value: 'Yes',
      description:
          'Contracts could be upgraded. Upgrade is possible with 3/5 threshold in gnosis safe.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL, 
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
    principleOfOperation: { 
      name: 'Principle of operation',
      description:
        'Symbiosis is a decentralized exchange that pools together liquidity from different blockchains, whether they use EVM technology or not. \
        With Symbiosis, users can effortlessly trade any token and transfer their assets across blockchains. No need to worry about which network a \
        token is on or how to move funds between different blockchains. All cross-chain operations are done in a single click (one transaction) at \ 
        competitive exchange rates and transaction costs.',
      references: [],
      risks: [],
    },
    validation: { 
      name: 'Oracles and relayers',
      description:
        'An Oracle request from one network to another could only be transfered when majority of relayers reach a consensus about the correctness of the request.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'Relayers fail to facilitate the transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'The majority of the Symbiosis relayers network is compromised, or the majority of multi-signatutore participants are compromised.',
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
          'An upgradeable contract to process funds by provided route.',
      },
      {
        address: discovery.getContract('MetaRouterGateway').address,
        name: 'Symbiosis MetaRouter Gateway',
        description:
          'A detached contract for secure isolation of users\' assets.',
      },
      {
        address: discovery.getContract('Bridge').address,
        name: 'Symbiosis Bridge',
        description:
          'A contract that generates Orcle requests for the Symbiosis relayers network.',
      },
      {
        address: discovery.getContract('Portal').address,
        name: 'Symbiosis Portal',
        description:
          'A contract that stores "bridged" liquidity.',
      },
    ],
    risks: [],
    isIncomplete: true,
  },
  permissions: [
    discovery.contractAsPermissioned(
      discovery.getContract('Symbiosis Multisig'),
      'Owner and ProxyAdmin of all upgradable contracts.', 
    ),
  ],
  knowledgeNuggets: [ 
    {
      title: 'Bridging contracts explained',
      url: 'https://docs.symbiosis.finance/crosschain-liquidity-engine/bridge-contracts',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
    {
      title: 'Relayers network explained',
      url: 'https://docs.symbiosis.finance/relayers-network/pos-relayers-network',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
   {
      title: 'Audits',
      url: 'https://docs.symbiosis.finance/main-concepts/security-audits-of-symbiosis',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    
  ],
}
