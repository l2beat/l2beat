import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('opticsV1')
const challengeWindowSeconds = discovery.getContractValue<number>(
  'ReplicaBeaconProxy',
  'optimisticSeconds',
)

export const opticsV1: Bridge = {
  type: 'bridge',
  id: ProjectId('opticsV1'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
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
      'Optics is a general messaging bridge that uses optimistic verification to validate cross-chain bridging transactions.',
    detailedDescription:
      'Version 2 of the bridge was deployed after Celo governance lost control over the governors MultiSig keys.',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47',
        ),
        tokens: '*',
      }),
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
      name: 'Third Party',
      description: `Messages on the source (home) chain are periodically signed by Updater. Updater cannot censor messages and if it refuses to attest them, it can be changed by the governance. \
        Once message batch is attested, it is relayed to the destination (replica) by the permissionless Relayers. After the ${formatSeconds(
          challengeWindowSeconds,
        )} fraud proof window messages can be delivered to the destination \
        contract. During the fraud proof window, if malicious Updater tries to relay invalid message batch, anyone can submit a fraud proof to the source (home) chain slashing Updater \
        and stopping home contract. On the destination messages cannot be stopped, so receiving contracts have to be independently notified to not process messages. Currently this mechanism is not implemented.`,
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'updater fails to attest messages and governance does not change the Updater.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'updater manages to relay a fraudulent message batch.',
          isCritical: false,
        },
        {
          category: 'Funds can be stolen if',
          text: 'destination contract does not block receiving fraudulent messages.',
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
        },
      ],
      isIncomplete: true,
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: `Messages are relayed to the destination chain and assumed to be correct unless challenged within the ${formatSeconds(
        challengeWindowSeconds,
      )} fraud proof window, but the slashing mechanism is not implemented yet.`,
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.WRAPPED,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('HomeBeaconProxy', {
          description:
            'Optics Home. This contract is used to send x-chain messages, such as deposit requests. Messages are regularly signed by the Updater.',
        }),
        discovery.getContractDetails('ReplicaBeaconProxy', {
          description:
            'Optics Replica. This contract is used to receive x-chain messages, such as withdrawal requests, from Relayers.',
        }),
        discovery.getContractDetails('BridgeRouterBeaconProxy', {
          description:
            'Optics Governance Router. Manages all Optics components.',
        }),
        discovery.getContractDetails('XAppConnectionManager', {
          description:
            'Contract managing list of connections to other chains (domains) and list of watchers.',
        }),
        discovery.getContractDetails('GovernanceRouterBeaconProxy', {
          description:
            'Optics Governance Router. Manages all Optics components.',
        }),
        discovery.getContractDetails('UpdaterManager', {
          description:
            'Contract allowing Home to slash Updater. Currently does nothing, intended for future functionality.',
        }),
        discovery.getContractDetails('UpgradeBeaconController', {
          description: 'Contract managing Beacons.',
        }),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'Governor',
          'Manages Optics V1 bridge components via GovernanceRouter contract.',
        ),
        discovery.getMultisigPermission(
          'RecoveryManager',
          'Manages Optics V1 bridge recovery via GovernanceRouter contract.',
        ),
        discovery.getPermissionDetails(
          'Updater',
          discovery.getPermissionedAccounts('UpdaterManager', 'updater'),
          'Permissioned account that can update message roots.',
        ),
        discovery.getPermissionDetails(
          'XAppConnectionManager Watchers',
          discovery.getPermissionedAccounts(
            'XAppConnectionManager',
            'watchers',
          ),
          'Watchers can unenroll, i.e. stop receiving messages, from a given Replica.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
