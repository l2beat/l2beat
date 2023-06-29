import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const opticsV1: Bridge = {
  type: 'bridge',
  id: ProjectId('opticsV1'),
  display: {
    name: 'Optics V1',
    slug: 'opticsv1',
    category: 'Token Bridge',
    links: {
      websites: ['https://old.optics.app/'],
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
        address: EthereumAddress('0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47'),
        sinceTimestamp: new UnixTime(1631142795),
        tokens: [
          'WETH',
          'USDC',
          'USDT',
          'DAI',
          'SUSHI',
          'WBTC',
          //'SYMM',
          'AAVE',
          'CRV',
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
        address: EthereumAddress('0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97'),
        name: 'Home',
        description:
          'Optics Home. This contract is used to send x-chain messages, such as deposit requests. Messages are regularly signed by Attester.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x9E4C2547307e221383A4bcba6065389C69Bd4628'),
          beaconAdmin: EthereumAddress(
            '0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B',
          ),
          implementation: EthereumAddress(
            '0xfAc41463ef1E01546F2130F92184a053A0E3Fa14',
          ),
        },
      },
      {
        address: EthereumAddress('0x7725EadaC5Ee986CAc8317a1d2fB16e59e079E8b'),
        name: 'Replica',
        description:
          'Optics Replica. This contract is used to receive x-chain messages, such as withdrawal requests, from Relayers.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x10a432946e24C49866c243a13BE7205B3EF929ee'),
          beaconAdmin: EthereumAddress(
            '0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B',
          ),
          implementation: EthereumAddress(
            '0xFC4060e4Fd5979f848b8EDc8505d2f89D83b9E04',
          ),
        },
      },
      {
        address: EthereumAddress('0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47'),
        name: 'BridgeRouter',
        description:
          'Optics Bridge Router. Used to send messages to Home and receive messages from Replica. When receiving messages, it routes them to XAppConnectionManager.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x3b96B42D1F4962CB21049fB237A886E2860AfacB'),
          beaconAdmin: EthereumAddress(
            '0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B',
          ),
          implementation: EthereumAddress(
            '0x67364232A8f8dA6f22dF3bE3408ef9872132F2A6',
          ),
        },
      },
      {
        address: EthereumAddress('0xcEc158A719d11005Bd9339865965bed938BEafA3'),
        name: 'XAppConnectionManager',
        description:
          'Contract managing list of connections to other chains (domains) and list of watchers.',
      },
      {
        address: EthereumAddress('0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B'),
        name: 'UpgradeBeaconController',
        description: 'Contract managing Beacons.',
      },
      {
        address: EthereumAddress('0x42303634F37956687fB7ff2c6146AC842481A052'),
        name: 'GovernanceRouter',
        description: 'Optics Governance Router. Manages all Optics components.',
        upgradeability: {
          type: 'Beacon',
          beacon: EthereumAddress('0x681Edb6d52138cEa8210060C309230244BcEa61b'),
          beaconAdmin: EthereumAddress(
            '0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B',
          ),
          implementation: EthereumAddress(
            '0xDFb2A95900d6b7c8AA95F2E46563a5FCFb5505A1',
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
            '0x5Fa96B622D1F4e920b92040c10fA297ca496ad37',
          ),
          type: 'MultiSig',
        },
      ],
      name: 'Optics V1 Governor',
      description:
        'Manages Optics V1 bridge components via GovernanceRouter contract.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0xeE42B7757798cf495CDaA8eDb0CC237F07c60C81',
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
