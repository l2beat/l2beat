import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'
const discovery = new ProjectDiscovery('opticsV1')

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
      discovery.getContractDetails('HomeBeaconProxy', {
        description:
          'Optics Home. This contract is used to send x-chain messages, such as deposit requests. Messages are regularly signed by Attester.',
      }),
      discovery.getContractDetails('ReplicaBeaconProxy', {
        description:
          'Optics Replica. This contract is used to receive x-chain messages, such as withdrawal requests, from Relayers.',
      }),
      discovery.getContractDetails('BridgeRouterBeaconProxy', {
        description: 'Optics Governance Router. Manages all Optics components.',
      }),
      discovery.getContractDetails('XAppConnectionManager', {
        description:
          'Contract managing list of connections to other chains (domains) and list of watchers.',
      }),
      discovery.getContractDetails('GovernanceRouterBeaconProxy', {
        description: 'Optics Governance Router. Manages all Optics components.',
      }),
      discovery.getContractDetails('UpdaterManager', {
        description:
          'Contract allowing Home to slash Updater. Currently does nothing, intended for future functionality.',
      }),
      discovery.getContractDetails('UpgradeBeaconController', {
        description: 'Contract managing Beacons.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Governor',
      'Manages Optics V1 bridge components via GovernanceRouter contract.',
    ),
    ...discovery.getMultisigPermission(
      'RecoveryManager',
      'Manages Optics V1 bridge recovery via GovernanceRouter contract.',
    ),
    {
      name: 'Updater',
      accounts: [discovery.getPermissionedAccount('UpdaterManager', 'updater')],
      description: 'Permissioned account that can update message roots.',
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
