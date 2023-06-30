import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, NUGGETS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('polygon-pos')

export const polygonpos: Bridge = {
  type: 'bridge',
  id: ProjectId('polygon-pos'),
  display: {
    name: 'Polygon PoS',
    slug: 'polygon-pos',
    links: {
      websites: ['https://polygon.technology'],
      explorers: ['https://polygonscan.com'],
      apps: ['https://wallet.polygon.technology'],
      repositories: ['https://github.com/maticnetwork/'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://forum.polygon.technology/',
        'https://reddit.com/r/0xPolygon/',
        'https://facebook.com/0xPolygon.Technology',
        'https://linkedin.com/company/0xpolygon/',
        'https://youtube.com/c/PolygonTV',
        'https://instagram.com/0xpolygon/',
      ],
    },
    description:
      'Polygon PoS it the official bridge provided by the Polygon team to bridge assets from Ethereum to Polygon chain. The bridge is validated by Polygon validators and allows for asset as well as data movement between Polygon and Ethereum.',
    category: 'Token Bridge',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf'),
        sinceTimestamp: new UnixTime(1598436664),
        tokens: [
          'USDC',
          'USDT',
          'WBTC',
          'SAND',
          //'ALTA',
          //'QUICK',
          'DAI',
          //'GHST',
          'AAVE',
          'LINK',
          //'BAL',
          'CRV',
          'MANA',
          'CEL',
          //'DG',
          //'xDG',
          //'BZRX',
          //'AWX',
        ],
      },
      {
        address: EthereumAddress('0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30'),
        sinceTimestamp: new UnixTime(1598437971),
        tokens: ['ETH'],
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Destination Chain',
      description:
        'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: '48 hours delay',
      description:
        'The bridge can be upgraded by 5/9 MSig after 48 hour delay.',
      sentiment: 'warning',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Tokens transferred end up as ERC20 proxies, some of them are upgradable. The contract is named UChildERC20Proxy.',
    },
  },
  technology: {
    destination: ['Polygon'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a very typical Token Bridge that locks tokens in the escrow contracts on Ethereum and mints tokens on the Polygon network. When bridging back to Ethereum tokens are burned on Polygon and then released from the escrow on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Outbound transfers are externally verified, inbound require merkle proof',
      description:
        'Validators on the Polygon network watch for events on Ethereum and when they see that tokens have been locked they mint new tokens on Polygon. Every 30 minutes validators submit new Polygon state checkpoints to the Ethereum smart contracts. To withdraw tokens users need to present a merkle proof of a burn event that is verified against the checkpoints.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators on Polygon decide to not mint tokens after observing an event on Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators submit a fraudulent checkpoint allowing themselves to withdraw all locked funds.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
    destinationToken: {
      name: 'Destination tokens are upgradeable',
      description:
        'Tokens transferred end up as wrapped ERC20 proxies, some of them are upgradable. The contract is named UChildERC20Proxy.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  contracts: {
    // TODO: we need all contracts (check roles on escrows) and a diagram
    isIncomplete: true,
    addresses: [
      discovery.getContractDetails(
        'RootChainManager',
        'Main contract to manage bridge tokens, deposits and withdrawals.',
      ),
      discovery.getContractDetails(
        'StateSender',
        'Smart contract containing logic for syncing the state of the bridge.',
      ),
      discovery.getContractDetails(
        'RootChain',
        'Contract storing Polygon sidechain checkpoints. Note that validity of these checkpoints is not verified, it is assumed they are valid if signed by 2/3 of the Polygon Validators.',
      ),
      discovery.getContractDetails(
        'Timelock',
        'Contract enforcing delay on code upgrades.',
      ),
      discovery.getContractDetails(
        'ERC20Predicate',
        'Escrow contract for ERC20 tokens.',
      ),
      discovery.getContractDetails(
        'EtherPredicate',
        'Escrow contract for ETH.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('48 hours')],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Polygon Multisig',
      'Can propose and execute code upgrades on escrows via Timelock contract.',
    ),
  ],
  knowledgeNuggets: [
    {
      title: 'Is Polygon a side-chain?',
      url: 'https://twitter.com/bkiepuszewski/status/1380404149888675840',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
}
