import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import { CONTRACTS, NUGGETS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('polygon-pos')

const delayString = formatSeconds(
  discovery.getContractValue('Timelock', 'getMinDelay'),
)

const upgrades = {
  upgradableBy: ['PolygonMultisig'],
  upgradeDelay: delayString,
}

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
      discovery.getEscrowDetails({
        // ERC20Predicate
        address: EthereumAddress('0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf'),
        sinceTimestamp: new UnixTime(1598436664),
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // MintableERC20Predicate
        address: EthereumAddress('0x9923263fA127b3d1484cFD649df8f1831c2A74e4'),
        sinceTimestamp: new UnixTime(1613100720),
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // EtherPredicate
        address: EthereumAddress('0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30'),
        sinceTimestamp: new UnixTime(1598437971),
        tokens: ['ETH'],
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // ERC20EscrowPredicate for TOWER token
        address: EthereumAddress('0x21ada4D8A799c4b0ADF100eB597a6f1321bCD3E4'),
        sinceTimestamp: new UnixTime(1598437971),
        tokens: '*',
        ...upgrades,
      }),
      // ERC20MintBurnablePredicate is not used
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
      value: `${delayString}`,
      description: `The bridge can be upgraded by 5/9 MSig after ${delayString} hour delay.`,
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
        'Validators on the Polygon network watch for events on Ethereum and when they see that tokens have been locked they mint new tokens on Polygon. Around every 30 minutes validators submit new Polygon state checkpoints to the Ethereum smart contracts. To withdraw tokens users need to present a merkle proof of a burn event that is verified against the checkpoints.',
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
    addresses: [
      discovery.getContractDetails('RootChain', {
        description:
          'Contract storing Polygon PoS chain checkpoints. Note that validity of these checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the Polygon Validators.',
        ...upgrades,
      }),
      discovery.getContractDetails(
        'StateSender',
        'Smart contract allowing whitelisted addresses to send messages to contracts on Polygon PoS chain.',
      ),
      discovery.getContractDetails('RootChainManager', {
        description:
          'Main configuration contract to manage tokens, token types, escrows (predicates) for given token types.\
          It also serves as an entry point for deposits and withdrawals effectively acting as a token router.',
        ...upgrades,
      }),
      discovery.getContractDetails('StakeManager', {
        description:
          'Main configuration contract to manage stakers and their voting power.',
        ...upgrades,
      }),
      discovery.getContractDetails('Registry', {
        description:
          'A registry of different system components.',
        ...upgrades,
      }),
      discovery.getContractDetails(
        'Timelock',
        `Contract enforcing delay on code upgrades. The current delay is ${delayString}.`,
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(`${delayString}`)],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'PolygonMultisig',
      'Can propose and execute code upgrades via Timelock contract.',
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
