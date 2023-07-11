import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const nomad: Bridge = {
  type: 'bridge',
  id: ProjectId('nomad'),
  isArchived: true,
  display: {
    name: 'Nomad',
    slug: 'nomad',
    warning:
      'The Nomad token bridge contract has recently been exploited and currently is not operational.',
    category: 'Token Bridge',
    links: {
      websites: ['https://app.nomad.xyz/', 'https://docs.nomad.xyz/'],
      repositories: ['https://github.com/nomad-xyz/monorepo'],
      socialMedia: [
        'https://twitter.com/nomadxyz_',
        'https://discord.gg/nomadxyz',
      ],
    },
    description:
      'Nomad is a general messaging bridge that uses optimistic verification to validate cross-chain bridging transactions.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3'),
        sinceTimestamp: new UnixTime(1641899423),
        tokens: [
          'USDC',
          'FRAX',
          //'IAG',
          'WETH',
          'USDT',
          'WBTC',
          'DAI',
          //'CQT',
          'FXS',
        ],
      },
    ],
  },
  technology: {
    destination: ['Avalanche', 'Evmos', 'Milkomedia C1', 'Moonbeam'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Nomad Bridge is a Token Bridge with ability to facilitate fast transfers via additional LP-provided liquidity. For deposits, it locks tokens in the escrow contracts on Ethereum and mints a "representation token" on the destination network. When bridging back to Ethereum tokens are burned and then released from the escrow on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Optimistic Validation',
      description:
        'Messages on the source (home) chain are periodically signed by Updater. Updater cannot censor messages and if it refuses to attest them, it can be changed by the governance. \
        Once message batch is attested, it is relayed to the destination (replica) by the permissionless Relayers. After 20 min fraud proof window messages can be delivered to the destination \
        contract. During 20 min fraud proof window, if malicious Updater tries to relay invalid message batch, anyone can submit a fraud proof to the source (home) chain slashing Updater \
        and stopping home contract. On the destination messages cannot be stopped, so receiving contracts have to be independently notified to not process messages.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'updater fails to attest messages and governance does not change the Updater.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'updater manages to relay fraudulent message batch and is not slashed by Watchers during 20 min fraud proof window.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'destination contract does not block receiving fraudulent messages after malicious Updater has been slashed.',
          isCritical: false,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens are upgradeable',
      description:
        'Tokens transferred end up as "representation tokens" some of them may be upgradable.',
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
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description:
        'Messages are relayed to the destination chain and assumed to be correct unless challenged within the 20 min fraud proof window.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Bridge can be upgraded by 3/5 MultiSig.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.WRAPPED,
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x92d3404a7E6c91455BbD81475Cd9fAd96ACFF4c8'),
        name: 'Home',
        description:
          'Nomad Home. This contract is used to send x-chain messages, such as deposit requests. Messages are regularly signed by Attester.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x063e871f8DB991CEAd34B557A00B157B360084cc'),
          beaconAdmin: EthereumAddress(
            '0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e',
          ),
          implementation: EthereumAddress(
            '0x1f98FDc4D8d0806eB3902d57df7a2183b333B80C',
          ),
        },
      },
      {
        address: EthereumAddress('0x049b51e531Fd8f90da6d92EA83dC4125002F20EF'),
        name: 'Replica',
        description:
          'Nomad Replica. This contract is used to receive x-chain messages, such as withdrawal requests, from Relayers.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x0876dFe4AcAe0e1c0a43302716483f5752298b71'),
          beaconAdmin: EthereumAddress(
            '0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e',
          ),
          implementation: EthereumAddress(
            '0xb92336759618f55bd0f8313bd843604592e27bd8',
          ),
        },
      },
      {
        address: EthereumAddress('0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3'),
        name: 'BridgeRouter',
        description:
          'Nomad Bridge Router. Used to send messages to Home and receive messages from Replica. When receiving messages, it routes them to XAppConnectionManager.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0xB70588b1A51F847d13158ff18E9Cac861dF5Fb00'),
          beaconAdmin: EthereumAddress(
            '0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e',
          ),
          implementation: EthereumAddress(
            '0x15fdA9F60310d09FEA54E3c99d1197DfF5107248',
          ),
        },
      },
      {
        address: EthereumAddress('0xFe8874778f946Ac2990A29eba3CFd50760593B2F'),
        name: 'XAppConnectionManager',
        description:
          'Contract managing list of connections to other chains (domains) and list of watchers.',
      },
      {
        address: EthereumAddress('0x0A6f564C5c9BeBD66F1595f1B51D1F3de6Ef3b79'),
        name: 'Token Registry',
        description: 'Nomad Token Registry.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x4D5ff8A01ed833E11Aba43821D2881A5F2911F98'),
          beaconAdmin: EthereumAddress(
            '0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e',
          ),
          implementation: EthereumAddress(
            '0xa7E4Fea3c1468D6C1A3A77e21e6e43Daed855C1b',
          ),
        },
      },
      {
        address: EthereumAddress('0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e'),
        name: 'UpgradeBeaconController',
        description: 'Contract managing Beacons.',
      },
      {
        address: EthereumAddress('0x3009C99D370B780304D2098196f1EBF779a4777a'),
        name: 'GovernanceRouter',
        description: 'Nomad Governance Router. Manages all Nomad components.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x67833a48b3F509d4252ac2c19cd604556eD6c981'),
          beaconAdmin: EthereumAddress(
            '0xdB378579c2Af11817EEA21474A39F95B5b9DfD7e',
          ),
          implementation: EthereumAddress(
            '0x569D80f7FC17316B4C83f072b92EF37B72819DE0',
          ),
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x93277b8f5939975b9E6694d5Fd2837143afBf68A',
          ),
          type: 'MultiSig',
        },
      ],
      name: 'Nomad Governor',
      description:
        'Manages Nomad bridge components via GovernanceRouter contract.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x9E8e7eb5886A9C77E955Fd5D717581556eb7F98D',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x499B1Fa18E3CaC1c8cDF2B14C458aA70A6a2B68f',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xcE941bbAD38B35bD7F6B039Af5AE67F8F0c99960',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x06D8902cfae8235047DC7783875279311798c715',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x9782A3C8128f5D1BD3C9655d03181ba5b420883E',
          ),
          type: 'EOA',
        },
      ],
      name: 'XAppConnectionManager Watchers',
      description:
        'Watchers can unenroll, i.e. stop receiving messages, from a given Replica.',
    },
  ],
  milestones: [
    {
      name: 'Contracts hacked for $190M',
      date: '2022-08-02T00:00:00.00Z',
      link: 'https://rekt.news/nomad-rekt/',
    },
  ],
}
