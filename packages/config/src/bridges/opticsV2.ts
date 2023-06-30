import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const opticsV2: Bridge = {
  type: 'bridge',
  id: ProjectId('opticsV2'),
  display: {
    name: 'Optics V2',
    slug: 'opticsv2',
    category: 'Token Bridge',
    links: {
      websites: ['https://optics.app/'],
      repositories: ['https://github.com/celo-org/optics-monorepo'],
      socialMedia: ['https://twitter.com/CeloOrg'],
    },

    description:
      'Optics is a general messaging bridge that uses optimistic verification to validate cross-chain bridging transactions. Version 2 of the bridge was deployed\
      after Celo governance lost control over the governors MultiSig keys.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x4fc16De11deAc71E8b2Db539d82d93BE4b486892'),
        sinceTimestamp: new UnixTime(1637963549),
        tokens: [
          'WETH',
          'USDC',
          'WBTC',
          'DAI',
          'SUSHI',
          //'SYMM',
          'USDT',
        ],
      },
    ],
  },
  technology: {
    destination: ['Celo', 'Polygon'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Optics Bridge is a Token Bridge with ability to facilitate fast transfers via additional LP-provided liquidity. For deposits, it locks tokens in the escrow contracts on Ethereum and mints a "representation token" on the destination network. When bridging back to Ethereum tokens are burned and then released from the escrow on Ethereum.',
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
        address: EthereumAddress('0xa73a3a74C7044B5411bD61E1990618A1400DA379'),
        name: 'Home',
        description:
          'Optics Home. This contract is used to send x-chain messages, such as deposit requests. Messages are regularly signed by Attester.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x101a39eA1143cb252fc8093847399046fc35Db89'),
          beaconAdmin: EthereumAddress(
            '0x4F50a7081792063693F46A6402390b9647562457',
          ),
          implementation: EthereumAddress(
            '0xfc6E146384b5c65f372d5b20537F3e8727aD3723',
          ),
        },
      },
      {
        address: EthereumAddress('0x27658c5556A9a57f96E69Bbf6d3B8016f001a785'),
        name: 'Replica',
        description:
          'Optics Replica. This contract is used to receive x-chain messages, such as withdrawal requests, from Relayers.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0xA734EDE8229970776e1B68085D579b6b6E97dAd4'),
          beaconAdmin: EthereumAddress(
            '0x4F50a7081792063693F46A6402390b9647562457',
          ),
          implementation: EthereumAddress(
            '0xCBe8b8C4Fe6590BB59d1507dE7f252AF3E621E58',
          ),
        },
      },
      {
        address: EthereumAddress('0x4fc16De11deAc71E8b2Db539d82d93BE4b486892'),
        name: 'BridgeRouter',
        description:
          'Optics Bridge Router. Used to send messages to Home and receive messages from Replica. When receiving messages, it routes them to XAppConnectionManager.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0xB6bB41B1fb8c381b002C405B8abB5D1De0C0abFE'),
          beaconAdmin: EthereumAddress(
            '0x4F50a7081792063693F46A6402390b9647562457',
          ),
          implementation: EthereumAddress(
            '0x688A54c4b1C5b917154Ea2f61B8A4A4CbDfF4738',
          ),
        },
      },
      {
        address: EthereumAddress('0x8A926cE79f83A5A4C234BeE93feAFCC85b1E40cD'),
        name: 'XAppConnectionManager',
        description:
          'Contract managing list of connections to other chains (domains) and list of watchers.',
      },
      {
        address: EthereumAddress('0x4F50a7081792063693F46A6402390b9647562457'),
        name: 'UpgradeBeaconController',
        description: 'Contract managing Beacons.',
      },
      {
        address: EthereumAddress('0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94'),
        name: 'GovernanceRouter',
        description: 'Optics Governance Router. Manages all Optics components.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x4d89F34dB307015F8002F97c1d100d84e3AFb76c'),
          beaconAdmin: EthereumAddress(
            '0x4F50a7081792063693F46A6402390b9647562457',
          ),
          implementation: EthereumAddress(
            '0xe552861e90a42ddDC66b508A18a85bCEAbFcB835',
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
            '0xD0D09d9CF712ccE87141Dfa22a3aBBDb7B1c296e',
          ),
          type: 'EOA',
        },
      ],
      name: 'XAppConnectionManager Watchers',
      description:
        'Watchers can unenroll, i.e. stop receiving messages, from a given Replica.',
    },
  ],
}
