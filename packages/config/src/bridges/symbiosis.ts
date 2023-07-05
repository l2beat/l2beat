import { ProjectId, UnixTime } from '@l2beat/shared-pure'

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
    category: 'Hybrid',
    description:
      'Symbiosis is a cross-chain AMM DEX externally validated my a MPC relayers network.',
    links: {
      websites: [
        'https://symbiosis.finance/',
        'https://app.symbiosis.finance/swap',
      ],
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
      value: 'Third party',
      description:
        '2/3 of the MPC group (the Symbiosis relayers network) is required to create a cross-chain message with the MPC signature.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Contracts are upgradable using a Multisig.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL_OR_WRAPPED,
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
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Symbiosis uses a MPC relayer network to facilitate cross-chain transfers. An AMM on BOBA BNB is used to perform swaps.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Requests are watched by a relayer network that, utilizing MPC, signs off swaps and token minting.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'MPC nodes decide to censor certain transactions.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'MPC nodes decide to maliciously takeover them or there is an external exploit which will result in signing malicious transaction.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'MPC nodes lose their private keys.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Received tokens can be wrapped tokens or native tokens depending on the destination network.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'destination token contract is maliciously upgraded or not securely implemented.',
          isCritical: true,
        },
      ],
      references: [],
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
        name: 'MetaRouter',
        description:
          'An upgradeable contract to process funds by provided route.',
      },
      {
        address: discovery.getContract('MetaRouterGateway').address,
        name: 'MetaRouter Gateway',
        description:
          "A detached contract for secure isolation of users' assets.",
      },
      {
        address: discovery.getContract('Bridge').address,
        name: 'Bridge',
        description:
          'A contract that generates Orcle requests for the Symbiosis relayers network.',
      },
      {
        address: discovery.getContract('Portal').address,
        name: 'Portal',
        description: 'A contract that stores "bridged" liquidity.',
      },
    ],
    risks: [],
    isIncomplete: true,
  },
  permissions: [
    discovery.contractAsPermissioned(
      discovery.getContract('Multisig'),
      'This multisig can upgrade the BridgeV2 and Portal contracts.',
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
