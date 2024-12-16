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

const upgrades = {
  upgradableBy: ['PolygonMultisig'],
  upgradeDelay: 'No delay',
}

const delayString = formatSeconds(
  discovery.getContractValue('Timelock', 'getMinDelay'),
)

export const polygonpos: Bridge = {
  type: 'bridge',
  id: ProjectId('polygon-pos'),
  createdAt: new UnixTime(1664808578), // 2022-10-03T14:49:38Z
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
    associatedTokens: ['POL', 'MATIC'],
    escrows: [
      discovery.getEscrowDetails({
        // DepositManager
        address: EthereumAddress('0x401F6c983eA34274ec46f84D70b31C151321188b'),
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // ERC20Predicate
        address: EthereumAddress('0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf'),
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // MintableERC20Predicate
        address: EthereumAddress('0x9923263fA127b3d1484cFD649df8f1831c2A74e4'),
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // EtherPredicate
        address: EthereumAddress('0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30'),
        tokens: ['ETH'],
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // ERC20EscrowPredicate for TOWER token
        address: EthereumAddress('0x21ada4D8A799c4b0ADF100eB597a6f1321bCD3E4'),
        tokens: '*',
        ...upgrades,
      }),
      // ...other predicates up until PolygonERC20MintBurnPredicate do not hold funds
      discovery.getEscrowDetails({
        // old MaticWETH contract escrowing ETH sent to Polygon
        address: EthereumAddress('0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8'),
        tokens: ['ETH'],
      }),
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
      value: `Yes`,
      description: `The bridge can be upgraded by 5/9 MSig.`,
      sentiment: 'bad',
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
        'Validators on the Polygon network watch for events on Ethereum, and when they see that tokens have been locked they mint new tokens on Polygon. Around every 30 minutes validators submit new Polygon state checkpoints to the Ethereum smart contracts. To withdraw tokens, users need to present a merkle proof of a burn event that is verified against the checkpoints.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators on Polygon decide to not mint tokens after observing an event on Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators submit a fraudulent checkpoint allowing themselves to withdraw all locked funds.',
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
          'Main configuration contract to manage stakers and their voting power and validate checkpoint signatures.',
        ...upgrades,
      }),
      discovery.getContractDetails(
        'StakingInfo',
        'Contains logging and getter functions about staking on Polygon.',
      ),
      discovery.getContractDetails('SlashingManager', {
        description:
          'A contract privileged to slash validators in StakeManager via slash() method.',
        ...upgrades,
      }),
      discovery.getContractDetails('Registry', {
        description:
          'Maintains the addresses of the contracts used in the system.',
      }),
      discovery.getContractDetails(
        'StateSender',
        'Smart contract containing the logic for syncing the state of registered bridges to the other chain.',
      ),
      discovery.getContractDetails('DepositManager', {
        description:
          'Contract to deposit and escrow ETH, ERC20 or ERC721 tokens. Currently only used for POL.',
        ...upgrades,
      }),
      discovery.getContractDetails('WithdrawManager', {
        description:
          "Contract handling users' withdrawal finalization for tokens escrowed in DepositManager.",
        ...upgrades,
      }),
      discovery.getContractDetails('ERC20PredicateBurnOnly', {
        description:
          'Contract used to initiate ERC20 token withdrawals. The function to handle Plasma proofs is empty, meaning exits cannot be challenged.',
      }),
      discovery.getContractDetails('ERC721PredicateBurnOnly', {
        description:
          'Contract used to initiate ERC721 token withdrawals. The function to handle Plasma proofs is empty, meaning exits cannot be challenged.',
      }),

      discovery.getContractDetails('EventsHub', {
        description: 'Contains events used by other contracts in the system.',
        ...upgrades,
      }),

      discovery.getContractDetails(
        'ExitNFT',
        'NFTs used to represent a withdrawal in the withdrawal PriorityQueue (Only used for tokens initially deposited via DepositManager).',
      ),
      discovery.getContractDetails(
        'Timelock',
        `Contract enforcing delay on code upgrades. The current delay is ${delayString}.`,
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'PolygonMultisig',
      'Can propose and execute code upgrades.',
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
